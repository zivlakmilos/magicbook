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

        expect($('nav > ol > li > a').eq(0).text()).toEqual("First Heading")
          expect($('nav > ol > li > ol > li > a').eq(0).text()).toEqual("Math")
          expect($('nav > ol > li > ol > li > a').eq(1).text()).toEqual("Links")
        expect($('nav > ol > li > a').eq(1).text()).toEqual("Second Heading")
          expect($('nav > ol > li > ol > li > a').eq(2).text()).toEqual("Second section 1")
        done();
      }
    });
  });

});
