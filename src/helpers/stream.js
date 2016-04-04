var _ = require('lodash');
var through = require('through2');
var revHash = require('rev-hash');
var revPath = require('rev-path');
var modifyFilename = require('modify-filename');

var helpers = {

  // through2 function to add checksum of file content to filename
  // Returns: Vinyl filestream
  digest: function() {
    return through.obj(function(file, enc, cb) {
      file.orgPath = file.path;
      file.revHash = revHash(file.contents);
      file.path = modifyFilename(file.path, function(filename, extension) {
  		  var extIndex = filename.indexOf('.');
  		  filename = extIndex === -1 ?
  			  revPath(filename, file.revHash) :
  			  revPath(filename.slice(0, extIndex), file.revHash) + filename.slice(extIndex);
        return filename + extension;
  	  });
      cb(null, file);
    });
  },

  // Function that takes a stream, assembles all the files in the stream
  // in an array, waits for it to finish, and calls the cb with the files array
  finishWithFiles: function(stream, cb) {

    var files = [];

    // push each file into the array
    stream.pipe(through.obj(function(file, enc, cb) {
      files.push(file);
      cb(null, file);
    }))

    // when this stream is done, call cb with files
    .on('finish', function() {
      cb(files);
    });

  },

  // function that creates a new stream from a vinyl array
  streamFromArray: function(files) {
    var stream = through.obj();
    _.each(files, function(file) {
      stream.write(file);
    });
    stream.end();
    return stream;
  }
};

module.exports = helpers;
