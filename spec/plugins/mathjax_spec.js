describe("Math plugin", function() {

  describe("When disabled", function() {

    it("should not convert $$ to mathjax", function(done) {
      var uid = triggerBuild({
        success: function() {
          expect(buildContent(uid, "html/first-chapter.html")).toMatch("\\$\\$")
          expect(buildContent(uid, "html/first-chapter.html")).not.toMatch("<math>")
          done();
        }
      });
    });

  });

  describe("When enabled", function() {

    it("should convert $$ to mathjax", function(done) {
      var uid = triggerBuild({
        plugins: [ 'mathjax' ],
        success: function() {
          expect(buildContent(uid, "html/first-chapter.html")).toMatch("<math>")
          expect(buildContent(uid, "html/first-chapter.html")).not.toMatch("\\$\\$")
          done();
        }
      });
    });

    it("should include mathjax.js in HTML")
    it("PDF?")
    it("EPUB?")
    it("MOBI?")
  });

});
