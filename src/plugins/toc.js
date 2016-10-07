var fs = require('fs');
var through = require('through2');
var cheerio = require('cheerio');
var tinyliquid = require('tinyliquid');
var helpers = require('../helpers/helpers');
var htmlbookHelpers = require('../helpers/htmlbook');
var streamHelpers = require('../helpers/stream');
var path = require('path');
var _ = require('lodash');
var util = require('util');

var Plugin = function(registry) {
  registry.before('liquid', 'toc:placeholders', _.bind(this.insertPlaceholders, this));
  registry.after('ids', 'toc:generate', _.bind(this.generateTOC, this));
  registry.after('layouts', 'toc:insert', _.bind(this.insertTOC, this));
};

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

var placeHolder = "MBINSERT:TOC"
var maxLevel = 3;

// takes an element and finds all direct section in its children.
// recursively calls itself on all section children to get a tree
// of sections.
function getSections($, root, relative) {

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
    item.relative = relative;

    if(level <= maxLevel) {
      item.children = getSections($, jel, relative);
    }

    items.push(item);
  });

  return items;
}

Plugin.prototype = {

  // When the files are loaded, we add a liquid local that simply
  // replace {{ toc }}  with a string placeholder. This is needed because
  // liquid runs before markdown conversion, and the TOC is generated after
  // markdown conversion. So in a later hook, we generate the TOC and insert
  // the TOC instead of the placeholder.
  insertPlaceholders: function(config, stream, extras, callback) {
    _.set(extras, "pageLocals.toc", placeHolder);
    _.set(extras, "layoutLocals.toc", placeHolder);
    callback(null, config, stream, extras);
  },

  // When the files have been converted, we run the TOC generation.
  // This is happening before the layouts, because it won't work if
  // the markup is wrapped in container div's. We should rewrite the
  // TOC generation to work with this.
  generateTOC: function(config, stream, extras, callback) {

    var tocFiles = this.tocFiles = [];

    // First run through every file and get a tree of the section
    // navigation within that file. Save to our nav object.
    stream = stream.pipe(through.obj(function(file, enc, cb) {

      // create cheerio element for file if not present
      file.$el = file.$el || cheerio.load(file.contents.toString());

      // make this work whether or not we have a
      // full HTML file.
      var root = file.$el.root();
      var body = file.$el('body');
      if(body.length) root = body;

      // add sections to plugin array for use later in the pipeline
      tocFiles.push({
        file: file,
        sections: getSections(file.$el, root, file.relative)
      });

      cb(null, file);
    }));

    callback(null, config, stream, extras);
  },

  insertTOC: function(config, stream, extras, callback) {

    var tocFiles = this.tocFiles;

    // wait for the stream to finish, knowing all files have been
    // parsed, and start a new stream that replaces all placeholders.
    streamHelpers.finishWithFiles(stream, function(files) {

      var curPart;
      var toc = {
        type: 'book',
        children: []
      };

      function partToTOC(part, toc) {
        _.each(part.files, function(file) {

          // if this has no label, they are direct children.
          // I should probably use a .part flag instead.
          if(!file.label) {

            // loop through each vinyl file and find the corresponding
            // tocFile. Then assign sections to current toc parent.
            _.each(file.vinyls, function(vinyl) {
              var tocFile = _.find(tocFiles, function(f) {
                return f.file.history[0] == vinyl.history[0];
              });
              if(tocFile && !_.isEmpty(tocFile.sections)) {
                toc.children = toc.children.concat(tocFile.sections);
              }
            });
          }

          // This is a part and we need to handle it by calling
          // partToTOC. This removes the ability to add extra config
          // to part config. Rethink.
          else {
            var child = { type: 'part', label: file.label, children: []}
            partToTOC(file, child);
            toc.children.push(child);
          }

        });
      }

      // If we are working with parts, recursively loop
      // through the part tree and add to toc.
      if(extras.partTree) {
        partToTOC(extras.partTree, toc);
      }
      // If we have a flat file array, just add all
      // file sections in order.
      else {
        _.each(tocFiles, function(f) {
          toc.children = toc.children.concat(f.sections);
        });
      }

      // a function to turn a toc tree into relative
      // URL's for a specific file.
      function relativeTOC(file, parent) {
        _.each(parent.children, function(child) {
          if(child.relative) {
            var href = "";
            if(config.format != "pdf") {
              var relativeFolder = path.relative(path.dirname(file.relative), path.dirname(child.relative));
              href = path.join(relativeFolder, path.basename(child.relative))
            }
            if(child.id) {
              href += "#" + child.id;
            }
            child.href = href;
          }
          if(child.children) {
            child = relativeTOC(file, child);
          }
        });
        return parent;
      }

      // create new stream from the files and
      // loop through each file and replace placeholder
      // with toc include.
      // check if there is a placeholder, and then fail if there is
      // no include names toc.html
      stream = streamHelpers.streamFromArray(files)
        .pipe(through.obj(function(file, enc, cb) {

        // only if this file has the placeholder
        if(file.contents.toString().match(placeHolder)) {

          var tmpl = tinyliquid.compile("{% include toc.html %}");
          var locals = { toc: relativeTOC(file, toc) };
          var includes = _.get(file, "pageLocals.page.includes") || config.liquid.includes;

          helpers.renderLiquidTemplate(tmpl, locals, includes, function(err, data) {

            // now replace the placeholder with the rendered liquid
            // in the file.
            var content = file.contents.toString();
            file.contents = new Buffer(content.replace(placeHolder, data.toString()));
            file.$el = undefined;

            cb(err, file);
          });

        } else {
          cb(null, file);
        }

      }));

      callback(null, config, stream, extras);
    });
  }
}

module.exports = Plugin;
