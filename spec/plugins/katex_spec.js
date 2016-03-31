describe("Katex plugin", function() {

  it("should convert $$ to katex", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      finish: function() {
        expect(buildPath(uid, "build1/first-chapter.html")).toHaveContent("<math>")
        expect(buildPath(uid, "build1/first-chapter.html")).not.toHaveContent("$$")
        done();
      }
    });
  });

  it("should include katex.css in the stylesheets", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      finish: function() {
        expect(buildPath(uid, "build1/assets/katex.css")).toHaveContent("KaTeX_Main");
        done();
      }
    });
  });

  it("should add data-type equation to mathml")

});
