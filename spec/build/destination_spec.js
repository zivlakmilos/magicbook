

describe("Destination", function() {

  it("should prioritize format destination", function(done) {
    var uid = triggerBuild({
      builds: [{
        format: "html",
        destination: "spec/support/book/tmp/abcdef/myhtml"
      }],
      finish: function() {
        expect(buildPath('abcdef', "myhtml/first-chapter.html")).toExist();
        done();
      }
    });
  });

  describe("Globs", function() {

    it("should use folders from glob file.relative", function(done) {
      var uid = triggerBuild({
        files: [
          "spec/support/book/content/first-chapter.md",
          "spec/support/book/content/**/subfolder-file.md"
        ],
        builds: [{ format: "html" }],
        finish: function() {
          expect(buildPath(uid, "build1/first-chapter.html")).toExist();
          expect(buildPath(uid, "build1/subfolder/subfolder-file.html")).toExist();
          done();
        }
      });
    });

  });

});
