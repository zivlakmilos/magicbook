describe("Fonts plugin", function() {

  it("should move font files to assets folder", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      fonts: {
        files: "spec/support/book/fonts/**/*.*"
      },
      finish: function() {
        expect(buildPath(uid, "build1/assets/KaTeX_AMS-Regular.ttf")).toExist();
        expect(buildPath(uid, "build1/assets/KaTeX_Caligraphic-Bold.eot")).toExist();
        expect(buildPath(uid, "build1/assets/subfolder/KaTeX_Fraktur-Bold.ttf")).toExist();
        done();
      }
    });
  });

  it("should use custom fonts destination folder", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      fonts: {
        destination: "myassets/fonts",
        files: "spec/support/book/fonts/**/*.*"
      },
      finish: function() {
        expect(buildPath(uid, "build1/myassets/fonts/KaTeX_AMS-Regular.ttf")).toExist();
        done();
      }
    });
  });

});
