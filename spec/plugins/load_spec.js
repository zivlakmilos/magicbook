describe('Load plugin', function() {

  describe("Parts", function() {

    it("should load files from part tree", function(done) {
      var uid = triggerBuild({
        files: partTree,
        liquid: {
          includes: "spec/support/book/includes",
        },
        builds: [{ format: "html" }],
        finish: function() {
          expect(buildPath(uid, "build1/toc.html")).toExist();
          expect(buildPath(uid, "build1/first-chapter.html")).toExist();
          expect(buildPath(uid, "build1/second-chapter.html")).toExist();
          expect(buildPath(uid, "build1/subfolder-file.html")).toExist();
          expect(buildPath(uid, "build1/third-chapter.html")).toExist();
          expect(buildPath(uid, "build1/sections.html")).toExist();
          done();
        }
      });
    });

  });

});
