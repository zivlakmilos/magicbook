var _ = require('lodash');
var rimraf = require('rimraf');

beforeAll(function(done) {
  rimraf("spec/support/book/tmp/*", function() {
    done();
  });
});

describe("Files", function() {

  describe("with leading numbers", function() {

    it("should remove leading numbers, - and _ in filenames and folders", function(done) {
      var uid = triggerBuild({
        files: [
          "spec/support/book/content/00_01-my-filename.md",
          "spec/support/book/content/**/00-10-my-other-filename.md",
        ],
        builds: [{
          format: "html"
        }],
        finish: function() {
          expect(buildPath(uid, "build1/00_01-my-filename.html")).not.toExist();
          expect(buildPath(uid, "build1/my-filename.html")).toExist();
          expect(buildPath(uid, "build1/00-01_my-chapter/00-10-my-other-filename.html")).not.toExist();
          expect(buildPath(uid, "build1/my-chapter/my-other-filename.html")).toExist();
          done();
        }
      });
    });

  });

});
