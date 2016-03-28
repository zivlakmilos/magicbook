var vfs = require('vinyl-fs');

var Plugin = function(){};

Plugin.prototype = {

  finish: function(format, config, stream, destination) {
    if(format == "html") {
      stream = stream.pipe(vfs.dest(destination));
    }
    return stream;
  }
}

module.exports = Plugin;
