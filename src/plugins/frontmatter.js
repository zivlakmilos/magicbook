var through = require('through2');
var yamlFront = require('yaml-front-matter');
var _ = require('lodash');

var Plugin = function(){};

Plugin.prototype = {

  hooks: {

    load: function(config, stream, extras, callback) {

      stream = stream.pipe(
        through.obj(function(file, enc, cb) {

          // parse frontmatter in file
          var parsed = yamlFront.loadFront(file.contents);

          // set main content back to file
          file.contents = new Buffer(parsed.__content);

          // delete content from the parsed frontmatter
          delete parsed.__content;

          // assign the frontmatter objects to .config for
          // processing with the liquid plugin.
          if(!_.isEmpty(parsed)) {
            file.config = file.config || {};
            _.extend(file.config, parsed);
          }

          // pass file through the chain
          cb(null, file);

        })
      );

      callback(null, config, stream, extras);
    }
  }
}

module.exports = Plugin;
