describe("Liquid plugin", function() {

  describe("Includes", function() {

    it("should use includes config", function(done) {
      var uid = triggerBuild({
        files: "spec/support/book/content/liquid.md",
        liquid: {
          includes: "spec/support/book/includes"
        },
        builds: [{ format: "html" }],
        finish: function() {
          expect(buildPath(uid, "build1/liquid.html")).toHaveContent("Include working");
          done();
        }
      });
    });

    it("should prioritize format includes config", function(done) {
      var uid = triggerBuild({
        files: "spec/support/book/content/liquid.md",
        liquid: {
          includes: "spec/support/book/includes"
        },
        builds: [{
          format: "html",
          liquid: {
            includes: "spec/support/book/includes/otherfolder"
          }
        }],
        finish: function() {
          expect(buildPath(uid, "build1/liquid.html")).toHaveContent("Other include working");
          done();
        }
      });
    });
  });
});
