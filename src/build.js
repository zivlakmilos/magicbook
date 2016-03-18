var _ = require('lodash');
var fs = require('fs');
var vfs = require('vinyl-fs');
var through = require('through2');
var marked = require('marked');
var gutil = require('gulp-util');
var rimraf = require('rimraf');
var tinyliquid = require('tinyliquid');

// Get build destination for a single format
// Returns: string
function destination(config, format) {
  return config.destination.replace(":format", format);
}

// Check whether a vinyl file is a markdown file
// Returns: boolean
function isMarkdown(file) {
  return file.path.match(/\.md$/) || file.path.match(/\.markdown$/);
}

// through2 function to convert a markdown file to html
// Returns: Vinyl filestream
function markdown() {
  return through.obj(function (file, enc, cb) {
    if(isMarkdown(file)) {
      marked(file.contents.toString(), {}, function (err, data) {
        if (err) {
          console.log("markdown encountered an error");
          return;
        }
        file.contents = new Buffer(data);
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

// Applies the tinyliquid template layout to the file
function assignLayout(file, layout, cb) {
  var context = tinyliquid.newContext({ locals: { content: file.contents.toString() }});
  layout(context, function(err) {
    file.contents = new Buffer(context.getBuffer());
    cb(null, file);
  });
}

// Assigns layouts to the files in the stream.
// Prioritizes format layout over main layout.
var layoutCache = {};
function layouts(config, format) {
  var layout = _.get(config, "formats." + format + ".layout") || config.layout;
  return through.obj(function(file, enc, cb) {
    if(layout) {
      if(layoutCache[layout]) {
        assignLayout(file, layoutCache[layout], cb);
      } else {
        fs.readFile(layout, function (err, data) {
          if (err) { return console.log(err); }
          layoutCache[layout] = tinyliquid.compile(data.toString());
          assignLayout(file, layoutCache[layout], cb);
        });
      }
    } else {
      cb(null, file);
    }
  });
}

// Main build function
module.exports = function(config) {

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
