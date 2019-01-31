const { Duplex } = require('stream');

let d = Duplex({
	read() {
		this.push('hehe');
		this.push(null);
	},
	write(chunk, encoding, callback) {
		console.log(chunk.toString());
		callback();
	}
});

d.on('data', function(data){
	console.log(data.toString());
});

d.write('data');