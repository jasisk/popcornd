var fs = require('fs'),
    util = require('util'),
    events = require('events');

var eventMap = {
  '0': 'off',
  '1': 'on'
};

util.inherits(Pi, events.EventEmitter);

function Pi(){
  this.setup();
}

Pi.prototype.setup = function(){
  this.timeout = null;
  this.state = null;
  this.emit('watching');
};

Pi.prototype.set = function(val){
  if (this.state !== val && this.state != undefined) {
    this.emit(val);
  }
  this.state = val;
};

Pi.prototype.read = function(){
  var self = this;
  fs.readFile('/sys/class/gpio/gpio23/value', 'utf8', function(err, val){
    var value = eventMap[val.trim()];
    if (!err && value){
      self.set(value);
      self.timeout = setTimeout(self.read.bind(self), 500);
    }
  });
};

Pi.prototype.teardown = function(){
  if (this.timeout) {
    clearTimeout(this.timeout);
  }
  this.emit('end');
};

module.exports = new Pi();