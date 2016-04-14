var cheerio = require('cheerio');

describe("Footnotes plugin", function() {

  it("should convert both HTMLBook and MD footnotes", function(done) {
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

        // markdown
        var fn1 = $('span[data-type=footnote]').eq(0);
        var fn2 = $('span[data-type=footnote]').eq(1);
        expect(fn1.text()).toEqual("1");
        expect(fn1.find('a').attr('href')).toEqual("#fn1");
        expect(fn2.text()).toEqual("2");
        expect(fn2.find('a').attr('href')).toEqual("#fn2");
        done();
      }
    });
  });

});
