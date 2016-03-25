var through = require('through2');

// This is an empty plugin that can be used when starting to
// write a new plugin. It shows all the hooks available.

module.exports = {

  // The setup function is called before the file conversion happens.
  // It can be used to do things that need to happen only once per
  // format build.
  // Params:
  // format - String name of the build format
  // config - Object with the full configuration for the format
  // md     - the markdown-it instance used for markdown conversion
  // cb(err)  - A callback to call whenever the setup is finished. Must be called with null or error.
  setup: function(format, config, md, cb) {
    cb(null);
  }

  // Hooks are functions that allows you to hook into the build process
  // at certain times. Common to all of the hook is that they have to
  // return a Node stream2 transform. This is a powerful way to add extra
  // manipulation of files.
  hooks: {

    // init is called right after the markdown files are sourced, and
    // before the markdown conversion happens.
    init: function(format, payload) {
      return through.obj();
    },

    // convert is called right after markdown conversion.
    convert: function(format, payload) {
      return through.obj();
    }
  }

}
