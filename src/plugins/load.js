var vfs = require('vinyl-fs');
var through = require('through2');
var StreamQueue = require('streamqueue');
var _ = require('lodash');

var Plugin = function(registry) {
  registry.add('load', this.loadFiles);
};

function isStringArray(arr) {
  return _.isArray(arr) && _.every(arr, function(f) { return _.isString(f)});
}

// Assigns a part name to a file. This is used later to figure out
// what part the file belongs to. Will break if two parts are named
// the same.
function assignPart(stream, part, parentPart) {

  if(!part) return stream;

  return stream.pipe(through.obj(function(file, enc, cb) {
    file.part = part;
    file.parentPart = parentPart;
    cb(null, file);
  }));

}

function parseFileArray(files, streams, part, parentPart) {

  if(_.isString(files) || isStringArray(files)) {
    streams.push(assignPart(vfs.src(files), part, parentPart))
  }
  else {
    _.each(files, function(file) {

      // if this is a glob
      if(_.isString(file)) streams.push(assignPart(vfs.src(file), part, parentPart));

      // if this is a part
      else if(_.isObject(file) && file.files) {
        parseFileArray(file.files, streams, file, part);
      }
    });
  }

  return streams;
}

Plugin.prototype = {

  loadFiles: function(config, extras, cb) {
    var streams = parseFileArray(config.files, []);
    if(streams.length > 1) {
      var queue = new StreamQueue({ objectMode: true });
      _.each(streams, function(stream) {
        queue.queue(stream);
      });
      queue.done();
      cb(null, config, queue, extras);
    } else {
      cb(null, config, streams[0], extras);
    }

  }
}

module.exports = Plugin;
