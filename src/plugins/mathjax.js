module.exports = {

  // all of them gets passed the format, so it
  // knows whether to do something or not.

  hooks: {

    init: function(md) {
      md.use(require('markdown-it-math'));
    }

    // preMarkdown

    // postMarkdown

    // a way to add extra output files in some formats, like mathjac support
    // in the web versions. This will also require the ability to add extra
    // file to the scss bundle


  }

}
