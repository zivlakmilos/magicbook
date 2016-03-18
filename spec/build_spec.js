var build = require('../src/build.js');
var fs = require('fs');

var book1 = "spec/support/book1/";

describe("Build", function() {

  describe("Markdown", function() {

    it("should convert markdown files", function(done) {
      build({
        files: [book1 + "content/*.md", book1 + "content/*.markdown"],
        destination: book1 + "build/:format",
        success: function() {
          expect(fs.readFileSync(book1 + "/build/html/first-chapter.html")).toMatch("Heading</h1>")
          expect(fs.readFileSync(book1 + "/build/html/second-chapter.html")).toMatch("Heading</h1>")
          done();
        }
      });

    });

  });

});
