var vfs = require('vinyl-fs');

var Plugin = function(){};

Plugin.prototype = {

  hooks: {

    finish: function(format, config, stream, extras, callback) {
      if(format == "html") {
        stream = stream.pipe(vfs.dest(extras.destination));
      }
      callback(null, format, config, stream, extras);
    }

  }
};

module.exports = Plugin;
