function Event() {
	this._init();
}

Event.prototype._init = function() {
	this.dep = new Map();
	this.eventId = 0;
	this.maxEvents = 5;
}

Event.prototype.on = function(type, fun) {
	if(typeof fun !== 'function') {
		console.warn('must be function');
	}
	if(!this.dep[type]){
		this.dep[type] = [];
	}
	if(this.dep[type].length >= this.maxEvents){
		console.warn('max event number is ' + this.maxEvents);
	}
	this.dep[type].push({
		id: ++this.eventId,
		fun: fun
	});
	return this.eventId;
}

Event.prototype.emit = function(type, data) {
	if(!this.dep[type]) return;
	this.dep[type].forEach(function(item){
		item.fun(type, data);
	});
}

Event.prototype.once = function(type, fun) {
	this.on(type, fun);
	this.removeListener(type, fun);
}

Event.prototype.removeListener = function(type, fun) {
	let deleted = false
	this.dep[type].forEach(function(item, index){
		if(item.fun === fun){
			this.dep[type].splice(index, 1);
			return deleted = true;
		}
	});
	return deleted;
}