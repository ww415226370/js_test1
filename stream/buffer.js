Buffer.prototype.myCopy = function(to, start, sourceStart, sourceEnd){
	for(let i = sourceStart; i < sourceEnd; i ++){
		to[i+start] = this[i];
	}
}


let buf1 = Buffer.from('前');
let buf2 = Buffer.from('端');
console.log(buf1)

let buffer = Buffer.alloc(6);

buf1.myCopy(buffer, 0, 0, 3);

buf2.myCopy(buffer, 3, 0, 3);

console.log(buffer.toString());

let b = buffer.length;

console.log(b)