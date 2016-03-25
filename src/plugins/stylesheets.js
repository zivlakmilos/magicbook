var through = require('through2');
var _ = require('lodash');

module.exports = {

  hooks: {

    init: function(format, payload) {
      var stylesheets = _.get(payload.config, "stylesheets.files");
      if(stylesheets) {

      }
      return through.obj();
    }

  }

}


// find the stylesheets for this format
/*var stylesheets = _.get(config, "formats." + format + ".stylesheets") || config.stylesheets;
var css = [];
if(_.isArray(stylesheets)) {
  css = _.map(stylesheets, function(stylesheet) {
    if(!cssCache[stylesheet]) {

      // find the format build folder
      var dest = destination(config, format);

      // rename the file to css (some files can be scss)
      var outFile = path.basename(gutil.replaceExtension(stylesheet, '.css'));

      // find the exact assetfolder name inside the format build folder
      var outPath = path.join(dest, assetFolder, outFile);

      if(isScssFile(file.path)) {
        cssCache[stylesheet] = sass.renderSync({
          file: stylesheet,
          outFile: outPath
        });
      }

    }

  });
}*/

// Filter to take a string with the filename of a scss file in
// the stylesheets folder, and create a css file from it and
// return the new name.
/*css : function(src, cb, context) {
  var inFile = context._locals.stylesheets + "/" + src + ".scss";
  if(!cssCache[inFile]) {
    var dest = destination(context._locals, context._locals.format);
    var outFile = dest + "/" + assetFolder + "/" + src + ".css";
    sass.renderSync({
        file: inFile,
        outFile: outFile
      },
      function(err, result) {
        if(err) return console.log("Error compiling sass", err);
        createFile(outFile, result.css, function() {
          cssCache[inFile] = path.relative(dest, outFile);
          cb(null, cssCache[inFile]);
        });
      }
    );
  }
  else {
    cb(null, cssCache[inFile]);
  }
}*/
