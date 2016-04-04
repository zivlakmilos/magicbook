var _ = require('lodash');
var rimraf = require('rimraf');

beforeAll(function(done) {
  rimraf("spec/support/book/tmp/*", function() {
    done();
  });
});

describe("All Formats", function() {

  describe("Destination", function() {

    it("should prioritize format destination", function(done) {
      var uid = triggerBuild({
        builds: [{
          format: "html",
          destination: "spec/support/book/tmp/abcdef/myhtml"
        }],
        finish: function() {
          expect(buildPath('abcdef', "myhtml/first-chapter.html")).toHaveContent("First Heading</h1>");
          done();
        }
      });
    });

  });

});
