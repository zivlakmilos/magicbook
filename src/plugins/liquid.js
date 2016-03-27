var through = require('through2');
var _ = require('lodash');
var tinyliquid = require('tinyliquid');
var fs = require('fs');
var path = require('path');

module.exports = {

  hooks: {

    load: function(format, config, extras) {

      return through.obj(function(file, enc, cb) {

        // create template from file content
        var template = tinyliquid.compile(file.contents.toString());

        // assemble variables to pass into the file
        var context = tinyliquid.newContext({
          locals: {
            format: format,
            config: config,
            page: file.config
          }
        });

        // set includes
        var templatePath = _.get(file, "config.includes") || config.includes;
        context.onInclude(function (name, callback) {
          fs.readFile(path.join(templatePath, name), function(err, text) {
            if (err) return callback(err);
            var ast = tinyliquid.parse(text.toString());
            callback(null, ast);
          });
        });

        // render
        template(context, function(err) {
          file.contents = new Buffer(context.getBuffer());
          cb(err, file);
        });

      });
    }
  }

}
