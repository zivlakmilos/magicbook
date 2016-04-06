var through = require('through2');
var cheerio = require('cheerio');
var htmlbookHelpers = require('../helpers/htmlbook');
var streamHelpers = require('../helpers/stream');
var _ = require('lodash');

var Plugin = function(){};

var levels = {
  "chapter" : 0,
  "appendix" : 0,
  "afterword" : 0,
  "bibliography" : 0,
  "glossary" : 0,
  "preface" : 0,
  "foreword" : 0,
  "introduction" : 0,
  "acknowledgments" : 0,
  "afterword" : 0,
  "conclusion" : 0,
  "part" : 0,
  "index" : 0,
  "sect1": 1,
  "sect2": 2,
  "sect3": 3,
  "sect4": 4,
  "sect5": 5
};

var maxLevel = 3;

// takes an element and finds all direct section in its children.
// recursively calls itself on all section children to get a tree
// of sections.
function getSections($, root, href) {

  var items = [];

  var sections = root.children("section[data-type], div[data-type='part']");

  sections.each(function(index, el) {

    var jel = $(el);
    var header = jel.find("> header");

    // create section item
    var item = {
      id: jel.attr("id"),
      type: jel.attr("data-type")
    };

    // find title of section
    var title = header.length ? header.find("> h1, > h2, > h3, > h4, > h5") : jel.find("> h1, > h2, > h3, > h4, > h5");
    if(title.length) {
      item.label = title.first().text();
    }

    // find level of section
    var level;
    if(item.type in levels) {
      level = levels[item.type];
    } else {
      return;
    }

    // find href of section
    item.href = href + "#" + item.id;

    if(level <= maxLevel) {
      item.children = getSections($, jel, href);
    }

    items.push(item);
  });

  return items;
}

Plugin.prototype = {

  hooks: {

    convert: function(config, stream, extras, callback) {

      // First run through every file and get a tree of the section
      // navigation within that file. Save to our nac object.
      stream = stream.pipe(through.obj(function(file, enc, cb) {

        // create cheerio element for file
        if(!file.$el) {
          var content = file.contents.toString();
          file.$el = cheerio.load(content);
        }

        // make this work whether or not we have a
        // full HTML file.
        var root = file.$el.root();
        var body = file.$el('body');
        if(body.length) root = body;

        // add this files sections to the book children
        var sections = getSections(file.$el, root, config.format == "pdf" ? '' : file.relative);
        if(!_.isEmpty(sections)) {
          file.sections = sections;
        }

        cb(null, file);
      }));

      // Now wait for the stream to finish and assign the
      // full nav object to the liquid locals.
      // now finish the stream so we know all files have been parsed.
      // create new stream where we parse links. Then return new stream.
      streamHelpers.finishWithFiles(stream, function(files) {

        var toc = {
          type: 'book',
          children: []
        };

        // combine the sections of each file
        _.each(files, function(file) {
          if(!_.isEmpty(file.sections)) {
            toc.children = toc.children.concat(file.sections);
          }
        });

        extras.locals.toc = toc;

        // create new stream from the files
        stream = streamHelpers.streamFromArray(files);

        callback(null, config, stream, extras);
      });
    }
  }
}

module.exports = Plugin;
