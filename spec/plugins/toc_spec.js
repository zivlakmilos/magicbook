/*var cheerio = require('cheerio');

function expectTOC($, addFile) {

  var file1 = addFile ? "first-chapter.html" : "";
  var file2 = addFile ? "second-chapter.html" : "";

  var level1 = $('nav > ol > li');
  var level2 = $('nav > ol > li > ol > li');
  expect(level1.find('> a').eq(0).text()).toEqual("First Heading")
  expect(level1.find('> a').eq(0).attr('href')).toEqual(file1 + "#first-heading-yeYID")
    expect(level2.find('> a').eq(0).text()).toEqual("Math")
    expect(level2.find('> a').eq(0).attr('href')).toEqual(file1 + "#math-JOQI6")
    expect(level2.find('> a').eq(1).text()).toEqual("Links")
    expect(level2.find('> a').eq(1).attr('href')).toEqual(file1 + "#links-vlzIA")
  expect(level1.find('> a').eq(1).text()).toEqual("Second Heading")
  expect(level1.find('> a').eq(1).attr('href')).toEqual(file2 + "#second-heading-yeYID")
    expect(level2.find('> a').eq(2).text()).toEqual("Second section 1")
    expect(level2.find('> a').eq(2).attr('href')).toEqual(file2 + "#second-section-1-JOQI6")
}

describe("TOC plugin", function() {

  it("should insert TOC into files", function(done) {
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
        expectTOC(cheerio.load(content), true)
        done();
      }
    });
  });

  it("should insert TOC into layouts")

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
        expectTOC(cheerio.load(content), true)
        done();
      }
    });
  });

  it("should not add filenames in PDF", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "pdf" }],
      files: [
        "spec/support/book/content/toc.html",
        "spec/support/book/content/first-chapter.md",
        "spec/support/book/content/second-chapter.html"
      ],
      liquid: {
        includes: "spec/support/book/includes",
      },
      finish: function() {
        var content = buildContent(uid, "build1/consolidated.html").toString();
        expectTOC(cheerio.load(content), false)
        done();
      }
    });
  });

});*/
