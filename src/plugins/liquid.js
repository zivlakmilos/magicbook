var through = require('through2');
var tinyliquid = require('tinyliquid');
var helpers = require('../helpers/helpers');
var _ = require('lodash');

var Plugin = function(registry) {
  registry.before('markdown:convert', this.liquidPages);
};

Plugin.prototype = {

  liquidPages: function(config, stream, extras, callback) {

    stream = stream.pipe(through.obj(function(file, enc, cb) {

      var template = tinyliquid.compile(file.contents.toString());

      // main object
      var locals = {
        format: config.format,
        config: config
      }

      // add extra liquid locals from the build pipeline
      if(file.pageLocals) {
        _.assign(locals, file.pageLocals);
      }

      var includes = _.get(file, "pageLocals.page.includes") || config.liquid.includes;
      helpers.renderLiquidTemplate(template, locals, includes, function(err, data) {
        file.contents = new Buffer(data);
        file.$el = undefined;
        cb(err, file);
      });
    }));

    callback(null, config, stream, extras);
  }
}

module.exports = Plugin;
