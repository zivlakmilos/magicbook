var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var vfs = require('vinyl-fs');
var through = require('through2');
var helpers = require('../helpers');
var cheerio = require('cheerio');

var Plugin = function(){};

function mapImages(imageMap, srcFolder, destFolder) {

  var srcAbsolute = path.join(process.cwd(), srcFolder);

  return through.obj(function(file, enc, cb) {
    var relativeFrom = path.relative(srcAbsolute, file.path);
    var relativeTo = path.join(destFolder, relativeFrom);
    imageMap[relativeFrom] = relativeTo;
    cb(null, file)
  });
}

function replaceSrc(imageMap) {
  return through.obj(function(file, enc, cb) {

    // parse doc into cheerio
    var changed = false;
    var content = file.contents.toString();
    $ = cheerio.load(content);

    // loop over each image
    $('img').each(function(i, el) {
      var jel = $(this)
      var src = jel.attr('src');
      if(imageMap[src]) {
        changed = true;
        jel.attr('src', imageMap[src]);
      }
    });

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
      var imagesStream = vfs.src(srcFolder + "/**/*.*")

        // todo: digest pipe

        // save map of old and new file names
        .pipe(mapImages(this.imageMap, srcFolder, destFolder))

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
