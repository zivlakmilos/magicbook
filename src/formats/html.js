var vfs = require('vinyl-fs');

var Format = function(stream, destination){

  // html basically just passes through the files
  // to the destination
  return stream.pipe(vfs.dest(destination));

};

module.exports = Format;
