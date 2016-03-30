describe("Katex plugin", function() {

  it("should convert $$ to katex", function(done) {
    var uid = triggerBuild({
      enabledFormats: ["html"],
      plugins: [ 'katex', 'html' ],
      finish: function() {
        expect(buildPath(uid, "html/first-chapter.html")).toHaveContent("<math>")
        expect(buildPath(uid, "html/first-chapter.html")).not.toHaveContent("$$")
        done();
      }
    });
  });

  it("should include katex.css in the stylesheets", function(done) {
    var uid = triggerBuild({
      enabledFormats: ["html"],
      plugins: [ 'katex', 'stylesheets' ],
      finish: function() {
        expect(buildPath(uid, "html/assets/katex.css")).toHaveContent("KaTeX_Main");
        done();
      }
    });
  });

  it("should add data-type equation to mathml")

});
