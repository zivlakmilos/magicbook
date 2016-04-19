var through = require('through2');
var yamlFront = require('yaml-front-matter');
var _ = require('lodash');

var Plugin = function(registry) {
  registry.after('load', 'frontmatter',  this.parseFrontmatter);
};

Plugin.prototype = {

  parseFrontmatter: function(config, stream, extras, callback) {

    stream = stream.pipe(
      through.obj(function(file, enc, cb) {

        // parse frontmatter in file
        var parsed = yamlFront.loadFront(file.contents);

        // set main content back to file
        file.contents = new Buffer(parsed.__content);

        // delete content from the parsed frontmatter
        delete parsed.__content;

        // Make the .page variable available in both the
        // pages and the layout liquid rendering.
        if(!_.isEmpty(parsed)) {
          _.set(file, "pageLocals.page", parsed);
          _.set(file, "layoutLocals.page", parsed);
        }

        // pass file through the chain
        cb(null, file);

      })
    );

    callback(null, config, stream, extras);
  }
}

module.exports = Plugin;
