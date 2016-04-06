var through = require('through2');
var cheerio = require('cheerio');
var Hashids = require('hashids');
var slug = require('slug');

var Plugin = function(){};

var prefix = 'mb';
var tags = ["section", "div"];
var needIds = "section[data-type]:not([id]), div[data-type]:not([id])";

Plugin.prototype = {

  hooks: {

    convert: function(config, stream, extras, callback) {

      // pipe each file
      stream = stream.pipe(through.obj(function(file, enc, cb) {

        // create cheerio element for file
        if(!file.$el) {
          var content = file.contents.toString();
          file.$el = cheerio.load(content);
        }

        // creating hashing object that uses file.path as salt
        var hashids = new Hashids(file.path, 5);

        // loop through every element needing ID and
        // generate an ID.
        file.$el(needIds).each(function(i, el) {

          var jel = file.$el(this);
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
            jel.attr('id', prefix + '-' + titleSlug + '-' + hashId);
          }
          // otherwise just use hash
          else {
            jel.attr('id', prefix + '-' + hashId);
          }
        });

        file.contents = new Buffer(file.$el.html());

        cb(null, file);
      }));

      callback(null, config, stream, extras);
    }
  }
}

module.exports = Plugin;
