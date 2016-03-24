var through = require('through2');

module.exports = {

  // all of them gets passed the format, so it
  // knows whether to do something or not.

  hooks: {

    init: function(format, payload) {

      // no matter what, all hook functions must return
      // a through2 object, as it's a part of the chain.
      return through.obj(function (file, enc, cb) {
        cb(null, file);
    	});
    }

    // preMarkdown

    // postMarkdown

    // a way to add extra output files in some formats, like mathjax support
    // in the web versions. This will also require the ability to add extra
    // file to the scss bundle


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
