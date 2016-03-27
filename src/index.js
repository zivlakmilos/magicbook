#! /usr/bin/env node

var build = require('./build');
var fs = require("fs");
var _ = require('lodash');
var chokidar = require('chokidar');
var path = require('path');
var helpers = require('./helpers');
var argv = require('yargs').argv;
var cmd = argv._[0];

// Loads the config file into a JS object
function loadConfig(path) {
  try {
    var configJSON = JSON.parse(fs.readFileSync(process.cwd() + "/" + path));
    console.log("Config file detected: " + path)
    return configJSON;
  }
  catch(e) {
    console.log("No config file detected")
  }
}

// Trigger a build
function triggerBuild() {

  // Pick command lines options that take precedence
  var cmdConfig = _.pick(argv, ['files']);;

  // load config file and merge into config
  var jsonConfig = loadConfig(argv.config || 'magicbook.json');
  _.defaults(cmdConfig, jsonConfig);

  // trigger the build with the new config
  build(cmdConfig);

  return cmdConfig;

}

// Run build process
if(cmd == "build") {

  var config = triggerBuild();

  // if watch is enabled, we run build whenever files change. This could be faster
  // if we used the exact listeners in the pipe chain with gulp-watch,
  // however, given the complexity of changes in the config file, this is
  // the initial implementation. That would also help simplify the listening code for this
  // as we want to ignore the build directory.
  if(argv.watch) {

    // figure out what folders to ignore
    var ignore = ['node_modules', /[\/\\]\./, 'build'];

    if(config.destination) {
      ignore.push(helpers.destination(config.destination, ""));
    }
    if(config.formats) {
      var formats = config.eabledFormats || ["html", "epub", "mobi", "pdf"];
      _.each(formats, function(format) {
        var dest = _.get(config.formats, format + ".destination");
        if(dest) ignore.push(dest);
      });
    }

    var watch = chokidar.watch(['**/*.md', '**/*.html', '**/*.scss', '**/*.css', '**/*.json'], { ignored: ignore})
      .on('ready', function() {

        console.log('Listening for file changes')

        watch.on('add', function(path) {
          triggerBuild();
        });

        watch.on('change', function(path) {
          triggerBuild();
        });

        watch.on('unlink', function() {
          triggerBuild();
        });

      });
  }

}

// This command does not exist
else {
  console.log("Command not supported");
}
