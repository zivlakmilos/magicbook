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

    it("should use custom stylesheets destination folder", function(done) {
      var uid = triggerBuild({
        enabledFormats: ["html"],
        stylesheets: {
          destination: "myassets/css",
          files: [
            "spec/support/book/stylesheets/styles.css",
          ]
        },
        success: function() {
          expect(buildPath(uid, "html/myassets/css/styles.css")).toExist();
          done();
        }
      });
    });

    it("should compress stylesheets", function(done) {
      var uid = triggerBuild({
        enabledFormats: ["html"],
        stylesheets: {
          compress: true,
          files: [
            "spec/support/book/stylesheets/styles.css",
          ]
        },
        success: function() {
          expect(buildPath(uid, "html/assets/styles.css")).toHaveContent("color:green");
          done();
        }
      });
    });

    it("should digest stylesheets", function(done) {
      var uid = triggerBuild({
        enabledFormats: ["html"],
        stylesheets: {
          digest: true,
          files: [
            "spec/support/book/stylesheets/styles.css",
          ]
        },
        success: function() {
          expect(buildPath(uid, "html/assets/styles-b71c3f4f5d.css")).toExist();
          done();
        }
      });
    });

    it("should bundle stylesheets", function(done) {
      var uid = triggerBuild({
        enabledFormats: ["html"],
        stylesheets: {
          bundle: true,
          files: [
            "spec/support/book/stylesheets/styles.css",
            "spec/support/book/stylesheets/otherstyles.scss"
          ]
        },
        success: function() {
          console.log(uid)
          expect(buildPath(uid, "html/assets/bundle.css")).toHaveContent("color: red;");
          expect(buildPath(uid, "html/assets/bundle.css")).toHaveContent("color: green;");
          done();
        }
      });
    });

    // it("should use stylesheets destination folder")
    //
    // it("should insert the stylesheets in the layout")

  });

});
