describe("Math plugin", function() {

  describe("When disabled", function() {

    it("should not convert $$ to katex", function(done) {
      var uid = triggerBuild({
        enabledFormats: ["html"],
        success: function() {
          expect(buildContent(uid, "html/first-chapter.html")).toMatch("\\$\\$")
          expect(buildContent(uid, "html/first-chapter.html")).not.toMatch("<math>")
          done();
        }
      });
    });

  });

  describe("When enabled", function() {

    it("should convert $$ to katex", function(done) {
      var uid = triggerBuild({
        enabledFormats: ["html"],
        plugins: [ 'katex' ],
        success: function() {
          expect(buildContent(uid, "html/first-chapter.html")).toMatch("<math>")
          expect(buildContent(uid, "html/first-chapter.html")).not.toMatch("\\$\\$")
          done();
        }
      });
    });

    it("should include katex.css in HTML", function(done) {
      var uid = triggerBuild({
        enabledFormats: ["html"],
        plugins: [ 'katex' ],
        success: function() {
          expect(buildContent(uid, "html/assets/katex.css")).toMatch("KaTeX_Main")
          done();
        }
      });
    });

    it("PDF?");
    it("EPUB?");
    it("MOBI?");
  });

});
