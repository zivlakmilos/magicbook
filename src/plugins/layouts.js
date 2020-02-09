var through = require("through2");
var fs = require("fs");
var tinyliquid = require("tinyliquid");
var helpers = require("../helpers/helpers");
var _ = require("lodash");

var Plugin = function(registry) {
  this.layouts = {};
  registry.after("markdown:convert", "layouts", _.bind(this.addLayouts, this));
};

Plugin.prototype = {
  addLayouts: function(config, stream, extras, callback) {
    var that = this;

    stream = stream.pipe(
      through.obj(function(file, enc, cb) {
        var layout = _.get(file, "layoutLocals.page.layout") || config.layout;
        var includes =
          _.get(file, "layoutLocals.page.includes") || config.liquid.includes;

        if (layout && layout !== "none") {
          // create the object to pass into liquid for this file
          var locals = {
            content: file.contents.toString(),
            format: config.format,
            config: config
          };

          // Add locals set globally
          if (extras.layoutLocals) {
            _.assign(locals, extras.layoutLocals);
          }

          // Add locals set on file
          if (file.layoutLocals) {
            _.assign(locals, file.layoutLocals);
          }

          // if the cache has not been loaded, load the file
          // and create a template from it.
          if (!that.layouts[layout]) {
            try {
              var layoutContent = fs.readFileSync(layout);
              that.layouts[layout] = tinyliquid.compile(
                layoutContent.toString()
              );
            } catch (e) {
              return cb(new Error("Layout not found: " + layout));
            }
          }

          // then render the layout
          helpers.renderLiquidTemplate(
            that.layouts[layout],
            locals,
            includes,
            function(err, data) {
              file.contents = new Buffer(data);
              file.$el = undefined;
              cb(err, file);
            }
          );
        } else {
          cb(null, file);
        }
      })
    );

    callback(null, config, stream, extras);
  }
};

module.exports = Plugin;
