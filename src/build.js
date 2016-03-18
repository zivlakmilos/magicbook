var _ = require('lodash');
var glob = require("multi-glob").glob;

module.exports = function(argv, config) {

  // load build files
  glob(config.files, function(err, files) {
    console.log(files)
  });

  console.log("BUILD BABY", argv, config);
}
