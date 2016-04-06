// This is an empty plugin that can be used when starting to
// write a new plugin. It shows all the hooks available.


var through = require('through2');

// This constructor function will be called once per format
// for every build. You can set up basic variables needed in
// the other functions here.

var Plugin = function(){};

Plugin.prototype = {

  // The guts of a plugin consists of a number of hooks that allows
  // you to hook into the stream pipeline at certain times during
  // the build process.
  //
  // Common to all plugins is that they receive the following parameters.
  // config   - Object with the config settings for the format being built. Includes "format" property with string name of the format
  // stream   - The transform stream with source files. Setup hook does not have this argument as files have not been loaded.
  // extras   - Object holding extra objects for the particular hook
  // cb       - Function that MUST be called with error/null, and the same arguments as input.

  hooks: {

    // setup is called right before build start for every format.
    // extras:
    // md          - a markdown-it instance for this format
    // destination - destination folder for the files
    setup: function(config, extras, cb) {
      cb(null, config, extras);
    },

    // load is called right after the files are sourced, and
    // before the markdown conversion happens.
    // destination - destination folder for the files
    load: function(config, stream, extras, cb) {
      cb(null, config, stream, extras);
    },

    // convert is called right after markdown conversion.
    // destination - destination folder for the files
    convert: function(config, stream, extras, cb) {

      // IMPORTANT NOTE:
      //
      // If you write a custom plugin that needs to change the HTML,
      // you can check to see if a cheerio caching element is present
      // and use that element before re-parsing the HTML. All native
      // plugins use this variable so they don't need to parse the
      // HTML over and over again.
      //
      // stream = stream.pipe(through.obj(function(file, enc, cb) {
      //   if(!file.$el) file.$el = cheerio.load(file.contents.toString());
      //   // use file.$el
      // }))
      //
      // On the other hand, if you change file.contents without using the
      // file.$el cheerio element, you must set file.$el to undefined.
      // That will make the following plugins parse the HTML into file.$el.
      //
      // stream = stream.pipe(through.obj(function(file, enc, cb) {
      //   // change HTML without cheerio here
      //   file.$el = undefined;
      // }))

      cb(null, config, stream, extras);
    },

    // layout is called right after layouts have been added
    // to the HTML files.
    // destination - destination folder for the files
    layout: function(config, stream, extras, cb) {
      cb(null, config, stream, extras);
    },

    // finish is called right before the stream ends. This is mostly
    // used for plugins that define formats.
    // extras:
    // destination  - build destination folder for this format
    finish: function(config, stream, extras, cb) {
      cb(null, config, stream, extras);
    }
  }
}

module.exports = Plugin;
