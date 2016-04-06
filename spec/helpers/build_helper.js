var build = require('../../src/build.js');
var fs = require('fs');
var uuid = require('node-uuid');
var _ = require('lodash');

global.buildPath = function(uid, file) {
  return "spec/support/book/tmp/" + uid + "/" + file;
}

global.triggerBuild = function(config) {
  var uid = uuid.v4().replace('-', "").substring(0, 10);
  _.defaults(config, {
    images: {
      source: 'spec/support/book/images'
    },
    files: ["spec/support/book/content/first-chapter.md", "spec/support/book/content/second-chapter.html"],
    destination: "spec/support/book/tmp/"+uid+"/:build"
  });
  build(config);
  return uid;
};

global.fileContent = function(path) {
  try {
    return fs.readFileSync(path);
  }
  catch(err) {
    console.log(err)
    return "FILE NOT LOADED: " + err.toString();
  }
}

global.buildContent = function(uid, file) {
  var path = global.buildPath(uid, file);
  return global.fileContent(path);
}
