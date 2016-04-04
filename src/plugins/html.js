var vfs = require('vinyl-fs');

var Plugin = function(){};

Plugin.prototype = {

  hooks: {

    finish: function(config, stream, extras, callback) {

      if(config.format == "html") {

        stream = stream.pipe(vfs.dest(extras.destination));
        stream.on('finish', function() {
          callback(null, config, stream, extras);
        });
      }
      else {
        callback(null, config, stream, extras);
      }

    }

  }
};

module.exports = Plugin;
