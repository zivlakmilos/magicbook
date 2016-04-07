describe("Stylesheets plugin", function() {

  // it("should move CSS and compiled SCSS to assets folder", function(done) {
  //   var uid = triggerBuild({
  //     builds: [{ format: "html" }],
  //     stylesheets: {
  //       files: [
  //         "spec/support/book/stylesheets/styles.css",
  //         "spec/support/book/stylesheets/otherstyles.scss",
  //       ]
  //     },
  //     finish: function() {
  //       expect(buildPath(uid, "build1/assets/styles.css")).toExist();
  //       expect(buildPath(uid, "build1/assets/otherstyles.css")).toExist();
  //       done();
  //     }
  //   });
  // });
  //
  // it("should move CSS into subfolders", function(done) {
  //   var uid = triggerBuild({
  //     builds: [{ format: "html" }],
  //     stylesheets: {
  //       files: [
  //         "spec/support/book/stylesheets/**/subfolderstyles.css",
  //       ]
  //     },
  //     finish: function() {
  //       expect(buildPath(uid, "build1/assets/subfolder/subfolderstyles.css")).toExist();
  //       done();
  //     }
  //   });
  // });
  //
  // it("should use custom stylesheets destination folder", function(done) {
  //   var uid = triggerBuild({
  //     builds: [{ format: "html" }],
  //     stylesheets: {
  //       destination: "myassets/css",
  //       files: [
  //         "spec/support/book/stylesheets/styles.css",
  //       ]
  //     },
  //     finish: function() {
  //       expect(buildPath(uid, "build1/myassets/css/styles.css")).toExist();
  //       done();
  //     }
  //   });
  // });
  //
  // it("should compress stylesheets", function(done) {
  //   var uid = triggerBuild({
  //     builds: [{ format: "html" }],
  //     stylesheets: {
  //       compress: true,
  //       files: [
  //         "spec/support/book/stylesheets/styles.css",
  //       ]
  //     },
  //     finish: function() {
  //       expect(buildPath(uid, "build1/assets/styles.css")).toHaveContent("color:green");
  //       done();
  //     }
  //   });
  // });
  //
  // it("should digest stylesheets", function(done) {
  //   var uid = triggerBuild({
  //     builds: [{ format: "html" }],
  //     stylesheets: {
  //       digest: true,
  //       files: [
  //         "spec/support/book/stylesheets/styles.css",
  //       ]
  //     },
  //     finish: function() {
  //       expect(buildPath(uid, "build1/assets/styles.css")).not.toExist();
  //       expect(buildPath(uid, "build1/assets/styles-b71c3f4f5d.css")).toExist();
  //       done();
  //     }
  //   });
  // });
  //
  // it("should bundle stylesheets with default name", function(done) {
  //   var uid = triggerBuild({
  //     builds: [{ format: "html" }],
  //     stylesheets: {
  //       bundle: true,
  //       files: [
  //         "spec/support/book/stylesheets/styles.css",
  //         "spec/support/book/stylesheets/otherstyles.scss"
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
  // it("should bundle stylesheets with custom name", function(done) {
  //   var uid = triggerBuild({
  //     builds: [{ format: "html" }],
  //     stylesheets: {
  //       bundle: "mybundle.css",
  //       files: [
  //         "spec/support/book/stylesheets/styles.css",
  //         "spec/support/book/stylesheets/otherstyles.scss"
  //       ]
  //     },
  //     finish: function() {
  //       expect(buildPath(uid, "build1/assets/mybundle.css")).toExist();
  //       done();
  //     }
  //   });
  // });
  //
  // it("should insert stylesheets in layout", function(done) {
  //   var uid = triggerBuild({
  //     builds: [{ format: "html" }],
  //     layout: "spec/support/book/layouts/assets.html",
  //     stylesheets: {
  //       files: [
  //         "spec/support/book/stylesheets/styles.css",
  //         "spec/support/book/stylesheets/otherstyles.scss"
  //       ]
  //     },
  //     finish: function() {
  //       expect(buildPath(uid, "build1/first-chapter.html")).toHaveContent("<link rel=\"stylesheet\" href=\"assets/styles.css\">");
  //       expect(buildPath(uid, "build1/first-chapter.html")).toHaveContent("<link rel=\"stylesheet\" href=\"assets/otherstyles.css\">");
  //       done();
  //     }
  //   });
  // });
  //
  // it("should insert stylesheets in subfolders in layout", function(done) {
  //   var uid = triggerBuild({
  //     builds: [{ format: "html" }],
  //     files: [
  //       "spec/support/book/content/**/subfolder-file.md"
  //     ],
  //     layout: "spec/support/book/layouts/assets.html",
  //     stylesheets: {
  //       files: [
  //         "spec/support/book/stylesheets/**/subfolderstyles.css",
  //       ]
  //     },
  //     finish: function() {
  //       expect(buildPath(uid, "build1/subfolder/subfolder-file.html")).toHaveContent("<link rel=\"stylesheet\" href=\"../assets/subfolder/subfolderstyles.css\">");
  //       done();
  //     }
  //   });
  // });

  it("should apply font-path()", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      stylesheets: {
        files: [
          "spec/support/book/stylesheets/font-path.scss",
        ]
      },
      fonts: {
        source: "spec/support/book/fonts",
        destination: "myassets/fonts"
      },
      finish: function() {
        expect(buildPath(uid, "build1/assets/font-path.css")).toHaveContent("src: url('../myassets/fonts/Something.eot');");
        done();
      }
    });
  });

});
