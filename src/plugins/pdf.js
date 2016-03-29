var vfs = require('vinyl-fs');
var concat = require('gulp-concat');

var Plugin = function(){};

Plugin.prototype = {

  hooks: {

    convert: function(format, config, stream, extras, callback) {

      // if this is the pdf format
      if(format == "pdf") {

        // consolidate all files into a single one
        stream = stream.pipe(concat('consolidated.html'));
      }

      callback(null, format, config, stream, extras);

    },

    finish: function(format, config, stream, extras, callback) {

      if(format == "pdf") {

        // save consolidated file to destination
        stream = stream.pipe(vfs.dest(extras.destination));

        // when stream is finished, call back
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
