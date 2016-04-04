var cheerio = require('cheerio');

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

  describe("XREFs", function() {

    it("should add data-type to internal links", function(done) {
      var uid = triggerBuild({
        builds: [{ format: "html" }],
        finish: function() {
          var $ = cheerio.load(buildContent(uid, "build1/first-chapter.html"));
          expect($('a').eq(0).attr('data-type')).toEqual("xref");
          expect($('a').eq(1).attr('data-type')).toBeUndefined();
          done();
        }
      });

    });

    it("should not add data-type to external links", function() {

    });

  });

});
