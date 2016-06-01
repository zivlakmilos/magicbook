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

  it('should use permalink from config', function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      permalink : "permafolder/permafile.html",
      files: "spec/support/book/content/permalinks.md",
      finish: function() {
        expect(buildPath(uid, "build1/permafolder/permafile.html")).not.toExist();
        expect(buildPath(uid, "build1/frontmatterpermafolder/frontmatterpermafile.html")).toExist();
        done();
      }
    });
  });

  // it('should prioritize permalink from frontmatter');
  // it('should use :title')
  // it('should use :parts')
});

// navigation plugin?
// should use permalink address for links
