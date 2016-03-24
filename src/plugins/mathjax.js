var through = require('through2');

module.exports = {

  // all of them gets passed the format, so it
  // knows whether to do something or not.

  hooks: {

    init: function(format, payload) {

      payload.md.use(require('markdown-it-math'));

      // no matter what, all hook functions must return
      // a through2 object, as it's a part of the chain.
      return through.obj(function (file, enc, cb) {
        cb(null, file);
    	});
    }

    // a way to add extra output files in some formats, like mathjac support
    // in the web versions. This will also require the ability to add extra
    // file to the scss bundle


  }

}
