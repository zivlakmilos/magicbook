var tinyliquid = require('tinyliquid');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');

var helpers = {

  // Get build destination for a single format
  // Returns: string
  destination: function(dest, buildNumber) {
    return dest.replace(":build", 'build' + buildNumber);
  },

  // Renders locals into a liquid template. Takes care of functionality
  // shared between the liquid plugin and the main layout liquid rendering.
  renderLiquidTemplate: function(tmpl, locals, includes, cb) {

    // assemble variables to pass into the file
    var context = tinyliquid.newContext({ locals: locals });

    // set includes
    context.onInclude(function (name, callback) {
      fs.readFile(path.join(includes, name), function(err, text) {
        if (err) return callback(new Error('Liquid include template not found: ' + err));
        var ast = tinyliquid.parse(text.toString());
        callback(null, ast);
      });
    });

    // render
    tmpl(context, function(err) {
      cb(err, context.getBuffer());
    });

  }
};

module.exports = helpers;
