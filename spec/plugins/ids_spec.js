var cheerio = require('cheerio');

describe("ID plugin", function() {

  it("should add ids to sections without id", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      files: [
        "spec/support/book/content/ids.html"
      ],
      finish: function() {
        var content = buildContent(uid, "build1/ids.html").toString();
        var $ = cheerio.load(content);
        expect($('section[data-type=sect1]').eq(0).attr('id')).toEqual("existing");
        expect($('section[data-type=sect1]').eq(1).attr('id')).toEqual("sect-1-voqIN");
        expect($('section[data-type=sect5]').eq(0).attr('id')).toEqual("sect-5-v7oI2");
        done();
      }
    });
  });

});
