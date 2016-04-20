var through = require('through2');
var path = require('path');

var Plugin = function(registry){
  registry.before('markdown:convert', 'filenames:numbers', this.removeNumbers);
};

Plugin.prototype = {

  removeNumbers :function(config, stream, extras, callback) {
    stream = stream.pipe(through.obj(function (file, enc, cb) {
      file.path = file.path.replace(/\/[\d-_]*/g, '/');
      cb(null, file);
  	}));
    callback(null, config, stream, extras);
  }

}

module.exports = Plugin;
