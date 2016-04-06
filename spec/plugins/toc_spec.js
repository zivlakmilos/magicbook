var cheerio = require('cheerio');

function expectTOC($) {
  var level1 = $('nav > ol > li');
  var level2 = $('nav > ol > li > ol > li');
  expect(level1.find('> a').eq(0).text()).toEqual("First Heading")
  expect(level1.find('> a').eq(0).attr('href')).toEqual("first-chapter.html#mb-first-heading-yeYID")
    expect(level2.find('> a').eq(0).text()).toEqual("Math")
    expect(level2.find('> a').eq(0).attr('href')).toEqual("first-chapter.html#mb-math-JOQI6")
    expect(level2.find('> a').eq(1).text()).toEqual("Links")
    expect(level2.find('> a').eq(1).attr('href')).toEqual("first-chapter.html#mb-links-vlzIA")
  expect(level1.find('> a').eq(1).text()).toEqual("Second Heading")
  expect(level1.find('> a').eq(1).attr('href')).toEqual("second-chapter.html#mb-second-heading-yeYID")
    expect(level2.find('> a').eq(2).text()).toEqual("Second section 1")
    expect(level2.find('> a').eq(2).attr('href')).toEqual("second-chapter.html#mb-second-section-1-JOQI6")
}

describe("TOC plugin", function() {

  it("should generate and insert TOC into file", function(done) {
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
        expectTOC(cheerio.load(content))
        done();
      }
    });
  });

  it("should generate TOC even when content is wrapped", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      layout: "spec/support/book/layouts/container.html",
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
        expectTOC(cheerio.load(content))
        done();
      }
    });
  });

});
