var _ = require('lodash');
var vfs = require('vinyl-fs');
var through = require('through2');
var marked = require('marked');
var gutil = require('gulp-util');
var rimraf = require('rimraf');

function destination(config, format) {
  return config.destination.replace(":format", format);
}

function isMarkdown(file) {
  return file.path.match(/\.md$/) || file.path.match(/\.markdown$/);
}

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

module.exports = function(config) {
  var folderGlob = destination(config, "") + "+(html|pdf|mobi|epub)"
  rimraf(folderGlob, function() {
    vfs.src(config.files)
      .pipe(markdown())
      .pipe(vfs.dest(destination(config, "html")))
      .on('finish', config.success);
  });
}
