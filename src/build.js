// Require
// --------------------------------------------

var helpers = require('./helpers/helpers');
var PluginExecuter = require('./plugin_executer.js');
var _ = require('lodash');
var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');

// Variables
// --------------------------------------------

var pluginsCache = {};
var layoutCache = {};

var defaults = {

  // The most important plugins are specified first, so
  // the following plugins can register before/after them.
  "plugins" : [
    "load",
    "markdown",
    "liquid",
    "layouts",
    "stylesheets",
    "javascripts",
    "fonts",
    "images",
    "html",
    "pdf",
    "frontmatter",
    "ids",
    "toc",
    "links",
    "footnotes",
    "navigation",
    "filenames"
  ],

  "verbose" : true,
  "files" : "content/*.md",
  "destination" : "build/:build",
  "liquid" : {
    "includes" : "includes"
  },
  "images" : {
    "files" : "images/**/*.*",
    "destination" : "assets"
  },
  "stylesheets" : {
    "destination" : "assets"
  },
  "javascripts" : {
    "destination" : "assets"
  },
  "fonts" : {
    "files" : "fonts/**/*.*",
    "destination" : "assets"
  }
}

// Main
// --------------------------------------------

module.exports = function(jsonConfig) {

  // if there is no builds array or it's empty,
  // return an error message
  if(!_.isArray(jsonConfig.builds) || _.isEmpty(jsonConfig.builds)) {
    return console.log("No build settings detected. Please add a builds array to your config");
  }

  // Create the plugin executer object, which handles proper loading of
  // plugins, and waterfall execution per build.
  var executer = new PluginExecuter(jsonConfig.verbose);

  // run build for each format
  _.each(jsonConfig.builds, function(build, i) {

    // if there is no format in the build object
    if(!build.format) return console.log("no format in build setting. Skipping build " + (i+1))

    // make a config object that consists of the build config,
    // with the main config and defaults merged on top of it.
    // We remove the "builds" property and add the build number.
    var config = _.merge({ buildNumber: i + 1 }, defaults, jsonConfig, build);
    delete config.builds;

    // figure out the build folder for this format
    var destination = helpers.destination(config.destination, config.buildNumber);

    // Add extra plugins
    if(config.addPlugins) config.plugins = config.plugins.concat(config.addPlugins);

    // execute all plugin functions.
    var args = [config, { destination: destination }];
    var finish = function(config, stream, extras) {
      if(config.finish) {
        config.finish(config.format, null);
      }
    }
    executer.execute(config.plugins, config.disablePlugins, args, finish);
  });
}
