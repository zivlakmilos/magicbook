var Plugin = function(){};

Plugin.prototype = {

  hooks: {
    setup: function(config, extras, callback) {
      callback(null, config, extras);
    }
  }
}

module.exports = Plugin;
