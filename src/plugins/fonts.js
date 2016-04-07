var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var vfs = require('vinyl-fs');
var through = require('through2');
var streamHelpers = require('../helpers/stream');
var Plugin = function(){};

Plugin.prototype = {

  hooks: {

    // simply move all font files at setup
    setup: function(config, extras, callback) {

      var srcFolder = config.fonts.source;
      var destFolder = _.get(config, "fonts.destination") || "assets";
      var destAbsolute = path.join(extras.destination, destFolder);

      // load all files in the source folder
      vfs.src(srcFolder + "/**/*.*")

        // vinyl-fs dest automatically determines whether a file
        // should be updated or not, based on the mtime timestamp.
        // so we don't need to do that manually.
        .pipe(vfs.dest(destAbsolute))
        .on('finish', function() {
          callback(null, config, extras);
        });
    }
  }
}

module.exports = Plugin;
