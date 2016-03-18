var build = require('../src/build.js');
var fs = require('fs');

describe("Build", function() {

  beforeAll(function(done) {
    build({
      files: ["spec/support/book1/content/*.md", "spec/support/book1/content/*.markdown"],
      destination: "spec/support/book1/build/:format",
      success: done
    });
  });

  describe("Markdown", function() {

    it("should convert markdown files", function() {
      expect(fs.readFileSync("spec/support/book1/build/html/first-chapter.html")).toMatch("Heading</h1>")
      expect(fs.readFileSync("spec/support/book1/build/html/second-chapter.html")).toMatch("Heading</h1>")
    });

  });

});
