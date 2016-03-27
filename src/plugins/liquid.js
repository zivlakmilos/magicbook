var through = require('through2');
var _ = require('lodash');
var tinyliquid = require('tinyliquid');

module.exports = {

  hooks: {

    load: function(format, config, extras) {

      return through.obj(function(file, enc, cb) {

        if(file.config) {

          // compile with tinyliquid
          var template = tinyliquid.compile(file.contents.toString());
          var context = tinyliquid.newContext({
            locals: {
              format: format,
              config: config,
              page: file.config
            }
          });

          template(context, function(err) {
            file.contents = new Buffer(context.getBuffer());
            cb(err, file);
          });
        } else {
          cb(null, file);
        }
      });
    }
  }

}
