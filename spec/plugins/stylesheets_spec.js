describe("Stylesheets plugin", function() {

  describe("When enabled by default", function() {

    it("should move CSS and compiled SCSS to assets folder", function(done) {
      var uid = triggerBuild({
        enabledFormats: ["html"],
        stylesheets: {
          files: [
            "spec/support/book/stylesheets/styles.css",
            "spec/support/book/stylesheets/otherstyles.scss",
          ]
        },
        success: function() {
          expect(buildPath(uid, "html/assets/styles.css")).toHaveContent("color: green");
          expect(buildPath(uid, "html/assets/otherstyles.css")).toHaveContent("color: red");
          done();
        }
      });
    });

    //
    // it("should compile SCSS files to regular CSS files");
    //
    // it("should insert the stylesheets in the layout")
    //
    // it("should digest")
    //
    // it("should compress")
    //
    // it("should bundle")


  });

});
