var vfs = require('vinyl-fs');
var through = require('through2');
var StreamQueue = require('streamqueue');
var util = require('util');
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
// function assignPart(stream, part, parentPart) {
//
//   if(!part) return stream;
//
//   return stream.pipe(through.obj(function(file, enc, cb) {
//     file.part = part;
//     file.parentPart = parentPart;
//     cb(null, file);
//   }));
//
// }
//
// function parseFileArray(files, streams, part, parentPart) {
//
//   var newFiles = [];
//
//   // if files is a string, convert it into an object
//   if(_.isString(files) {
//     newFiles.push({})
//     streams.push(assignPart(vfs.src(files), part, parentPart))
//   }
//   else {
//     _.each(files, function(file) {
//
//       // if this is a glob
//       if(_.isString(file)) streams.push(assignPart(vfs.src(file), part, parentPart));
//
//       // if this is a part
//       else if(_.isObject(file) && file.files) {
//         parseFileArray(file.files, streams, file, part);
//       }
//     });
//   }
//
//   return newFiles;
// }

function treeToStreams(parent, streams) {

  if(isStringArray(parent.files)) {
    streams.push(vfs.src(parent.files))
  }
  else {
    _.each(parent.files, function(file) {
      treeToStreams(file, streams);
    });
  }

  return streams;
}

// Turn a part array into a full tree consisting of objects, so we later
// can store stream vinyl objects in the objects belonging to the blobs
// they were loaded from.
// Turns this:
// [
//   "firstfile.md",
//   "secondfile.md",
//   {
//     label: "Part",
//     files: [
//       "thirdfile.md",
//       {
//         label: "Sub Part",
//         files: ["fourthfile.md"]
//       }
//     ]
//   }
// ]
// Into this:
// [
//   {
//     files: [
//       "firstfile.md",
//       "secondfile.md"
//     ]
//   },
//   {
//     label: "Part",
//     files: [
//       "thirdfile.md",
//       {
//         parent: {...}
//         label: "Sub Part",
//         files: ["fourthfile.md"]
//       }
//     ]
//  }
// ]
function filesToTree(part) {

  var fileObjects = [];

  _.each(part.files, function(file) {

    if(_.isString(file)) {
      // If there is no objects in the array, or the latest object
      // is a part, create a non-part object to hold the files.
      if(fileObjects.length == 0 || _.last(fileObjects).label) {
        fileObjects.push({ files: [] });
      }
      _.last(fileObjects).files.push(file);
    }
    else if(file.label && file.files) {
      file = filesToTree(file, part);
      file.parent = part;
      fileObjects.push(file);
    }

  });

  part.files = fileObjects;
  return part;
}

function hasParts(files) {
  return !_.isString(files) && !isStringArray(files);
}

Plugin.prototype = {

  loadFiles: function(config, extras, cb) {

    // If this array has parts in it
    if(hasParts(config.files)) {

      // turn the array into a structure that allows us
      // to parse the tree (strings to objects with children,
      // assign parents). Might need to make this function not
      // alter the original files array.
      extras.partTree = filesToTree({ label: 'root', files: config.files });

      // load streams and assign files to the children of their
      // glob object.
      var streams = treeToStreams(extras.partTree, []);
      var queue = new StreamQueue({ objectMode: true });
      _.each(streams, function(stream) {
        queue.queue(stream);
      });
      queue.done();
      cb(null, config, queue, extras);

    // If this array does not have parts in it
    } else {
      cb(null, config, vfs.src(config.files), extras);
    }

  }
}

module.exports = Plugin;
