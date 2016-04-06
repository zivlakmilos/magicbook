var _ = require('lodash');
var vfs = require('vinyl-fs');
var gutil = require('gulp-util');
var through = require('through2');
var streamHelpers = require('../helpers/stream');
var path = require('path');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var Plugin = function(){}

Plugin.prototype = {

  hooks: {

    setup: function(config, extras, callback) {

      that = this;
      that.allFiles = [];

      // get the javascripts needed for this format
      var javascripts = _.get(config, "javascripts.files");

      // if the array exists
      if(javascripts) {

        var jsFolder = config.javascripts.destination;
        var jsFolderAbsolute = path.join(extras.destination, jsFolder);

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
          jsStream = jsStream.pipe(streamHelpers.digest());
        }

        // put all the filenames in the javascripts array
        jsStream = jsStream.pipe(through.obj(function(file, enc, cb) {
          // save the path to the js file from within the build folder
          that.allFiles.push(path.join(jsFolder, file.relative));
          cb(null, file);
        }));

        // finish
        jsStream
          .pipe(vfs.dest(jsFolderAbsolute))
          .on('finish', function() {
            callback(null, config, extras);
          });

      } else {
        callback(null, config, extras);
      }
    },

    load: function(config, stream, extras, callback) {

      var allFiles = this.allFiles;

      // add the locals to the files liquidLocals
      stream = stream.pipe(through.obj(function(file, enc, cb) {

        var scripts = "";
        _.each(allFiles, function(js) {
          scripts += '<script src="' + path.relative(path.dirname(file.relative), js) +'"></script>\n';
        });

        file.liquidLocalsLayout = file.liquidLocalsLayout || {};
        file.liquidLocalsLayout.javascripts = scripts;

        cb(null, file);
      }));

      callback(null, config, stream, extras);
    }
  }
}

module.exports = Plugin;
