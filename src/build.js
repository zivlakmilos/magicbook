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
  "plugins" : ["frontmatter", "liquid", "stylesheets", "html"],
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
      file.contents = new Buffer(md.render(file.contents.toString()));
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

module.exports = function(config) {

  // run build for each format
  _.each(config.enabledFormats || defaults.enabledFormats, function(format) {

    // make a config object that consists of the format config,
    // with the main config and defaults merged on top of it.
    // We remove the "formats" property
    var formatConfig = _.get(config, "formats." + format) || {};
    _.defaults(formatConfig, config, defaults);
    delete formatConfig.formats;

    // figure out the build folder for this format
    var destination = helpers.destination(formatConfig.destination, format);

    // we create a converter for each format, as each format
    // can have different markdown settings.
    var md = new MarkdownIt();

    // require and instantiate plugins for this format
    pluginsCache = helpers.requireFiles(pluginsCache, formatConfig.plugins, "plugins", formatConfig.verbose)
    var plugins = helpers.instantiatePlugins(pluginsCache, formatConfig.plugins);

    // Object passed to plugins to allow them to set locals
    // in liquid.
    var extraLocals = {};

    // delete everything in build folder
    rimraf(destination, function() {

      // call the setup function in all plugins
      helpers.callPluginFunctionsAsync("setup", plugins, [format, formatConfig, { md: md, locals:extraLocals }], function() {

        // create our stream
        var stream = vfs.src(formatConfig.files);

        // hook: load
        stream = helpers.pipePluginHook(stream, plugins, "load", format, formatConfig)
          .pipe(markdown(md));

        // hook: convert
        stream = helpers.pipePluginHook(stream, plugins, "convert", format, formatConfig)
          .pipe(layouts(formatConfig, format, extraLocals))

        // hook: layout
        stream = helpers.pipePluginHook(stream, plugins, "layout", format, formatConfig)

        // loop through all plugin 'finish' functions and call them
        // after each other. This does not allow async right now because
        // I cant't figure out how to do it async with the stream.
        // may need rewrite if we ever need async in finish.
        _.each(plugins, function(plugin) {
          if(_.isFunction(plugin.finish)) {
            stream = plugin.finish(format, formatConfig, stream, destination);
          }
        });

        // events
        stream.on('finish', function() {
          if(formatConfig.verbose) console.log(format + " finished.")
          if(formatConfig.finish) {
            formatConfig.finish(format, null);
          }
        });
      });
    });
  });
}
