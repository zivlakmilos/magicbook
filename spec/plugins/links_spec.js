describe("Links plugin", function() {

  describe("internal links", function() {

    it("should add filename to link in HTML", function(done) {
      var uid = triggerBuild({
        builds: [{ format: "html" }],
        finish: function() {
          expect(buildPath(uid, "build1/first-chapter.html")).toHaveContent("second-chapter.html#my-anchor");
          done();
        }
      });
    });

    it("should add not filename to link in PDF", function(done) {
      var uid = triggerBuild({
        builds: [{ format: "pdf" }],
        finish: function() {
          expect(buildPath(uid, "build1/consolidated.html")).not.toHaveContent("second-chapter.html#my-anchor");
          done();
        }
      });
    });

  });

});
