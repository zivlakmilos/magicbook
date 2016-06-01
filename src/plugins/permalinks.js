var through = require('through2');
var path = require('path');
var _ = require('lodash');

var Plugin = function(registry) {
  registry.before('navigation:insert', 'permalinks', this.permalinks);
};

Plugin.prototype = {

  permalinks: function(config, stream, extras, callback) {

    stream = stream.pipe(through.obj(function(file, enc, cb) {

      var permalink = _.get(file, 'pageLocals.page.permalink') || config.permalink;
      if(permalink) {
        permalink = permalink.replace(':title', file.stem);
        file.path = path.join(file.base, permalink);
      }

      cb(null, file);

    }));

    callback(null, config, stream, extras);
  }
}

module.exports = Plugin;
