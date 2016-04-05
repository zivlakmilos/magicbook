var cheerio = require('cheerio');

describe("TOC plugin", function() {

  it("should insert TOC into file", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      files: [
        "spec/support/book/content/toc.html",
        "spec/support/book/content/first-chapter.md",
        "spec/support/book/content/second-chapter.html"
      ],
      liquid: {
        includes: "spec/support/book/includes",
      },
      finish: function() {
        var content = buildContent(uid, "build1/toc.html").toString();
        var $ = cheerio.load(content);
        console.log(content);
        //expect($(''))
        done();
      }
    });
  });

});
