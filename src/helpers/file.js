var _ = require('lodash');
var fs = require('fs');
var path = require('path');

var helpers = {

  // Check whether a vinyl file is a markdown file
  // Returns: boolean
  isMarkdown: function(file) {
    return file.path.match(/\.md$/) || file.path.match(/\.markdown$/);
  },

  // Check whether a vinyl file is a scss file
  // Returns: boolean
  isScss: function(file) {
    return file.path.match(/\.scss$/);
  },

  // Fast way to copy a file in Node. Taken from here:
  copyFile : function(source, target, cb) {
    var cbCalled = false;

    var rd = fs.createReadStream(source);
    rd.on("error", function(err) {
      done(err);
    });
    var wr = fs.createWriteStream(target);
    wr.on("error", function(err) {
      done(err);
    });
    wr.on("close", function(ex) {
      done();
    });
    rd.pipe(wr);

    function done(err) {
      if (!cbCalled) {
        cb(err);
        cbCalled = true;
      }
    }
  },

  createFile: function(filename, content, cb) {
    mkdirp(path.dirname(filename), function(err) {
      if(err) return console.log("Error creating folder", err);
      fs.writeFile(filename, content, function(e) {
        if(e) return console.log("Error creating file", e);
        cb();
      });
    });
  }

};

module.exports = helpers;
