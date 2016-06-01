var through = require('through2');
var path = require('path');

var Plugin = function(registry) {
  registry.before('navigation:insert', 'permalinks', this.permalinks);
};

Plugin.prototype = {

  permalinks: function(config, stream, extras, callback) {

    stream = stream.pipe(through.obj(function(file, enc, cb) {

      if(config.permalink) {
        file.path = path.join(file.base, config.permalink);
      }

      cb(null, file);

    }));

    callback(null, config, stream, extras);
  }
}

module.exports = Plugin;
