var _ = require('lodash');
var cheerio = require('cheerio');
var beautify = require('js-beautify').html;

var headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
var newHeadings = ['h1', 'h1', 'h2', 'h3', 'h4', 'h5'];
var sections = ['chapter', 'sect1', 'sect2', 'sect3', 'sect4', 'sect5'];

var helpers = {

  // Function that searches a node for a certain heading level,
  // and creates subsections when it encounters headings below
  // this level.
  sectionize : function($, level, nodes, newNodes, i) {

    // start iterating nodes from i
    while(i < nodes.length) {

      // if this is heading
      var headingIndex = headings.indexOf(nodes[i].tagName);
      if(headingIndex > -1) {

        // if this is a heading of the level we're looking for
        if(headingIndex == level-1) {

          // create new subsection
          var subsection = $('<section data-type="'+ sections[headingIndex] +'"></section>')[0];

          // change the heading to the htmlbook heading,
          // and add it to the subsection.
          nodes[i].tagName = newHeadings[headingIndex];
          subsection.childNodes.push(nodes[i]);

          // add the subsection to the newNodes
          newNodes.push(subsection);

          // sectionize nodes following this heading, adding them to subsection
          i = helpers.sectionize($, level+1, nodes, subsection.childNodes, i+1)
        }
        // if this is not the level we're looking for, it means that
        // this document doesn't have heading in the correct order.
        else {
          return i;
        }

      // if this is not a heading, just add it to the nodes
      } else {
        newNodes.push(nodes[i]);
        i++;
      }
    }
  },

  // Function to make HTMLBook sections from heading hierachy in a markdown-it
  // converted file
  makeHtmlBook: function(html) {

    var $ = cheerio.load(html);
    var children = $.root()[0].childNodes;
    var newChildren = [];

    // find all internal links and add data-type to them
    $("a:not([href^=http])").each(function() {
      $(this).attr('data-type', 'xref');
    });

    // recursively traverse the HTML doc
    helpers.sectionize($, 1, children, newChildren, 0);

    // insert new children in old children
    $.root()[0].childNodes = newChildren;

    // convert into string
    var str = $.html();

    // return a pretty version
    return beautify(str, {
      "indent-char" : " ",
      "indent_size": 2,
      "wrap-line-length" : 0
    });
  }
};

module.exports = helpers;
