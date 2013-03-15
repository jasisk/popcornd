var redis = require("redis"),
    util = require("util"),
    events = require("events");

module.exports = function(opts){
  return new Redis(opts);
};

util.inherits(Redis, events.EventEmitter);

function Redis(opts){
  var self = this;
  this.channel = opts.channel;
  this.client = null;
}

Redis.prototype.connect = function(server, port){
  var self = this;
  this.client = redis.createClient(server, port);
  this.quit = this.client.quit.bind(this.client);
  this.end = this.client.end.bind(this.client);
  var oldEmit = this.client.emit;
  this.client.emit = function(){
    self.emit.apply(self, arguments);
    oldEmit.apply(self.client, arguments);
  };
};

Redis.prototype.publish = function(event){
  var payload = JSON.stringify({type: event});
  this.client.publish(this.channel, payload);
};