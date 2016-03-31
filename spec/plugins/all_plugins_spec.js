describe("All plugins", function() {

  // Using the katex plugin here, as it's easy to test

  it('should enable native plugins by default', function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      finish: function() {
        expect(buildPath(uid, "build1/first-chapter.html")).toHaveContent("<math>")
        expect(buildPath(uid, "build1/first-chapter.html")).not.toHaveContent("$$")
        done();
      }
    });
  });

  it("should remove plugins via removePlugins", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      removePlugins: ['katex'],
      finish: function() {
        expect(buildPath(uid, "build1/first-chapter.html")).not.toHaveContent("<math>")
        expect(buildPath(uid, "build1/first-chapter.html")).toHaveContent("$$")
        done();
      }
    });
  });

  it('should add plugins via addPlugins')

});
