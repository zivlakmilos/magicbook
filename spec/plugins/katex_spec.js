describe("Math plugin", function() {

  describe("When disabled", function() {

    it("should not convert $$ to katex", function(done) {
      var uid = triggerBuild({
        enabledFormats: ["html"],
        success: function() {
          expect(buildPath(uid, "html/first-chapter.html")).toHaveContent("\\$\\$")
          expect(buildPath(uid, "html/first-chapter.html")).not.toHaveContent("<math>")
          done();
        }
      });
    });

  });

  describe("When enabled", function() {

    it("should convert $$ to katex", function(done) {
      var uid = triggerBuild({
        enabledFormats: ["html"],
        plugins: [ 'katex', 'stylesheets' ],
        success: function() {
          expect(buildPath(uid, "html/first-chapter.html")).toHaveContent("<math>")
          expect(buildPath(uid, "html/first-chapter.html")).not.toHaveContent("\\$\\$")
          done();
        }
      });
    });

    it("should include katex.css in stylesheets files array", function(done) {
      var uid = triggerBuild({
        enabledFormats: ["html"],
        plugins: [ 'katex' ], // SHOULD I ADD STYLESHEETS AND JAVASCRIPTS HERE???
        success: function() {
          expect(buildPath(uid, "html/assets/katex.css")).toHaveContent("KaTeX_Main");
          done();
        }
      });
    });

    it("PDF?");
    it("EPUB?");
    it("MOBI?");
  });

});
