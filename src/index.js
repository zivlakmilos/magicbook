#! /usr/bin/env node

var build = require('./build');
var fs = require("fs");
var _ = require('lodash');
var argv = require('yargs').argv;
var cmd = argv._[0];

// Prepare config
// - Command line gets first priority
// - JSON config gets second priority
// - Defaults get third priority
var config = _.pick(argv, ['files']);;
var configJSON = {};
try {
  var configFile = argv.config || 'magicbook.json';
  configJSON = JSON.parse(fs.readFileSync(process.cwd() + "/" + configFile));
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
