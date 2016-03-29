describe("Stylesheets plugin", function() {

  it("should move CSS and compiled SCSS to assets folder", function(done) {
    var uid = triggerBuild({
      enabledFormats: ["html"],
      stylesheets: {
        files: [
          "spec/support/book/stylesheets/styles.css",
          "spec/support/book/stylesheets/otherstyles.scss",
        ]
      },
      finish: function() {
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
      finish: function() {
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
      finish: function() {
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
      finish: function() {
        expect(buildPath(uid, "html/assets/styles-b71c3f4f5d.css")).toExist();
        done();
      }
    });
  });

  it("should bundle stylesheets with default name", function(done) {
    var uid = triggerBuild({
      enabledFormats: ["html"],
      stylesheets: {
        bundle: true,
        files: [
          "spec/support/book/stylesheets/styles.css",
          "spec/support/book/stylesheets/otherstyles.scss"
        ]
      },
      finish: function() {
        expect(buildPath(uid, "html/assets/bundle.css")).toHaveContent("color: red;");
        expect(buildPath(uid, "html/assets/bundle.css")).toHaveContent("color: green;");
        done();
      }
    });
  });

  it("should bundle stylesheets with custom name", function(done) {
    var uid = triggerBuild({
      enabledFormats: ["html"],
      stylesheets: {
        bundle: "mybundle.css",
        files: [
          "spec/support/book/stylesheets/styles.css",
          "spec/support/book/stylesheets/otherstyles.scss"
        ]
      },
      finish: function() {
        expect(buildPath(uid, "html/assets/mybundle.css")).toExist();
        done();
      }
    });
  });

  it("should insert stylesheets in layout", function(done) {
    var uid = triggerBuild({
      enabledFormats: ["html"],
      layout: "spec/support/book/layouts/assets.html",
      stylesheets: {
        files: [
          "spec/support/book/stylesheets/styles.css",
          "spec/support/book/stylesheets/otherstyles.scss"
        ]
      },
      finish: function() {
        expect(buildPath(uid, "html/first-chapter.html")).toHaveContent("<link rel=\"stylesheet\" href=\"assets/styles.css\">");
        expect(buildPath(uid, "html/first-chapter.html")).toHaveContent("<link rel=\"stylesheet\" href=\"assets/otherstyles.css\">");
        done();
      }
    });
  });

});
