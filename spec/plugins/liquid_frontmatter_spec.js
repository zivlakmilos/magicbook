describe("Liquid and frontmatter plugins", function() {

  describe("When enabled by default", function() {

    it("should retrieve frontmatter from file and pass to liquid", function(done) {
      var uid = triggerBuild({
        enabledFormats: ["html"],
        success: function() {
          expect(buildPath(uid, "html/first-chapter.html")).toHaveContent("Frontmatter test is working");
          done();
        }
      });
    });

  });

});
