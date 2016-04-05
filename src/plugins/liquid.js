var through = require('through2');
var tinyliquid = require('tinyliquid');
var helpers = require('../helpers/helpers');
var _ = require('lodash');

var Plugin = function(){};

Plugin.prototype = {

  hooks: {

    // this means running liquid after markdown conversion.
    // This might cause problems? But we don't have a TOC before the
    // MD files have been converted to HTMLBook.
    layout: function(config, stream, extras, callback) {

      stream = stream.pipe(through.obj(function(file, enc, cb) {

        var template = tinyliquid.compile(file.contents.toString());

        // main object
        var locals = {
          format: config.format,
          config: config,
          page: file.config
        }

        // add extra liquid locals from the build pipeline
        _.assign(locals, extras.locals);

        helpers.renderLiquidTemplate(template, locals, file, config, cb)
      }));

      callback(null, config, stream, extras);
    }
  }

}

module.exports = Plugin;
