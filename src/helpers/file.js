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
  },

  // Requires and caches files in cachedFiles with the requireFile
  // function. See below.
  requireFiles: function(filesCache, neededFiles, localFolder, verbose) {

    // loop through each of the required plugins
    _.each(neededFiles, function(file) {

      // if this file has not been required yet
      if(!filesCache[file]) {

        // require it and save to cache
        filesCache[file] = helpers.requireFile(file, localFolder, verbose);
      }
    });

    return filesCache;
  },

  // This function can be used to require a file or NPM packages by
  // name. It first searches through the folder specified in localFolder,
  // then searches the book repo for the file, and then tries to require
  // as NPM package.
  requireFile: function(file, localFolder, verbose) {

    var loadedFile;

    // try to load the file as a local file
    try { loadedFile = require(path.join(__dirname, "..", localFolder, file)); }
      catch (e1) {
        console.log(e1)
        if(e1 instanceof SyntaxError) {
          if(verbose) console.log("Plugin file: " + file + " has syntax errors. " + e1.toString());
        } else {
          // try to load the file as a file in the book
          try { loadedFile = require(path.join(process.cwd(), file)); } catch(e2) {
            if(e2 instanceof SyntaxError) {
              if(verbose) console.log("Plugin file: " + file + " has syntax errors. " + e2.toString());
            } else {
              // try to load the file as a node package
              try { loadedFile = require(file); } catch(e3) {
                if(e3 instanceof SyntaxError) {
                  if(verbose) console.log("Plugin file: " + file + " has syntax errors. " + e3.toString());
                } else {
                  if(verbose) console.log("Required file: " + file + " cannot be found");
                }
              }
            }
          }
        }

    }

    return loadedFile;
  }

};

module.exports = helpers;
