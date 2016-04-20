var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var cheerio = require('cheerio');
var tinyliquid = require('tinyliquid');

var Plugin = function(registry) {
  this.cache = {};
  registry.before('load', 'codesplit:tag', _.bind(this.liquidTag, this));
};

Plugin.prototype = {

  parseExample: function(code) {

    var opt = {} // no op for now
    var div = cheerio.load('<div class="codesplit"><div class="codesplit-content"></div></div>');

    // If we want to display just a part of this example,
    // let's look for the start and finish lines and use
    // only those.
    if(opt.pick) {
      var startIndex = code.indexOf(opt.pick.start)
      var stopIndex = code.indexOf(opt.pick.stop)
      if(startIndex > -1 && stopIndex > -1) {
        code = code.substring(startIndex, stopIndex + opt.pick.stop.length);
      }
      else {
        console.log("pick values not found");
      }
    }

    var split = code.split('\n');

    // When picking values, we often pick lines that are indented. For those
    // lines not to have extra space on the left, let's remove the amount of
    // whitespace from all lines based on the whitespace from the first line.
    var padnum = split[0].search(/\S|$/);
    var regex = new RegExp("^\\s{"+padnum+"}");
    if(padnum > 0) {
      split = _.map(split, function(line) {
        return line.replace(regex, '');
      });
    }

    // Parse every line and create individual code and comment objects in
    // the containers array.
    var containers = [];
    for(var i = 0; i < split.length; i++) {
      var type = split[i].match(/^\s*\/\//) ? "comment" : "code";
      if(containers.length == 0 || containers[containers.length-1].type !== type) {
        containers.push({ type: type, lines: [] })
      }
      containers[containers.length-1].lines.push(split[i]);
    }

    // Create new elements from the containers array.
    for(var i = 0; i < containers.length; i++) {

      // If this is a comment
      if(containers[i].type == "comment") {
        var para = _.map(containers[i].lines, function(line) {
          return line.replace('//', '').trim();
        }).join(' ');
        div('.codesplit-content').append('<div class="codesplit-comment"><p>' + para + '</p></div>');
      }
      // If this is a comment
      else if(containers[i].type == "code") {
        var lines = containers[i].lines.join('\n');
        // if this is going to be shows as one big field
        // let's preserve the exact spacing.
        if(opt.keepLastLinebreak) {
          lines += '\n';
        }
        div('.codesplit-content').append('<div class="codesplit-code"><pre><code>' + lines + '</code></pre></div>');
      }
    }

    return div.html();
  },

  getExample: function(examplePath) {

    // only load if not in cache
    if(!this.cache[examplePath]) {
      this.cache[examplePath] = fs.readFileSync(examplePath).toString();
    }

    // parse example
    return this.parseExample(this.cache[examplePath]);
  },

  liquidTag: function(config, extras, callback) {

    if(!_.get(config, 'codesplit.includes')) {
      return console.log('WARNING: No codesplit include folder set')
    }

    var that = this;
    _.set(config, 'liquid.customTags.codesplit', function(context, tag, example) {
      var examplePath = path.join(config.codesplit.includes, example);
      var ast = tinyliquid.parse(that.getExample(examplePath))
      context.astStack.push(ast);
    });
    callback(null, config, extras);
  }

}

module.exports = Plugin;
