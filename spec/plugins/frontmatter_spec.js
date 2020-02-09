describe("Frontmatter plugin", function() {
  it("should retrieve frontmatter from file and pass to liquid", function(done) {
    var uid = triggerBuild({
      files: "spec/support/book/content/frontmatter.md",
      builds: [{ format: "html" }],
      finish: function() {
        expect(buildPath(uid, "build1/frontmatter.html")).toHaveContent(
          "Frontmatter test is working"
        );
        done();
      }
    });
  });

  it("should use layout specified in frontmatter", function(done) {
    var uid = triggerBuild({
      files: "spec/support/book/content/frontmatter.md",
      builds: [{ format: "html" }],
      finish: function() {
        expect(buildPath(uid, "build1/frontmatter.html")).toHaveContent(
          "Frontmatter layout"
        );
        done();
      }
    });
  });

  it("should disable layout if set to none in frontmatter", function(done) {
    var uid = triggerBuild({
      files: "spec/support/book/content/frontmatter2.md",
      layout: "spec/support/book/layouts/main.html",
      builds: [{ format: "html" }],
      finish: function() {
        const content = buildContent(
          uid,
          "build1/frontmatter2.html"
        ).toString();
        expect(buildPath(uid, "build1/frontmatter2.html")).not.toHaveContent(
          "Main layout"
        );
        done();
      }
    });
  });
});
