var through = require('through2');
var tinyliquid = require('tinyliquid');
var helpers = require('../helpers');

var Plugin = function(){};

Plugin.prototype = {

  hooks: {

    load: function(config, stream, extras, callback) {

      stream = stream.pipe(through.obj(function(file, enc, cb) {
        var template = tinyliquid.compile(file.contents.toString());
        var locals = {
          format: config.format,
          config: config,
          page: file.config
        }
        helpers.renderLiquidTemplate(template, locals, file, config, cb)
      }));

      callback(null, config, stream, extras);
    }
  }

}

module.exports = Plugin;
