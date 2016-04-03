var _ = require('lodash');
var vfs = require('vinyl-fs');
var gutil = require('gulp-util');
var through = require('through2');
var helpers = require('../helpers');
var path = require('path');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

function liquidLocals(locals, destination, javascriptsFolder) {
  locals.javascripts = "";
  return through.obj(function(file, enc, cb) {
    var relativeFolder = path.relative(destination, javascriptsFolder);
    var relativeFile = path.join(relativeFolder, path.basename(file.path));
    locals.javascripts += "<script src=\""+ relativeFile +"\"></script>\n"
    cb(null, file);
  });
}

var Plugin = function(){}

Plugin.prototype = {

  hooks: {

    setup: function(config, extras, callback) {

      // get the javascripts needed for this format
      var javascripts = _.get(config, "javascripts.files");

      // if the array exists
      if(javascripts) {

        var assetsFolder = config.javascripts.destination;
        var javascriptsFolder = path.join(extras.destination, assetsFolder);

        // gather the files
        var jsStream = vfs.src(javascripts);

        // bundle
        var bundle = _.get(config, "javascripts.bundle");
        if(bundle) {
          var filename = _.isString(bundle) ? bundle : "bundle.js"
          jsStream = jsStream.pipe(concat(filename));
        }

        // compress
        if(_.get(config, "javascripts.compress")) {
          jsStream = jsStream.pipe(uglify());
        }

        // digest
        if(_.get(config, "javascripts.digest")) {
          jsStream = jsStream.pipe(helpers.digest());
        }

        // finish
        jsStream
          .pipe(liquidLocals(extras.locals, extras.destination, javascriptsFolder))
          .pipe(vfs.dest(javascriptsFolder))
          .on('finish', function() {
            callback(null, config, extras);
          });

      } else {
        callback(null, config, extras);
      }
    }
  }
}

module.exports = Plugin;
