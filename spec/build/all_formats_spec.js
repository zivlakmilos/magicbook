var _ = require('lodash');
var rimraf = require('rimraf');

beforeAll(function(done) {
  rimraf("spec/support/book/tmp/*", function() {
    done();
  });
});

describe("All Formats", function() {

  describe("Markdown", function() {

    it("should convert markdown files", function(done) {
      var uid = triggerBuild({
        builds: [{ format: "html" }],
        finish: function() {
          expect(buildPath(uid, "build1/first-chapter.html")).toHaveContent("First Heading</h1>");
          done();
        }
      });
    });

    it("should make HTMLBook sections from heading hierarchy", function(done) {
      var uid = triggerBuild({
        files: "spec/support/book/content/htmlbook.md",
        builds: [{ format: "html" }],
        finish: function() {
          expect(buildContent(uid, "build1/htmlbook.html")).toDiffLines(fileContent("spec/support/fixtures/htmlbook.html"));
          done();
        }
      });
    });

  });

  describe("Layout", function() {

    it("should ignore layout", function(done) {
      var uid = triggerBuild({
        builds: [{ format: "html" }],
        finish: function() {
          expect(buildPath(uid, "build1/first-chapter.html")).not.toHaveContent("Main layout");
          expect(buildPath(uid, "build1/first-chapter.html")).toHaveContent("First Heading</h1>");
          expect(buildPath(uid, "build1/second-chapter.html")).not.toHaveContent("Main layout");
          expect(buildPath(uid, "build1/second-chapter.html")).toHaveContent("Second Heading</h1>");
          done();
        }
      });
    });

    it("should use main layout", function(done) {
      var uid = triggerBuild({
        builds: [{ format: "html" }],
        layout: "spec/support/book/layouts/main.html",
        finish: function() {
          expect(buildPath(uid, "build1/first-chapter.html")).toHaveContent("Main layout");
          expect(buildPath(uid, "build1/first-chapter.html")).toHaveContent("First Heading</h1>");
          expect(buildPath(uid, "build1/second-chapter.html")).toHaveContent("Main layout");
          expect(buildPath(uid, "build1/second-chapter.html")).toHaveContent("Second Heading</h1>");
          done();
        }
      });
    });

    it("should prioritize format layout", function(done) {
      var uid = triggerBuild({
        builds: [
          {
            format: "html",
            layout: "spec/support/book/layouts/format.html"
          }
        ],
        layout: "spec/support/book/layouts/main.html",
        finish: function() {
          expect(buildPath(uid, "build1/first-chapter.html")).toHaveContent("Format layout");
          expect(buildPath(uid, "build1/first-chapter.html")).toHaveContent("First Heading</h1>");
          expect(buildPath(uid, "build1/second-chapter.html")).toHaveContent("Format layout");
          expect(buildPath(uid, "build1/second-chapter.html")).toHaveContent("Second Heading</h1>");
          done();
        }
      });
    });

    it("should should use includes", function(done) {
      var uid = triggerBuild({
        builds: [{ format: "html" }],
        liquid: {
          includes: "spec/support/book/includes"
        },
        layout: "spec/support/book/layouts/liquid.html",
        finish: function() {
          expect(buildPath(uid, "build1/first-chapter.html")).toHaveContent("Liquid layout");
          expect(buildPath(uid, "build1/first-chapter.html")).toHaveContent("Include working");
          done();
        }
      });
    });

  });

  describe("Destination", function() {

    it("should prioritize format destination", function(done) {
      var uid = triggerBuild({
        builds: [{
          format: "html",
          destination: "spec/support/book/tmp/abcdef/myhtml"
        }],
        finish: function() {
          expect(buildPath('abcdef', "myhtml/first-chapter.html")).toHaveContent("First Heading</h1>");
          done();
        }
      });
    });

  });

});
