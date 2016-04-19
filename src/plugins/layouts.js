var through = require('through2');

var Plugin = function(registry) {
  this.layouts = {};
  registry.after('markdown:convert', 'layouts', _.bind(this.addLayouts));
};

Plugin.prototype = {

  addLayouts: function(config, stream, extras, cb) {

    stream = stream.pipe(through.obj(function(file, enc, cb) {

      var layout = _.get(file, "layoutLocals.page.layout") || config.layout;
      var includes = _.get(file, "layoutLocals.page.includes") || config.liquid.includes;

      if(layout) {

        // create the object to pass into liquid for this file
        var locals = {
          content: file.contents.toString(),
          format: config.format,
          config: config
        }

        if(file.layoutLocals) {
          _.assign(locals, file.layoutLocals);
        }

        // if the cache has not been loaded, load the file
        // and create a template from it.
        if(!this.layouts[layout]) {
          var layoutContent = fs.readFileSync(layout);
          this.layouts[layout] = tinyliquid.compile(layoutContent.toString());
        }

        // then render the layout
        helpers.renderLiquidTemplate(this.layouts[layout], locals, includes, function(err, data) {
          file.contents = new Buffer(data);
          file.$el = undefined;
          cb(err, file);
        });

      } else {
        cb(null, file);
      }
    }));
  }
}

module.exports = Plugin;
