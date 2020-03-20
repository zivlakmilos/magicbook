var debug = require('debug')('magicbook:permalinks');
var through = require('through2');
var path = require('path');
var slug = require('slug');
var _ = require('lodash');

var Plugin = function(registry) {
  registry.before('stylesheets:insert', 'permalinks', this.permalinks);
};

function parentsToSlug(child) {
  var labels = [];
  var parent = child.parent;
  while(parent) {
    labels.push(parent.label);
    parent = parent.parent;
  }
  labels = _.without(labels.reverse(), 'root');
  return _.map(labels, function(l) { return slug(l.toLowerCase()) }).join('/');
}

Plugin.prototype = {

  permalinks: function(config, stream, extras, callback) {

    stream = stream.pipe(through.obj(function(file, enc, cb) {

      var permalink = _.get(file, 'pageLocals.page.permalink') || config.permalink;

      if(permalink) {

        // replace :title with base filename
        permalink = permalink.replace(':title', file.stem);

        // replace :parts with parent names
        if(permalink.match(/\:parts/)) {
          var prefix = parentsToSlug(file);
          permalink = permalink.replace(':parts', prefix);
        }

        file.path = path.join(file.base, permalink);
      }

      debug(file.path, file.contents.toString().substring(0, 20));

      cb(null, file);

    }));

    callback(null, config, stream, extras);
  }
}

module.exports = Plugin;
