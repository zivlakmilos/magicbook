describe("Plugin disabling", function() {

  it('should enable native plugins by default', function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      disablePlugins: [],
      finish: function() {
        expect(buildPath(uid, "build1/first-chapter.html")).toHaveContent("<math>")
        expect(buildPath(uid, "build1/first-chapter.html")).not.toHaveContent("$$")
        done();
      }
    });
  });

  it("should disable plugins via disablePlugins", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      disablePlugins: ['katex'],
      finish: function() {
        expect(buildPath(uid, "build1/first-chapter.html")).not.toHaveContent("<math>")
        expect(buildPath(uid, "build1/first-chapter.html")).toHaveContent("$$")
        done();
      }
    });
  });

});
