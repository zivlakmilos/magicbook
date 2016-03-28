// This is an empty format that can be used when starting to
// write a new format.

// A format consists of a single function, which is called
// whenever a format build is triggered. It receives a vinyl-fs
// stream, and the format function needs to at least call something
// to finish that stream. This will often mean using vinylfs.dest().
// You can look at the other formats for inspiration.
// Params
// stream      - A vinylfs stream where all source files will be stream through
// destination - The destination folder for this format
var Format = function(stream, destination){

  // a format must return the stream
  return stream;

};

module.exports = Format;
