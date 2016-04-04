var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var vfs = require('vinyl-fs');
var through = require('through2');
var streamHelpers = require('../helpers/stream');
var cheerio = require('cheerio');

var Plugin = function(){};

// through2 pipe function that creates a hasmap of
// old -> image names.
function mapImages(imageMap, srcFolder, destFolder) {

  // find the absolute path to source images
  var srcAbsolute = path.join(process.cwd(), srcFolder);

  // for each file
  return through.obj(function(file, enc, cb) {

    // find the relative path to image. If any pipe has changed the filename,
    // it's the original is set in orgPath, so we look at that first.
    var relativeFrom = path.relative(srcAbsolute, file.orgPath || file.path);
    var relativeTo = path.join(destFolder, path.relative(srcAbsolute, file.path));
    imageMap[relativeFrom] = relativeTo;
    cb(null, file)
  });
}

// through2 pipe function that replaces images src attributes
// based on values in hashmap.
function replaceSrc(imageMap) {
  return through.obj(function(file, enc, cb) {

    // parse doc into cheerio
    var changed = false;
    var content = file.contents.toString();
    $ = cheerio.load(content);

    // loop over each image
    $('img').each(function(i, el) {

      // convert el to cheerio el
      var jel = $(this)
      var src = jel.attr('src');

      // if this image exists in source folder,
      // replace src with new source
      if(imageMap[src]) {
        changed = true;
        jel.attr('src', imageMap[src]);
      }
    });

    // only if we find an image, replace contents in file
    if(changed) {
      file.contents = new Buffer($.html());
    }

    cb(null, file);
  });
}

Plugin.prototype = {

  hooks: {

    setup: function(config, extras, callback) {

      this.imageMap = {};

      var srcFolder = config.images.source;
      var destFolder = _.get(config, "images.destination") || "assets";
      var destAbsolute = path.join(extras.destination, destFolder);

      // if source does not exist, return
      if(!fs.existsSync(srcFolder)) {
        callback(null, config, extras);
        return;
      }

      // load all files in the source folder
      var imagesStream = vfs.src(srcFolder + "/**/*.*");

        // digest
        if(_.get(config, "images.digest")) {
          imagesStream = imagesStream.pipe(streamHelpers.digest());
        }

        // save map of old and new file names
        imagesStream.pipe(mapImages(this.imageMap, srcFolder, destFolder))

        // vinyl-fs dest automatically determines whether a file
        // should be updated or not, based on the mtime timestamp.
        // so we don't need to do that manually.
        .pipe(vfs.dest(destAbsolute))
        .on('finish', function() {
          callback(null, config, extras);
        });
    },

    // after conversion, replace all image links in files
    convert: function(config, stream, extras, callback) {
      stream = stream.pipe(replaceSrc(this.imageMap));
      callback(null, config, stream, extras);
    },
  }
}

module.exports = Plugin;
