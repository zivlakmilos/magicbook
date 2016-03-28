describe("Liquid plugin", function() {

  describe("Includes", function() {

    it("should use includes config", function(done) {
      var uid = triggerBuild({
        files: "spec/support/book/content/liquid.md",
        liquid: {
          includes: "spec/support/book/includes"
        },
        enabledFormats: ["html"],
        finish: function() {
          expect(buildPath(uid, "html/liquid.html")).toHaveContent("Include working");
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
        formats: {
          html: {
            liquid: {
              includes: "spec/support/book/includes/otherfolder"
            }
          }
        },
        enabledFormats: ["html"],
        finish: function() {
          expect(buildPath(uid, "html/liquid.html")).toHaveContent("Other include working");
          done();
        }
      });
    });
  });
});
