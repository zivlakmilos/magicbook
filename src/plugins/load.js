var vfs = require('vinyl-fs');
var through = require('through2');
var _ = require('lodash');

var Plugin = function(registry) {
  registry.add('load', this.loadFiles);
};

Plugin.prototype = {
  loadFiles: function(config, extras, cb) {

    function getTree(f) {
      var arr = [];
      if(f.files) arr.push(f.files);
      if(f.children) arr.push(_.map(f.children, function(child) { return getTree(child) }));
      return arr;
    }

    var files = config.files;

    if(_.isArray(files)) {

      files = _.map(config.files, function(f) {
        // if this is a glob
        if(_.isString(f)) return f;

        // if this is a part
        else if(_.isObject(f)) return getTree(f);
      });

      files = _.flattenDeep(files);
    }

    var stream = vfs.src(files);
    cb(null, config, stream, extras);
  }
}

module.exports = Plugin;
