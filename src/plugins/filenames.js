var debug = require('debug')('magicbook:filenames');
var through = require('through2');
var path = require('path');

var Plugin = function(registry){
  registry.before('markdown:convert', 'filenames:numbers', this.removeNumbers);
};

Plugin.prototype = {

  removeNumbers :function(config, stream, extras, callback) {
    stream = stream.pipe(through.obj(function (file, enc, cb) {

      file.path = file.path.replace(/\/[\d-_]*/g, '/');

      debug(file.path, file.contents.toString().substring(0, 20));

      cb(null, file);

  	}));
    callback(null, config, stream, extras);
  }

}

module.exports = Plugin;
