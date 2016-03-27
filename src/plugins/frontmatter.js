var through = require('through2');
var yamlFront = require('yaml-front-matter');

module.exports = {

  hooks: {

    load: function(format, config, extras) {
      return through.obj(function(file, enc, cb) {

        // parse frontmatter in file
        var parsed = yamlFront.loadFront(file.contents);

        // set main content back to file
        file.contents = new Buffer(parsed.__content);

        // delete content from the parsed frontmatter
        delete parsed.__content;

        // assign the frontmatter objects to .liquidLocals for
        // processing with the liquid plugin.
        file.liquidLocals = parsed;

        cb(null, file);
      });
    }
  }

}
