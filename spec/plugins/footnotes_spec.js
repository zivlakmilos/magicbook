var cheerio = require('cheerio');

describe("Footnotes plugin", function() {

  it("should create HTMLBook footnotes from markdown footnotes", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      liquid: {
        includes: "spec/support/book/includes"
      },
      files: [
        "spec/support/book/content/footnotes.md"
      ],
      finish: function() {
        var content = buildContent(uid, "build1/footnotes.html").toString();
        var $ = cheerio.load(content);
        expect($('span[data-type=footnote]').text()).toEqual("Text of footnote.");
        done();
      }
    });
  });

  it("should insert HTMLBook footnotes in liquid tag");
    // CHECK LINK
    // CHECK INSERT IN LIQUID TAG
    // THIS WILL BREAK THE TEST ABOVE

});
