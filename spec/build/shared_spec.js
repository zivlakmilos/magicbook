var _ = require('lodash');
var rimraf = require('rimraf');

describe("All Formats", function() {

  afterAll(function(done) {
    rimraf("spec/support/book/tmp/*", function() {
      done();
    });
  });

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

  describe("SCSS", function() {

    it("should use stylesheet location", function(done) {
      var uid = triggerBuild({
        enabledFormats: ["html"],
        stylesheets: "spec/support/book/stylesheets",
        layout: "spec/support/book/layouts/assets.html",
        success: function() {
          expect(buildContent(uid, "html/first-chapter.html")).toMatch("<link rel=\"stylesheet\" href=\"assets/styles.css\">");
          expect(buildContent(uid, "html/assets/styles.css")).toMatch("color: red;");
          done();
        }
      });
    });

    it('should digest css files')

  });

});
