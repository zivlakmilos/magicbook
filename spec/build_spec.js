var build = require('../src/build.js');
var fs = require('fs');

function buildContent(path) {
  return fs.readFileSync("spec/support/book1/build/" + path);
}

describe("Build", function() {

  describe("Markdown", function() {

    it("should convert markdown files", function(done) {
      build({
        files: "spec/support/book1/content/*.md",
        destination: "spec/support/book1/build/:format",
        success: function() {
          expect(buildContent("html/first-chapter.html")).toMatch("Heading</h1>");
          expect(buildContent("html/second-chapter.html")).toMatch("Heading</h1>");
          done();
        }
      });
    });

  });

  describe("Layout", function() {

    it("should ignore layout", function(done) {
      build({
        files: "spec/support/book1/content/*.md",
        destination: "spec/support/book1/build/:format",
        success: function() {
          expect(buildContent("html/first-chapter.html")).not.toMatch("Main layout");
          expect(buildContent("html/first-chapter.html")).toMatch("Heading</h1>");
          expect(buildContent("html/second-chapter.html")).not.toMatch("Main layout");
          expect(buildContent("html/second-chapter.html")).toMatch("Heading</h1>");
          done();
        }
      });
    });

    it("should use main layout", function(done) {
      build({
        layout: "spec/support/book1/layouts/main.html",
        files: "spec/support/book1/content/*.md",
        destination: "spec/support/book1/build/:format",
        success: function() {
          expect(buildContent("html/first-chapter.html")).toMatch("Main layout");
          expect(buildContent("html/first-chapter.html")).toMatch("Heading</h1>");
          expect(buildContent("html/second-chapter.html")).toMatch("Main layout");
          expect(buildContent("html/second-chapter.html")).toMatch("Heading</h1>");
          done();
        }
      });
    });

    it("should prioritize format layout", function(done) {
      build({
        layout: "spec/support/book1/layouts/main.html",
        files: "spec/support/book1/content/*.md",
        destination: "spec/support/book1/build/:format",
        formats: {
          html : {
            layout: "spec/support/book1/layouts/format.html"
          }
        },
        success: function() {
          expect(buildContent("html/first-chapter.html")).toMatch("Format layout");
          expect(buildContent("html/first-chapter.html")).toMatch("Heading</h1>");
          expect(buildContent("html/second-chapter.html")).toMatch("Format layout");
          expect(buildContent("html/second-chapter.html")).toMatch("Heading</h1>");
          done();
        }
      });
    });

  });

  describe("Destination", function() {

    it("should prioritize format destination", function(done) {
      build({
        files: "spec/support/book1/content/*.md",
        destination: "spec/support/book1/build/another/:format",
        formats: {
          html : {
            destination: "spec/support/book1/build/myhtml",
          }
        },
        success: function() {
          expect(buildContent("myhtml/first-chapter.html")).toMatch("Heading</h1>");
          done();
        }
      });
    });

  });

});
