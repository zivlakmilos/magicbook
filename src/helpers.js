module.exports = {

  // Get build destination for a single format
  // Returns: string
  destination: function(dest, format) {
    console.log(dest.replace(":format", format))
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
  }

};
