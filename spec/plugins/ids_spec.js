var cheerio = require('cheerio');

describe("ID plugin", function() {

  it("should add ids to sections without id", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      files: [
        "spec/support/book/content/ids.html"
      ],
      finish: function() {
        var $ = cheerio.load(buildContent(uid, "build1/ids.html"));
        expect($('section[data-type=sect1]').eq(0).attr('id')).toEqual("existing");
        expect($('section[data-type=sect1]').eq(1).attr('id')).toEqual("WHAT??");
        expect($('section[data-type=sect5]').eq(1).attr('id')).toEqual("WHAT??");
        done();
      }
    });
  });

});
