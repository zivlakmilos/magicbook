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
var async = require('async');

// Variables
// --------------------------------------------

var layoutCache = {};

var defaults = {
  "files" : "content/*.md",
  "destination" : "build/:format",
  "enabledFormats" : ["html", "epub", "mobi", "pdf"],
  "plugins" : ["frontmatter", "liquid", "stylesheets", "javascripts"],
  "liquid" : {
    "includes" : "includes"
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

function loadPlugins(config, md, format) {

  var plugins = [];

  if(_.isArray(config.plugins)) {
    _.each(config.plugins, function(plugin) {

      var loadedPlugin;

      try {
        // try to load the plugin as a local plugin
        var localPlugin = path.join(__dirname, 'plugins', plugin);
        loadedPlugin = require(localPlugin);
      } catch (e1) {
        try {
          // try to load the plugin as a file in the book
          loadedPlugin = require('./' + plugin);
        } catch(e2) {
          try {
            // try to load the plugin as a node package
            loadedPlugin = require(plugin);
          } catch(e3) {
            console.log("Plugin " + plugin + " cannot be found");
          }
        }
      }

      if(loadedPlugin) {
        plugins.push(loadedPlugin);
      }
    });
  }

  return plugins;
}

// This function takes the name of a function and calls
// that function for all the plugins, in series after each other.
// It then ends by calling cb(). It expects the last argument
// of these plugin functions to be a cb that is called when the
// function is done.
function callPlugins(plugins, fnc, args, cb) {

  // select all plugins that have this function
  var selected = _.filter(plugins, function(plugin) {
    return _.isFunction(plugin[fnc]);
  });

  // make async chain of the functions to be called in series.
  var chain = _.map(selected, function(plugin) {
    return function(callback) {
      plugin[fnc].apply(this, args.concat(callback));
    }
  });

  // make async fire of the chain in a series.
  async.series(chain, function(err, results) {
    cb();
  });
}

// Hooks
// --------------------------------------------

// Function to add plugin hooks as pipes in the stream chain.
function hook(stream, plugins, name, format, config, payload) {

  // loop through each of plugins
  _.each(plugins, function(plugin) {

    // if the plugin has this hook
    if(_.get(plugin, "hooks." + name)) {

      // create a new pipe with the plugin hook function. This means that the
      // plugin hook must return a through2 object.
      stream = stream.pipe(plugin.hooks[name].apply(this, [format, config, payload || {}]));
    }
  });

  return stream;
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

    // delete everything in build folder
    rimraf(destination, function() {

      // we create a converter for each format, as each format
      // can have different markdown settings.
      var md = new MarkdownIt();

      // we load plugins per format as each format can have
      // different plugins.
      var plugins = loadPlugins(formatConfig, md, format);

      // Object passed to plugins to allow them to set locals
      // in liquid.
      var extraLocals = {};

      // call the setup function in all plugins
      callPlugins(plugins, "setup", [format, formatConfig, { md: md, locals:extraLocals }], function() {

        // create our stream
        var stream = vfs.src(formatConfig.files);

        // hook: load
        stream = hook(stream, plugins, "load", format, formatConfig)
          .pipe(markdown(md));

        // hook: convert
        stream = hook(stream, plugins, "convert", format, formatConfig)
          .pipe(layouts(formatConfig, format, extraLocals))

        // hook: layout
        stream = hook(stream, plugins, "layout", format, formatConfig)
          .pipe(vfs.dest(destination));

        // events
        stream.on('finish', function() {
          console.log(format + " finished.")
          if(config.success) {
            config.success(format);
          }
        });
      });
    });
  });
}
