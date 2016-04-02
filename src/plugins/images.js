var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var vfs = require('vinyl-fs');
var through = require('through2');
var helpers = require('../helpers');

var Plugin = function(){}

Plugin.prototype = {

  hooks: {

    setup: function(config, extras, callback) {

      var srcFolder = config.images.sourceFolder;
      var destFolder = path.join(extras.destination, _.get(config, "images.destination") || "assets");

      // if sourceFolder does not exist, return
      if(!fs.existsSync(srcFolder)) {
        callback(null, config, extras);
        return;
      }

      // load all files in the source folder
      var imagesStream = vfs.src(srcFolder + "/**/*.*")

        // digest pipe?

        // vinyl-fs dest automatically determines whether a file
        // should be updated or not, based on the mtime timestamp.
        // so we don't need to do that manually.
        .pipe(vfs.dest(destFolder))
        .on('finish', function() {
          callback(null, config, extras);
        });
    }
  }
}

module.exports = Plugin;
