var through = require('through2');
var path = require('path');
var _ = require('lodash');

var Plugin = function(registry) {
  registry.before('navigation:insert', 'permalinks', this.permalinks);
};

Plugin.prototype = {

  permalinks: function(config, stream, extras, callback) {

    stream = stream.pipe(through.obj(function(file, enc, cb) {

      var pagePermalink = _.get(file, 'pageLocals.page.permalink');
      if(pagePermalink || config.permalink) {
        file.path = path.join(file.base, pagePermalink || config.permalink);
      }

      cb(null, file);

    }));

    callback(null, config, stream, extras);
  }
}

module.exports = Plugin;
