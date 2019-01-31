const ReadableStream = require('./readableStream');
const WritableStream = require('./writableStream');

const read = new ReadableStream('./file.text', {
	highWaterMark: 3
});

const write = new WritableStream('./file2.text', {});

read.on('data', (chunk) => {
	write.write(chunk);
});

