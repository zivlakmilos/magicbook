var vfs = require('vinyl-fs');

var Plugin = function(){};

Plugin.prototype = {

  hooks: {

    finish: function(format, config, stream, extras, callback) {

      if(format == "html") {

        stream = stream.pipe(vfs.dest(extras.destination));
        stream.on('finish', function() {
          callback(null, format, config, stream, extras);
        });

      }
      else {
        callback(null, format, config, stream, extras);
      }
      
    }

  }
};

module.exports = Plugin;
