var tinyliquid = require('tinyliquid');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var async = require('async');

var helpers = {

  // Get build destination for a single format
  // Returns: string
  destination: function(dest, format) {
    return dest.replace(":format", format);
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

  // Instantiates all formatPlugins if they exist in requiredPlugins
  instantiatePlugins: function(requiredPlugins, formatPlugins) {
    var instances = {};
    _.each(formatPlugins, function(plugin) {
      if(requiredPlugins[plugin]) {
        instances[plugin] = new requiredPlugins[plugin]();
      }
    });
    return instances;
  },

  // This function takes the name of a function and calls
  // that function for all the plugins, in series after each other.
  // It then ends by calling cb(). It expects the last argument
  // of these plugin functions to be a cb that is called when the
  // function is done.
  callPluginFunctionsAsync: function(fnc, plugins, args, cb) {

    var chain = [];

    // loop through plugins hash
    _.each(plugins, function(instance, name) {

      // if the plugin has this function
      if(_.isFunction(instance[fnc])) {

        // create an synch chain function
        chain.push(function(callback) {
          instance[fnc].apply(this, args.concat(callback));
        })

      }

    });

    // make async fire of the chain in a series.
    async.series(chain, function(err, results) {
      if(cb) {
        cb();
      }
    });
  }

};

module.exports = helpers;
