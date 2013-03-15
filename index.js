var util = require("util"),
    config = require("rc")("popcornd", {
      port: 6379,
      server: "127.0.0.1",
      channel: "popcorn"
    }),
    redis = require("./lib/redis")(config),
    rpi = require("./lib/rpi"),
    forcible;

redis.on("connect", function(){
  util.log("Redis connected.");
  rpi.on('on', function(){
    util.log('Publishing ON event.');
    redis.publish('on');
  });
  rpi.on('off', function(){
    util.log('Publishing OFF event.');
    redis.publish('off');
  });
});

redis.on("end", function(){
  util.log("Redis connection ended.");
  process.exit(0);
});

redis.on("error", function(){
  util.log("Error - ", arguments);
});

process.on("SIGINT", function(){
  if (!forcible) {
    util.log("Terminating (CTRL+C again to quit forcibly).");
    redis.quit();
    rpi.teardown();
    forcible = true;
  } else {
    util.log("Terminating forcibly.");
    redis.end();
  }
});

util.log("Attempting to connect to redis.");
redis.connect();