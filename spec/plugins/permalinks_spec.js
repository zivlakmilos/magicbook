describe("Permalinks", function() {

  it('should default to glob', function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      files: "spec/support/book/content/**/subfolder-file.md",
      finish: function() {
        expect(buildPath(uid, "build1/subfolder/subfolder-file.html")).toExist();
        done();
      }
    });
  });
  // it('should use permalink from settings');
  // it('should use permalink from frontmatter');
});

// navigation plugin?
// should use permalink address for links
