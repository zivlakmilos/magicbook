var through = require('through2');
var cheerio = require('cheerio');
var Hashids = require('hashids');
var slug = require('slug');

var Plugin = function(registry) {
  registry.after('markdown:convert', 'ids',  this.createIds);
};

var tags = ["section", "div"];
var needIds = "section[data-type]:not([id]), div[data-type]:not([id])";

Plugin.prototype = {

  createIds: function(config, stream, extras, callback) {

    // pipe each file
    stream = stream.pipe(through.obj(function(file, enc, cb) {

      file.$el = file.$el || cheerio.load(file.contents.toString());

      // creating hashing object that uses file.path as salt
      var salt = file.relative;
      var hashids = new Hashids(salt, 7);

      // loop through every element needing ID and
      // generate an ID.
      file.$el(needIds).each(function(i, el) {

        var jel = file.$el(this);

        // we start with the name of the file
        var ids = [];

        // if the element has an ID, return
        if(jel.attr('id')) {
          return;
        }

        // the tag is a unique ID
        ids.push(tags.indexOf(el.name));

        // the index in the search is a unique id too
        ids.push(i);

        // hash all those ids into a hash
        var hashId = hashids.encode(ids);

        // find the first title in the section
        var title = jel.find("h1, h2, h3, h4, h5").first();

        // if we have a title, make ID of title and hash
        if(title.length) {
          titleSlug = slug(title.text().toLowerCase());
          jel.attr('id', titleSlug + '-' + hashId);
        }
        // otherwise just use hash
        else {
          jel.attr('id', hashId);
        }
      });

      file.contents = new Buffer(file.$el.html());

      cb(null, file);
    }));

    callback(null, config, stream, extras);
  }
}

module.exports = Plugin;
