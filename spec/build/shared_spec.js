var _ = require('lodash');
var rimraf = require('rimraf');

afterAll(function(done) {
  rimraf("spec/support/book/tmp/*", function() {
    done();
  });
});

describe("All Formats", function() {

  describe("Markdown", function() {

    it("should convert markdown files", function(done) {
      var uid = triggerBuild({
        enabledFormats: ["html"],
        success: function() {
          expect(buildContent(uid, "html/first-chapter.html")).toMatch("First Heading</h1>");
          expect(buildContent(uid, "html/second-chapter.html")).toMatch("Second Heading</h1>");
          done();
        }
      });
    });

  });

  describe("Layout", function() {

    it("should ignore layout", function(done) {
      var uid = triggerBuild({
        enabledFormats: ["html"],
        success: function() {
          expect(buildContent(uid, "html/first-chapter.html")).not.toMatch("Main layout");
          expect(buildContent(uid, "html/first-chapter.html")).toMatch("First Heading</h1>");
          expect(buildContent(uid, "html/second-chapter.html")).not.toMatch("Main layout");
          expect(buildContent(uid, "html/second-chapter.html")).toMatch("Second Heading</h1>");
          done();
        }
      });
    });

    it("should use main layout", function(done) {
      var uid = triggerBuild({
        enabledFormats: ["html"],
        layout: "spec/support/book/layouts/main.html",
        success: function() {
          expect(buildContent(uid, "html/first-chapter.html")).toMatch("Main layout");
          expect(buildContent(uid, "html/first-chapter.html")).toMatch("First Heading</h1>");
          expect(buildContent(uid, "html/second-chapter.html")).toMatch("Main layout");
          expect(buildContent(uid, "html/second-chapter.html")).toMatch("Second Heading</h1>");
          done();
        }
      });
    });

    it("should prioritize format layout", function(done) {
      var uid = triggerBuild({
        enabledFormats: ["html"],
        layout: "spec/support/book/layouts/main.html",
        formats: {
          html : {
            layout: "spec/support/book/layouts/format.html"
          }
        },
        success: function() {
          expect(buildContent(uid, "html/first-chapter.html")).toMatch("Format layout");
          expect(buildContent(uid, "html/first-chapter.html")).toMatch("First Heading</h1>");
          expect(buildContent(uid, "html/second-chapter.html")).toMatch("Format layout");
          expect(buildContent(uid, "html/second-chapter.html")).toMatch("Second Heading</h1>");
          done();
        }
      });
    });

  });

  describe("Destination", function() {

    it("should prioritize format destination", function(done) {
      var uid = triggerBuild({
        enabledFormats: ["html"],
        formats: {
          html : {
            destination: "spec/support/book/tmp/abcdef/myhtml",
          }
        },
        success: function() {
          expect(buildContent('abcdef', "myhtml/first-chapter.html")).toMatch("First Heading</h1>");
          done();
        }
      });
    });

  });

});
