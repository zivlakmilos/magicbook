var _ = require('lodash');
var fs = require('fs');
var async = require('async');

var helpers = {

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
  }

};

module.exports = helpers;
