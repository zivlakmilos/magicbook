// Require
// --------------------------------------------

var _ = require('lodash');
var fs = require('fs');
var vfs = require('vinyl-fs');
var through = require('through2');
var kramed = require('kramed');
var gutil = require('gulp-util');
var rimraf = require('rimraf');
var tinyliquid = require('tinyliquid');
var sass = require('node-sass');
var mkdirp = require('mkdirp');
var path = require('path');

// Variables
// --------------------------------------------

var assetFolder = "assets";
var layoutCache = {};
var cssCache = {};

// Liquid Filters
// --------------------------------------------

var liquidFilters = {

};

var liquidAsyncFilters = {

  // Filter to take a string with the filename of a scss file in
  // the stylesheets folder, and create a css file from it and
  // return the new name.
  css : function(src, cb, context) {
    var inFile = context._locals.stylesheets + "/" + src + ".scss";
    if(!cssCache[inFile]) {
      var dest = destination(context._locals, context._locals.format);
      var outFile = dest + "/" + assetFolder + "/" + src + ".css";
      sass.render({
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
  }
}

// Helpers
// --------------------------------------------

function createFile(filename, content, cb) {
  mkdirp(path.dirname(filename), function(err) {
    if(err) return console.log("Error creating folder", err);
    fs.writeFile(filename, content, function(e) {
      if(e) return console.log("Error creating file", e);
      cb();
    });
  });
}

// Get build destination for a single format
// Returns: string
function destination(config, format) {
  var dest = _.get(config, "formats." + format + ".destination") || config.destination;
  return dest.replace(":format", format);
}

// Check whether a vinyl file is a markdown file
// Returns: boolean
function isMarkdown(file) {
  return file.path.match(/\.md$/) || file.path.match(/\.markdown$/);
}

// Applies the tinyliquid template layout to the file
function assignLayout(file, layout, config, format, cb) {
  var context = tinyliquid.newContext({
    locals: _.extend({
      content: file.contents.toString(),
      format: format
    }, config),
    filters: liquidFilters,
    asyncFilters: liquidAsyncFilters
  });
  layout(context, function(err) {
    file.contents = new Buffer(context.getBuffer());
    cb(null, file);
  });
}

// Pipes
// --------------------------------------------

// through2 function to convert a markdown file to html
// Returns: Vinyl filestream
function markdown() {
  return through.obj(function (file, enc, cb) {
    if(isMarkdown(file)) {
      kramed(file.contents.toString(), function (err, content) {
        if (err) {
          console.log("markdown encountered an error");
          return;
        }
        file.contents = new Buffer(content);
        file.path = gutil.replaceExtension(file.path, '.html');
        cb(null, file);
      });
    } else {
      cb(null, file);
    }
	});
}

// Duplicates a stream. Used when the format chains diverge.
// Returns: Duplicated file stream
function duplicate() {
  return through.obj(function(file, enc, cb) {
    cb(null, file.clone());
  });
}

// Assigns layouts to the files in the stream.
// Prioritizes format layout over main layout.
function layouts(config, format) {
  var layout = _.get(config, "formats." + format + ".layout") || config.layout;
  return through.obj(function(file, enc, cb) {
    if(layout) {
      if(layoutCache[layout]) {
        assignLayout(file, layoutCache[layout], config, format, cb);
      } else {
        fs.readFile(layout, function (err, data) {
          if (err) { return console.log(err); }
          layoutCache[layout] = tinyliquid.compile(data.toString());
          assignLayout(file, layoutCache[layout], config, format, cb);
        });
      }
    } else {
      cb(null, file);
    }
  });
}

// Main
// --------------------------------------------

module.exports = function(config) {

  // kramed default options
  kramed.setOptions({
    mathjax: false
  });

  // load plugins
  if(_.isArray(config.plugins)) {

    _.each(config.plugins, function(plugin) {

      var loadedPlugin;

      // try to load the plugin as a local file to this
      // folder
      try {
        var localPlugin = path.join(__dirname, 'plugins', plugin + '.js');
        fs.lstatSync(localPlugin);
        loadedPlugin = require(localPlugin);
      }
      catch (e) {
        console.log(e)
        // TODO: try to load the plugin as a file in book
        // TODO: try to load the plugin as node package
      }

      if(loadedPlugin && _.get(loadedPlugin, "hooks.init")) {
        loadedPlugin.hooks.init(kramed);
      }
    });
  }

  // delete the build folders
  var folderGlob = destination(config, "") + "+(html|pdf|mobi|epub)"
  rimraf(folderGlob, function() {

    // preprocessing that needs to happen for all formats
    var stream = vfs.src(config.files)
      .pipe(markdown());

    // html
    var htmlStream = stream
      .pipe(duplicate())
      .pipe(layouts(config, "html"))
      .pipe(vfs.dest(destination(config, "html")))
      .on('finish', function() {
        config.success("html")
      });
  });
}
