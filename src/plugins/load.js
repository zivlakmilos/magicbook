var vfs = require('vinyl-fs');
var through = require('through2');

var Plugin = function(registry) {
  registry.add('load', this.loadFiles);
};

Plugin.prototype = {
  loadFiles: function(config, extras, cb) {
    var stream = vfs.src(config.files);
    cb(null, config, stream, extras);
  }
}

module.exports = Plugin;
