// Require
// --------------------------------------------

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

var assetFolder = "assets";
var layoutCache = {};
var cssCache = {};

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
function assignLayout(file, layout, locals, cb) {
  var context = tinyliquid.newContext({ locals: locals });
  layout(context, function(err) {
    file.contents = new Buffer(context.getBuffer());
    cb(null, file);
  });
}

function loadPlugins(config, md, format) {

  var plugins = [];
  var pluginsArray = _.get(config, "formats." + format + ".plugins") || config.plugins || ["stylesheets", "javascripts"];

  if(_.isArray(pluginsArray)) {
    _.each(pluginsArray, function(plugin) {

      var loadedPlugin;

      // try to load the plugin as a local plugin
      try {
        var localPlugin = path.join(__dirname, 'plugins', plugin + '.js');
        fs.lstatSync(localPlugin);
        loadedPlugin = require(localPlugin);
      }
      catch (e) {
        // TODO: try to load the plugin as a file in book
        // TODO: try to load the plugin as node package
      }

      if(loadedPlugin) {
        plugins.push(loadedPlugin);
      }
    });
  }

  return plugins;
}

// Hooks
// --------------------------------------------

// Function to add plugin hooks as pipes in the stream chain.
function hook(stream, plugins, name, format, payload) {

  // loop through each of plugins
  _.each(plugins, function(plugin) {

    // if the plugin has this hook
    if(_.get(plugin, "hooks." + name)) {

      // create a new pipe with the plugin hook function. This means that the
      // plugin hook must return a through2 object.
      stream = stream.pipe(plugin.hooks[name].apply(this, [format, payload]));
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
    if(isMarkdown(file)) {
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
function layouts(config, format) {

  // find the layout to use for this format
  var layout = _.get(config, "formats." + format + ".layout") || config.layout;

  return through.obj(function(file, enc, cb) {
    if(layout) {

      // create the object to pass into liquid for this file
      var locals = _.extend({
        content: file.contents.toString(),
        format: format
      }, config)

      if(layoutCache[layout]) {
        assignLayout(file, layoutCache[layout], locals, cb);
      } else {
        fs.readFile(layout, function (err, data) {
          if (err) { return console.log(err); }
          layoutCache[layout] = tinyliquid.compile(data.toString());
          assignLayout(file, layoutCache[layout], locals, cb);
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

  // default to all formats
  if(!_.isArray(config.enabledFormats)) {
    config.enabledFormats = ["html", "pdf", "epub", "mobi"];
  }

  // delete the build format folders
  var folderGlob = destination(config, "") + "+(" + config.enabledFormats.join("|") +")";
  rimraf(folderGlob, function() {

    // run build for each format
    _.each(config.enabledFormats, function(format) {

      // we create a converter for each format, as each format
      // can have different markdown settings.
      var md = new MarkdownIt();

      // we load plugins per format as each format can have
      // different plugins.
      var plugins = loadPlugins(config, md, format);

      // create our stream
      var stream = vfs.src(config.files);

      // hook: init
      stream = hook(stream, plugins, "init", format, { config: config, md: md})
        .pipe(markdown(md));

      // hook: html
      stream = hook(stream, plugins, "html", format, { config: config })
        .pipe(layouts(config, format))
        .pipe(vfs.dest(destination(config, format)))
        .on('finish', function() {
          config.success(format)
        });
    });

  });
}
