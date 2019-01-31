const fs = require('fs');
const EventEmitter = require('events');

class WritableStream extends EventEmitter {
	constructor(path, options) {
		super();
		this.path = path;
		this.highWaterMark = options.highWaterMark || 16 * 1024;
		this.autoClose = options.autoClose || true;
		this.encoding = options.encoding || 'utf8';
		this.mode = options.mode;
		this.start = options.start || 0;
		this.flags = options.flags || 'w';
		this.buffers = [];
		this.writing = false;
		this.needDrain = false;
		this.pos = 0;
		this.length = 0;

		this.open();
	}
	open() {
		fs.open(this.path, this.flags, this.mode, (err, fd) => {
			if(err) {
				this.emit('error', err);
				if(this.autoClose) {
					this.destory();
				}
				return;
			}
			this.fd = fd;
			this.emit('open');
		});
	}
	destory() {
		if(typeof this.fd !== 'number') {
			return this.emit('close');
		}
		fs.close(this.fd, () => {
			this.emit('close');
		})
	}
	write(chunk, encoding = this.encoding, cb) {
		chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding);

		this.length += chunk.length;

		let result = this.length < this.highWaterMark;
		this.needDrain = !result;

		if(this.writing){
			this.buffers.push({chunk, encoding, cb});
		}else{
			this.writing = true;
			this._write(chunk, encoding, () => {
                cb && cb();
                this.clearBuffer();
            });
		}
		return result;
	}
	_write(chunk, encoding, cb){
		if(typeof this.fd !== 'number'){
			return this.once('open', () => this._write(chunk, encoding, cb))
		}

		fs.write(this.fd, chunk, 0, chunk.length, this.pos, (err, bytesWrite) => {
			this.length -= bytesWrite;
			this.pos += bytesWrite;
			this.writing = false;
			cb && cb();
		})
	}
	clearBuffer() {
		let buf = this.buffers.shift();
		if(buf){
			this._write(buf.chunk, buf.encoding, () => {
				buf.cb && buf.cb();
				this.clearBuffer();
			})
		}else{
			if(this.needDrain){
				this.needDrain = false;
				this.emit('drain');
			}
		}
	}
	end() {
		if (this.autoClose) {
            this.emit('end');
            this.destory();
        }
	}
}

module.exports = WritableStream;