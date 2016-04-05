var cheerio = require('cheerio');

function dt(el) {
  return el.attribs['data-type']
}

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
      files: "spec/support/book/content/sections.md",
      builds: [{ format: "html" }],
      finish: function() {
        var content = buildContent(uid, "build1/sections.html").toString();
        var $ = cheerio.load(content);
        var root = $.root().children()[0];
        var children = $(root).children();
        expect(dt(root)).toEqual('chapter');
          expect(children[0].name).toEqual('h1')
          expect(children[1].name).toEqual('section')
          expect(dt(children[1])).toEqual('sect1')
            expect($(children[1]).children()[0].name).toEqual('h1')
            expect($(children[1]).children()[1].name).toEqual('p')
            expect($(children[1]).children()[2].name).toEqual('pre')
            expect($(children[1]).children()[3].name).toEqual('section')
            expect(dt($(children[1]).children()[3])).toEqual('sect2')
          expect(children[2].name).toEqual('section')
          expect(dt(children[2])).toEqual('sect1')

        //expect(buildContent(uid, "build1/sections.html")).toDiffLines(fileContent("spec/support/fixtures/htmlbook.html"));
        done();
      }
    });
  });

  describe("XREFs", function() {

    it("should add data-type to internal links and not external links", function(done) {
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

  });

});
