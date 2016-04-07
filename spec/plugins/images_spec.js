var cheerio = require('cheerio');

describe("Images plugin", function() {

  describe("Settings", function() {

    it("should use source", function(done) {
      var uid = triggerBuild({
        builds: [{ format: "html" }],
        images: {
          files: ["spec/support/book/images/**/*.*"]
        },
        finish: function() {
          expect(buildPath(uid, "build1/assets/bruce.jpg")).toExist();
          expect(buildPath(uid, "build1/assets/subfolder/bruce.png")).toExist();
          done();
        }
      });
    });

    it("should use destination", function(done) {
      var uid = triggerBuild({
        builds: [{ format: "html" }],
        images: {
          files: ["spec/support/book/images/**/*.*"],
          destination: "myassets/images"
        },
        finish: function() {
          expect(buildPath(uid, "build1/myassets/images/bruce.jpg")).toExist();
          expect(buildPath(uid, "build1/myassets/images/subfolder/bruce.png")).toExist();
          done();
        }
      });
    });

    it("should prioritize build destination", function(done) {
      var uid = triggerBuild({
        builds: [{
          format: "html",
          images: {
            destination: "myassets/images"
          }
        }],
        images: {
          files: ["spec/support/book/images/**/*.*"],
          destination: "NONONO"
        },
        finish: function() {
          expect(buildPath(uid, "build1/myassets/images/bruce.jpg")).toExist();
          expect(buildPath(uid, "build1/myassets/images/subfolder/bruce.png")).toExist();
          done();
        }
      });
    });
  });

  describe("Replacing image src", function() {

    it("should replace src when found in images folder", function(done) {
      var uid = triggerBuild({
        files: "spec/support/book/content/images.md",
        builds: [{ format: "html" }],
        images: {
          files: ["spec/support/book/images/**/*.*"]
        },
        finish: function() {
          var content = buildContent(uid, "build1/images.html").toString();
          var $ = cheerio.load(content);
          expect($('img').eq(0).attr('src')).toEqual("assets/bruce.jpg");
          expect($('img').eq(1).attr('src')).toEqual("assets/subfolder/bruce.png");
          done();
        }
      });
    });

    it("should work with files in subfolders", function(done) {
      var uid = triggerBuild({
        files: "spec/support/book/**/images.md",
        builds: [{ format: "html" }],
        images: {
          files: ["spec/support/book/images/**/*.*"]
        },
        finish: function() {
          var content = buildContent(uid, "build1/content/images.html").toString();
          var $ = cheerio.load(content);
          expect($('img').eq(0).attr('src')).toEqual("../assets/bruce.jpg");
          expect($('img').eq(1).attr('src')).toEqual("../assets/subfolder/bruce.png");
          done();
        }
      });
    });

    it("should not replace src when not found in images folder", function(done) {
      var uid = triggerBuild({
        files: "spec/support/book/content/images.md",
        builds: [{ format: "html" }],
        images: {
          files: ["spec/support/book/images/**/*.*"]
        },
        finish: function() {
          expect(buildPath(uid, "build1/images.html")).toHaveContent("some/random/image.jpg");
          done();
        }
      });
    });

    it("should not replace src in images with http", function(done) {
      var uid = triggerBuild({
        files: "spec/support/book/content/images.md",
        builds: [{ format: "html" }],
        images: {
          files: ["spec/support/book/images/**/*.*"]
        },
        finish: function() {
          expect(buildPath(uid, "build1/images.html")).toHaveContent("http://www.runemadsen.com/image.jpg");
          done();
        }
      });
    });
  });

  describe("Digest", function() {

    it("should add digest to filename", function(done) {
      var uid = triggerBuild({
        files: "spec/support/book/content/images.md",
        builds: [{ format: "html" }],
        images: {
          files: ["spec/support/book/images/**/*.*"],
          digest: true
        },
        finish: function() {
          expect(buildPath(uid, "build1/assets/bruce.jpg")).not.toExist();
          expect(buildPath(uid, "build1/assets/bruce-d83101cb2d.jpg")).toExist();
          done();
        }
      });
    });

    it("should replace src with digested name", function(done) {
      var uid = triggerBuild({
        files: "spec/support/book/content/images.md",
        builds: [{ format: "html" }],
        images: {
          files: ["spec/support/book/images/**/*.*"],
          digest: true
        },
        finish: function() {
          expect(buildPath(uid, "build1/images.html")).not.toHaveContent("assets/bruce.jpg");
          expect(buildPath(uid, "build1/images.html")).toHaveContent("assets/bruce-d83101cb2d.jpg");
          done();
        }
      });
    });

  });

});
