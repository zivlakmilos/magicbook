var vfs = require('vinyl-fs');
var through = require('through2');
var merge = require('merge-stream');
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

    var stream;

    // if files is an array
    if(_.isArray(files)) {

      streams = _.map(config.files, function(f) {

        // if this is a glob
        if(_.isString(f)) return f;

        // if this is a part
        else if(_.isObject(f)) return getTree(f);

      });

      streams = _.flattenDeep(streams);

      cb(null, config, stream, extras);
    }

    // if files is just a string
    else {
      cb(null, config, vfs.src(config.files), extras)
    }
  }
}

module.exports = Plugin;
