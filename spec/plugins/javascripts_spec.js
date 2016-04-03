describe("JavaScripts plugin", function() {

  it("should automatically apply browserify on modules?????");

  it("should move JS and module JS to assets folder", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      javascripts: {
        files: [
          "spec/support/book/javascripts/scripts.js",
          "spec/support/book/javascripts/modulescripts.js",
        ]
      },
      finish: function() {
        expect(buildPath(uid, "build1/assets/scripts.js")).toHaveContent("console.log('scripts')");
        expect(buildPath(uid, "build1/assets/modulescripts.js")).toHaveContent("console.log('modulescripts')");
        done();
      }
    });
  });

  it("should use custom javascripts destination folder", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      javascripts: {
        destination: "myassets/js",
        files: [
          "spec/support/book/javascripts/scripts.js",
        ]
      },
      finish: function() {
        expect(buildPath(uid, "build1/myassets/js/scripts.js")).toExist();
        done();
      }
    });
  });

  it("should compress javascripts", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      javascripts: {
        compress: true,
        files: [
          "spec/support/book/javascripts/scripts.js",
        ]
      },
      finish: function() {
        expect(buildPath(uid, "build1/assets/scripts.js")).toHaveContent(");var");
        done();
      }
    });
  });

  it("should digest javascripts", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      javascripts: {
        digest: true,
        files: [
          "spec/support/book/javascripts/scripts.js",
        ]
      },
      finish: function() {
        expect(buildPath(uid, "build1/assets/scripts-b71c3f4f5d.css")).toExist();
        done();
      }
    });
  });

  // it("should bundle javascripts with default name", function(done) {
  //   var uid = triggerBuild({
  //     builds: [{ format: "html" }],
  //     javascripts: {
  //       bundle: true,
  //       files: [
  //         "spec/support/book/javascripts/scripts.js",
  //         "spec/support/book/javascripts/otherstyles.scss"
  //       ]
  //     },
  //     finish: function() {
  //       expect(buildPath(uid, "build1/assets/bundle.css")).toHaveContent("color: red;");
  //       expect(buildPath(uid, "build1/assets/bundle.css")).toHaveContent("color: green;");
  //       done();
  //     }
  //   });
  // });
  //
  // it("should bundle javascripts with custom name", function(done) {
  //   var uid = triggerBuild({
  //     builds: [{ format: "html" }],
  //     javascripts: {
  //       bundle: "mybundle.css",
  //       files: [
  //         "spec/support/book/javascripts/scripts.js",
  //         "spec/support/book/javascripts/otherstyles.scss"
  //       ]
  //     },
  //     finish: function() {
  //       expect(buildPath(uid, "build1/assets/mybundle.css")).toExist();
  //       done();
  //     }
  //   });
  // });
  //
  // it("should insert javascripts in layout", function(done) {
  //   var uid = triggerBuild({
  //     builds: [{ format: "html" }],
  //     layout: "spec/support/book/layouts/assets.html",
  //     javascripts: {
  //       files: [
  //         "spec/support/book/javascripts/scripts.js",
  //         "spec/support/book/javascripts/otherstyles.scss"
  //       ]
  //     },
  //     finish: function() {
  //       expect(buildPath(uid, "build1/first-chapter.html")).toHaveContent("<link rel=\"stylesheet\" href=\"assets/scripts.js\">");
  //       expect(buildPath(uid, "build1/first-chapter.html")).toHaveContent("<link rel=\"stylesheet\" href=\"assets/otherscripts.js\">");
  //       done();
  //     }
  //   });
  // });

});
