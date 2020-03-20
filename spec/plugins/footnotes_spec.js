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

        // parse footnotes into ref links
        var fn1 = $('span[data-type=footnote]').eq(0);
        var fn2 = $('span[data-type=footnote]').eq(1);
        expect(fn1.text()).toEqual("1");
        expect(fn1.find('a').attr('href')).toEqual("#fn1");
        expect(fn2.text()).toEqual("2");
        expect(fn2.find('a').attr('href')).toEqual("#fn2");

        // insert footnote text in partials
        var fns1 = $('ol[data-type=footnotes] li').eq(0);
        var fns2 = $('ol[data-type=footnotes] li').eq(1);
        expect(fns1.html()).toEqual("Text of <em>Markdown</em> footnote.");
        expect(fns1.attr('id')).toEqual("fn1");
        expect(fns2.text()).toEqual("Text of HTMLBook footnote.");
        expect(fns2.attr('id')).toEqual("fn2");

        done();
      }
    });
  });

  it("should not strip the HTML layout", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      layout: "spec/support/book/layouts/container.html",
      liquid: {
        includes: "spec/support/book/includes"
      },
      files: [
        "spec/support/book/content/footnotes.md"
      ],
      finish: function() {
        var content = buildContent(uid, "build1/footnotes.html").toString();
        expect(content).toMatch('DOCTYPE')
        done();
      }
    });
  });

});
