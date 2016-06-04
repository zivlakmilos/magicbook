var vfs = require('vinyl-fs');
var through = require('through2');
var merge = require('merge-stream');
var _ = require('lodash');

var Plugin = function(registry) {
  registry.add('load', this.loadFiles);
};

function isStringArray(arr) {
  return _.isArray(arr) && _.every(arr, function(f) { return _.isString(f)});
}

function filesToStreams(fileArray, streamArray) {

  _.each(fileArray, function(f) {

    // if this is a glob
    if(_.isString(f)) streamArray.push(vfs.src(f));

    // if this is a part
    else if(_.isObject(f) && f.files) {
      if(_.isString(f.files)) {
        streamArray.push(vfs.src(f.files));
      }
      else if(_.isArray(f.files)) {
        filesToStreams(f.files, streamArray);
      }
    }

  });

  return streamArray;
}

Plugin.prototype = {

  loadFiles: function(config, extras, cb) {

    // If this is a simple string glob or an array of globs
    if(_.isString(config.files) || isStringArray(config.files)) {
      return cb(null, config, vfs.src(config.files), extras);
    }

    // If this is an array with parts in it
    else {
      streams = filesToStreams(config.files, []);
      cb(null, config, merge(streams), extras);
    }
  }
}

module.exports = Plugin;
