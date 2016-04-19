describe("Codesplit plugin", function() {

  it("should split code and comments", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      addPlugins: ["codesplit"],
      files: [
        'spec/support/book/content/codesplit.md'
      ],
      codesplit: {
        includes: "spec/support/book/examples"
      },
      finish: function() {
        console.log(buildContent(uid, 'build1/codesplit.html'))
        //expect(buildPath(uid, "build1/assets/KaTeX_AMS-Regular.ttf")).toExist();
        //expect(buildPath(uid, "build1/assets/KaTeX_Caligraphic-Bold.eot")).toExist();
        //expect(buildPath(uid, "build1/assets/subfolder/KaTeX_Fraktur-Bold.ttf")).toExist();
        done();
      }
    });
  });

});
