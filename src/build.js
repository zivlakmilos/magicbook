// Require
// --------------------------------------------

var helpers = require('./helpers');
var _ = require('lodash');
var fs = require('fs');
var vfs = require('vinyl-fs');
var through = require('through2');
var MarkdownIt = require('markdown-it')
var gutil = require('gulp-util');
var rimraf = require('rimraf');
var tinyliquid = require('tinyliquid');
var sass = require('node-sass');
var mkdirp = require('mkdirp');
var path = require('path');

// Variables
// --------------------------------------------

var pluginsCache = {};
var layoutCache = {};

var defaults = {
  "verbose" : true,
  "files" : "content/*.md",
  "destination" : "build/:format",
  "enabledFormats" : ["html", "epub", "mobi", "pdf"],
  "plugins" : ["frontmatter", "liquid", "stylesheets", "html", "pdf"],
  "liquid" : {
    "includes" : "includes"
  }
}

// Pipes
// --------------------------------------------

// through2 function to convert a markdown file to html
// Returns: Vinyl filestream
function markdown(md) {
  return through.obj(function (file, enc, cb) {
    if(helpers.isMarkdown(file)) {

      // convert md to HTML
      var fileHTML = md.render(file.contents.toString());

      // put that back into the file
      file.contents = new Buffer(fileHTML);
      file.path = gutil.replaceExtension(file.path, '.html');

    }
    cb(null, file);
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
function layouts(config, format, extraLocals) {

  return through.obj(function(file, enc, cb) {

    var layout = _.get(file, "config.layout") || config.layout;

    if(layout) {

      // create the object to pass into liquid for this file
      var locals = {
        content: file.contents.toString(),
        format: format,
        config: config,
        page: file.config
      }

      if(extraLocals) {
        _.assign(locals, extraLocals);
      }

      if(layoutCache[layout]) {
        helpers.renderLiquidTemplate(layoutCache[layout], locals, file, config, cb);
      } else {
        fs.readFile(layout, function (err, data) {
          if (err) { return console.log(err); }
          layoutCache[layout] = tinyliquid.compile(data.toString());
          helpers.renderLiquidTemplate(layoutCache[layout], locals, file, config, cb);
        });
      }
    } else {
      cb(null, file);
    }
  });
}

// Main
// --------------------------------------------

module.exports = function(cmdConfig) {

  // run build for each format
  _.each(cmdConfig.enabledFormats || defaults.enabledFormats, function(format) {

    // make a config object that consists of the format config,
    // with the main config and defaults merged on top of it.
    // We remove the "formats" property
    var config = _.get(cmdConfig, "formats." + format) || {};
    _.defaults(config, cmdConfig, defaults);
    delete config.formats;

    // figure out the build folder for this format
    var destination = helpers.destination(config.destination, format);

    // we create a converter for each format, as each format
    // can have different markdown settings.
    var md = new MarkdownIt();

    // require and instantiate plugins for this format
    pluginsCache = helpers.requireFiles(pluginsCache, config.plugins, "plugins", config.verbose)
    var plugins = helpers.instantiatePlugins(pluginsCache, config.plugins);

    // Object passed to plugins to allow them to set locals
    // in liquid.
    var extraLocals = {};

    // delete everything in build folder
    rimraf(destination, function() {

      // hook: setup
      helpers.callHook('setup', plugins, [format, config, { md: md, locals:extraLocals }], function() {

        // create our stream
        var stream = vfs.src(config.files);

        // hook: load
        helpers.callHook('load', plugins, [format, config, stream, {}], function(format, config, stream) {

          stream = stream.pipe(markdown(md));

          helpers.callHook('convert', plugins, [format, config, stream, {}], function(format, config, stream) {

            stream = stream.pipe(layouts(config, format, extraLocals));

            helpers.callHook('layout', plugins, [format, config, stream, {}], function(format, config, stream) {

              helpers.callHook('finish', plugins, [format, config, stream, { destination: destination}], function(format, config, stream) {

                if(config.verbose) console.log(format + " finished.")
                if(config.finish) {
                  config.finish(format, null);
                }

              });
            });
          });
        });
      });
    });
  });
}
