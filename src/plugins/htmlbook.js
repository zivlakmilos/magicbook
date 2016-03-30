var parse5 = require('parse5');
var dom = parse5.treeAdapters.default;
var _ = require('lodash');
var pretty = require('html');

var Plugin = function(){};

var headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
var newHeadings = ['h1', 'h1', 'h2', 'h3', 'h4', 'h5'];
var sections = ['chapter', 'sect1', 'sect2', 'sect3', 'sect4', 'sect5'];

Plugin.prototype = {

  convertFragment : function(html) {

    var doc = parse5.parseFragment('<div>' + html + '</div>');
    var children = doc.childNodes[0].childNodes;
    var newChildren = [];

    // a function that searches nodes for a certain
    // heading level, and creates subsections when it encounters
    // sub levels
    function sectionize(level, nodes, newNodes, i) {

      // start iterating nodes from i
      while(i < nodes.length) {

        // if this is heading
        var headingIndex = headings.indexOf(nodes[i].nodeName);
        if(headingIndex > -1) {

          // if this is a heading of the level we're looking for
          if(headingIndex == level-1) {

            // create new subsection
            var subsection = dom.createElement('section', null, [{ name: "data-type", value: sections[headingIndex] }]);

            // change the heading to the htmlbook heading,
            // and add it to the subsection.
            nodes[i].tagName = newHeadings[headingIndex];
            nodes[i].nodeName = newHeadings[headingIndex];
            subsection.childNodes.push(nodes[i]);

            // add the subsection to the newNodes
            newNodes.push(subsection);

            // sectionize nodes following this heading, adding them to subsection
            i = sectionize(level+1, nodes, subsection.childNodes, i+1)
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
    }

    // recursively traverse the HTML doc
    sectionize(1, children, newChildren, 0);

    // insert new children in old children
    doc.childNodes[0].childNodes = newChildren;

    // convert into string
    var str = parse5.serialize(doc);

    // remove div from string
    str = str.substring(5, str.length-6);

    // return a pretty version
    return pretty.prettyPrint(str);
  }

}

module.exports = Plugin;
