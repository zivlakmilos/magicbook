// This is an empty plugin that can be used when starting to
// write a new plugin.

var through = require('through2');

// This constructor function will be called once per format
// for every build. It received a plugin registry object, which
// has .add(), .after() and .before() functions that can be used
// to register plugin functions in the pipeline.

var Plugin = function(registry){

  // registry.before('convert', 'myFirstLabel', this.myFirstFunction);
  // registry.after('layouts', 'mySecondLabel', this.mySecondFunction);

};

Plugin.prototype = {

  // Define functions in the prototype object. Each function will
  // have the following parameters:
  // config   - Object with the config settings for the format being built. Includes "format" property with string name of the format
  // stream   - The transform stream with source files. Setup hook does not have this argument as files have not been loaded.
  // extras   - Object holding extra objects, like the markdown converter
  // cb       - Function that MUST be called with error/null, config, stream, extras.

  myFirstFunction: function(config, stream, extras, cb) {

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

  mySecondFunction: function(config, stream, extras, cb) {
    cb(null, config, stream, extras);
  }
}

module.exports = Plugin;
