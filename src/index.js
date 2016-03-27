#! /usr/bin/env node

var build = require('./build');
var fs = require("fs");
var _ = require('lodash');
var argv = require('yargs').argv;
var cmd = argv._[0];

// Pick command lines options that override configuration
var config = _.pick(argv, ['files']);;
try {
  var configFile = argv.config || 'magicbook.json';
  configJSON = JSON.parse(fs.readFileSync(process.cwd() + "/" + configFile));
  _.defaults(config, configJSON);
  console.log("Config file detected: " + configFile)
}
catch(e) {
  console.log("No config file detected")
}

// Run build process
if(cmd == "build") {
  build(config);
}

// This command does not exist
else {
  console.log("Command not supported");
}
