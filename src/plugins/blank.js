// This is an empty plugin that can be used when starting to
// write a new plugin. It shows all the hooks available.


var through = require('through2');

// This constructor function will be called once per format
// for every build. You can set up basic variables needed in
// the other functions here.

var Plugin = function(){};

Plugin.prototype = {

  // The setup function is called right before a build start for every format.
  // Params:
  // format   - String name of the build format
  // config   - Object with the full configuration for the format
  // extras   - Object with extra things that may be used for setup. (markdown parser, liquid locals, etc)
  // cb(err)  - A callback to call whenever the setup is finished. Must be called with null or error.
  setup: function(format, config, extras, cb) {
    cb(null);
  },

  // Hooks are functions that allows you to hook into the build process
  // at certain times. Common to all of the hook is that they have to
  // return a Node stream2 transform. This is a powerful way to add extra
  // manipulation of files.
  hooks: {

    // load is called right after the markdown files are sourced, and
    // before the markdown conversion happens.
    load: function(format, config, extras) {
      return through.obj();
    },

    // convert is called right after markdown conversion.
    convert: function(format, config, extras) {
      return through.obj();
    },

    // layout is called right after layouts have been added
    // to the HTML files.
    layout: function(format, config, extras) {
      return through.obj();
    }
  }
}

module.exports = Plugin;
