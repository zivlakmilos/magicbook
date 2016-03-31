var tinyliquid = require('tinyliquid');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var async = require('async');
var beautify = require('js-beautify').html;
var parse5 = require('parse5');
var dom = parse5.treeAdapters.default;

var headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
var newHeadings = ['h1', 'h1', 'h2', 'h3', 'h4', 'h5'];
var sections = ['chapter', 'sect1', 'sect2', 'sect3', 'sect4', 'sect5'];

var helpers = {

  // Get build destination for a single format
  // Returns: string
  destination: function(dest, buildNumber) {
    return dest.replace(":build", 'build' + buildNumber);
  },

  // Check whether a vinyl file is a markdown file
  // Returns: boolean
  isMarkdown: function(file) {
    return file.path.match(/\.md$/) || file.path.match(/\.markdown$/);
  },

  // Check whether a vinyl file is a scss file
  // Returns: boolean
  isScss: function(file) {
    return file.path.match(/\.scss$/);
  },

  // Renders locals into a liquid template. Takes care of functionality
  // shared between the liquid plugin and the main layout liquid rendering.
  renderLiquidTemplate: function(template, locals, file, config, cb) {

    // assemble variables to pass into the file
    var context = tinyliquid.newContext({ locals: locals });

    // set includes
    var templatePath = _.get(file, "config.liquid.includes") || config.liquid.includes;
    context.onInclude(function (name, callback) {
      fs.readFile(path.join(templatePath, name), function(err, text) {
        if (err) return callback(new Error('Liquid include template not found: ' + err));
        var ast = tinyliquid.parse(text.toString());
        callback(null, ast);
      });
    });

    // render
    template(context, function(err) {
      file.contents = new Buffer(context.getBuffer());
      cb(err, file);
    });

  },

  createFile: function(filename, content, cb) {
    mkdirp(path.dirname(filename), function(err) {
      if(err) return console.log("Error creating folder", err);
      fs.writeFile(filename, content, function(e) {
        if(e) return console.log("Error creating file", e);
        cb();
      });
    });
  },

  // Requires and caches files in cachedFiles with the requireFile
  // function. See below.
  requireFiles: function(filesCache, neededFiles, localFolder, verbose) {

    // loop through each of the required plugins
    _.each(neededFiles, function(file) {

      // if this file has not been required yet
      if(!filesCache[file]) {

        // require it and save to cache
        filesCache[file] = helpers.requireFile(file, localFolder, verbose);
      }
    });

    return filesCache;
  },

  // This function can be used to require a file or NPM packages by
  // name. It first searches through the folder specified in localFolder,
  // then searches the book repo for the file, and then tries to require
  // as NPM package.
  requireFile: function(file, localFolder, verbose) {

    var loadedFile;

    // try to load the file as a local file
    try { loadedFile = require(path.join(__dirname, localFolder, file)); }
      catch (e1) {
        if(e1 instanceof SyntaxError) {
          if(verbose) console.log("Plugin file: " + file + " has syntax errors. " + e1.toString());
        } else {
          // try to load the file as a file in the book
          try { loadedFile = require(path.join(process.cwd(), file)); } catch(e2) {
            if(e2 instanceof SyntaxError) {
              if(verbose) console.log("Plugin file: " + file + " has syntax errors. " + e2.toString());
            } else {
              // try to load the file as a node package
              try { loadedFile = require(file); } catch(e3) {
                if(e3 instanceof SyntaxError) {
                  if(verbose) console.log("Plugin file: " + file + " has syntax errors. " + e3.toString());
                } else {
                  if(verbose) console.log("Required file: " + file + " cannot be found");
                }
              }
            }
          }
        }

    }

    return loadedFile;
  },

  // Instantiates all formatPlugins if they exist in pluginsCache
  instantiatePlugins: function(pluginsCache, formatPlugins) {
    var instances = {};
    _.each(formatPlugins, function(plugin) {
      if(pluginsCache[plugin]) {
        instances[plugin] = new pluginsCache[plugin]();
      }
    });
    return instances;
  },

  // This function takes the name of a hook function and calls
  // that function for all the plugins, in series after each other,
  // passing the arguments from the one function to the next.
  // It then ends by calling cb().
  callHook: function(hook, plugins, args, cb) {

    // make an array of functions, starting with a function
    // passing args into the next function.
    var chain = [];

    // loop through plugins hash, if plugin has this function,
    // add to waterfall chain of functions to be called after each other,
    // receving args from the previous function.
    _.each(plugins, function(instance, name) {
      if(_.get(instance, "hooks." + hook) && _.isFunction(instance.hooks[hook])) {
        chain.push(instance.hooks[hook])
      }
    });

    // if we have any functions
    if(chain.length > 0) {

      // first function should pass arguments in with the first
      // arguments being no errors.
      chain.unshift(function(callback) {
        args.unshift(null);
        callback.apply(this, args);
      });

      // call functions in a waterfall. When all functions
      // have been called, call cb with arguments to function.
      async.waterfall(chain, function(err, a1, a2, a3, a4) {
        if(cb) {
          cb(a1, a2, a3, a4)
        }
      });
    } else {
      cb.apply(this, args);
    }


  },

  // Function to add plugin hooks as pipes in the stream chain.
  pipePluginHook: function(stream, plugins, name, format, config, payload) {

    // loop through each of plugins
    _.each(plugins, function(plugin) {

      // if the plugin has this hook
      if(_.get(plugin, "hooks." + name)) {

        // create a new pipe with the plugin hook function. This means that the
        // plugin hook must return a through2 object.
        stream = stream.pipe(plugin.hooks[name].apply(this, [format, config, payload || {}]));
      }
    });

    return stream;
  },

  // Function to make HTMLBook sections from heading hierachy in a markdown-it
  // converted file
  sectionify: function(html) {

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
    return beautify(str, {
      "indent-char" : " ",
      "indent_size": 2,
      "wrap-line-length" : 0
    });
  }

};

module.exports = helpers;
