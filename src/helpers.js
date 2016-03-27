var tinyliquid = require('tinyliquid');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');

module.exports = {

  // Get build destination for a single format
  // Returns: string
  destination: function(dest, format) {
    return dest.replace(":format", format);
  },

  // Check whether a vinyl file is a markdown file
  // Returns: boolean
  isMarkdown: function(file) {
    return file.path.match(/\.md$/) || file.path.match(/\.markdown$/);
  },

  // Check whether a vinyl file is a scss file
  // Returns: boolean
  isScss: function(file) {
    return file.path.match(/\.scss$/);
  },

  // Renders locals into a liquid template. Takes care of functionality
  // shared between the liquid plugin and the main layout liquid rendering.
  renderLiquidTemplate: function(template, locals, file, config, cb) {

    // assemble variables to pass into the file
    var context = tinyliquid.newContext({ locals: locals });

    // set includes
    var templatePath = _.get(file, "config.liquid.includes") || config.liquid.includes;
    context.onInclude(function (name, callback) {
      fs.readFile(path.join(templatePath, name), function(err, text) {
        if (err) return callback(new Error('Liquid include template not found: ' + err));
        var ast = tinyliquid.parse(text.toString());
        callback(null, ast);
      });
    });

    // render
    template(context, function(err) {
      file.contents = new Buffer(context.getBuffer());
      cb(err, file);
    });

  }

};
