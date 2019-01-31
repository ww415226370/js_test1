const fs = require('fs');
const EventEmitter = require('events');

class ReadableStream extends EventEmitter {
	constructor(path, options) {
		super();

		this.path = path;
		this.flags = options.flags || 'r';
		this.autoClose = options.autoClose || true;
		this.encoding = options.encoding || null;
		this.highWaterMark = options.highWaterMark || 64 * 1024;
		this.start = options.start || 0;
		this.end = options.end;

		this.flowing = null;
		this.buffer = Buffer.alloc(this.highWaterMark);
		this.pos = this.start;
		this.open();

		this.on('newListener', (eventName, callback) => {
			if(eventName === 'data'){
				this.flowing = true;
				this.read();
			}
		})
	}
	open() {
		fs.open(this.path, this.flags, (err, fd) => {

			if(err) {
				if(this.autoClose) {
					this.destory();
				}
				this.emit('error', err);
				return;
			}
			this.fd = fd;
			this.emit('open');
		});
	}
	destory() {
		if(typeof this.fd === 'number') {
			fs.close(this.fd, () => {
				this.emit('close');
			})
			return;
		}
		this.emit('close');
	}
	read() {
		if(typeof this.fd !== 'number') {
			return this.once('open', () => this.read());
		}

		let howMuchToRead = this.end ? Math.min((this.end-this.pos+1), this.highWaterMark) : this.highWaterMark;

		fs.read(this.fd, this.buffer, 0, howMuchToRead, this.pos, (err, bytesRead) => {
			if(bytesRead > 0){
				this.pos += bytesRead;

				let buf = this.buffer.slice(0, bytesRead);

				let data = this.encoding ? buf.toString(this.encoding) : buf.toString();

				this.emit('data', data);

				if(this.pos > this.end) {
					this.emit('end');
					this.destory();
				}

				if(this.flowing){
					this.read();
				}
			}else{
				this.emit('end');
				this.destory();
			}
		});
	}
	pause() {
		this.flowing = false;
	}
	resume() {
		this.flowing = true;
		this.read();
	}
}

module.exports = ReadableStream;