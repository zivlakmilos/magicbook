var _ = require('lodash');
var vfs = require('vinyl-fs');
var gutil = require('gulp-util');
var through = require('through2');
var helpers = require('../helpers');
var path = require('path');
var sass = require('node-sass');
var CleanCSS = require('clean-css');
var revHash = require('rev-hash');
var revPath = require('rev-path');
var modifyFilename = require('modify-filename');
var concatCss = require('gulp-concat-css');

// through2 function to add checksum of file content to filename
// Returns: Vinyl filestream
function digest() {
  return through.obj(function(file, enc, cb) {
    file.orgPath = file.path;
    file.revHash = revHash(file.contents);
    file.path = modifyFilename(file.path, function(filename, extension) {
		  var extIndex = filename.indexOf('.');
		  filename = extIndex === -1 ?
			  revPath(filename, file.revHash) :
			  revPath(filename.slice(0, extIndex), file.revHash) + filename.slice(extIndex);
      return filename + extension;
	  });
    cb(null, file);
  });
}

// through2 function to remove whitespace from CSS files
// Returns: Vinyl filestream
function compress() {
  return through.obj(function(file, enc, cb) {
    new CleanCSS().minify(file.contents, function (err, minified) {
      file.contents = new Buffer(minified.styles);
      cb(err, file);
    });
  });
}

// through2 function to convert a scss file to css
// Returns: Vinyl filestream
function scss() {
  return through.obj(function (file, enc, cb) {
    if(helpers.isScss(file)) {
      sass.render({ file: file.path }, function(err, result) {
        file.contents = result.css;
        file.path = gutil.replaceExtension(file.path, '.css');
        cb(err, file);
      });
    } else {
      cb(null, file);
    }
	});
}

function liquidLocals(locals, formatFolder, stylesheetsFolder) {
  locals.stylesheets = "";
  return through.obj(function(file, enc, cb) {
    var relativeFolder = path.relative(formatFolder, stylesheetsFolder);
    var relativeFile = path.join(relativeFolder, path.basename(file.path));
    locals.stylesheets += "<link rel=\"stylesheet\" href=\""+ relativeFile +"\">\n"
    cb(null, file);
  });
}

var Plugin = function(){}

Plugin.prototype = {

  setup: function(format, config, extras, cb) {

    // get the stylesheets needed for this format
    var stylesheets = _.get(config, "stylesheets.files");
    var formatFolder = helpers.destination(config.destination, format);
    var assetsFolder = _.get(config, "stylesheets.destination") || "assets";
    var stylesheetsFolder = path.join(formatFolder, assetsFolder);

    // if the array exists
    if(stylesheets) {

      // gather the files
      var stream = vfs.src(stylesheets)
        .pipe(scss());

      // bundle
      var bundle = _.get(config, "stylesheets.bundle");
      if(bundle) {
        var filename = _.isString(bundle) ? bundle : "bundle.css"
        stream = stream.pipe(concatCss(filename));
      }

      // compress
      if(_.get(config, "stylesheets.compress")) {
        stream = stream.pipe(compress());
      }

      // digest
      if(_.get(config, "stylesheets.digest")) {
        stream = stream.pipe(digest());
      }

      // finish
      stream
        .pipe(liquidLocals(extras.locals, formatFolder, stylesheetsFolder))
        .pipe(vfs.dest(stylesheetsFolder))
        .on('finish', function() {
          cb(null);
        });

    } else {
      cb(null);
    }
  }

}

module.exports = Plugin;
