var cheerio = require('cheerio');

describe("Codesplit plugin", function() {

  it("should split code and comments", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      addPlugins: ["codesplit"],
      files: [
        'spec/support/book/content/codesplit.md'
      ],
      codesplit: {
        includes: "spec/support/book/examples"
      },
      finish: function() {
        var content = buildContent(uid, 'build1/codesplit.html').toString();
        var $ = cheerio.load(content);
        expect($('.codesplit').length).toBe(1);
        expect($('.codesplit-content').children().length).toBe(8); // This will if we add end instruction
        expect($('.codesplit-comment').first().html().trim()).toEqual('<p>First we need to set up the variables to be used throughout the sketch.</p>');
        expect($('.codesplit-code').first().html().trim()).toEqual('<pre><code>var x = 100;\nvar y = 100;\nvar xspeed = 1;\nvar yspeed = 3.3;\nvar myName = &quot;Rune Madsen&quot;;\n</code></pre>');
        done();
      }
    });
  });

});
