var cheerio = require('cheerio');

describe("Navigation plugin", function() {

  it("should pass navigation to liquid", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      layout: "spec/support/book/layouts/navigation.html",
      liquid: {
        includes : "spec/support/book/includes"
      },
      files: [
        "spec/support/book/content/first-chapter.md",
        "spec/support/book/content/second-chapter.html",
        "spec/support/book/content/sections.md"
      ],
      finish: function() {
        var $one = cheerio.load(buildContent(uid, "build1/first-chapter.html").toString());
        var $two = cheerio.load(buildContent(uid, "build1/second-chapter.html").toString());
        var $three = cheerio.load(buildContent(uid, "build1/sections.html").toString());

        expect($one('#prev-link').length).toBe(0);
        expect($one('#next-link').attr('href')).toEqual("second-chapter.html");
        expect($one('#next-link').text()).toEqual("Second Heading");

        expect($two('#prev-link').attr('href')).toEqual("first-chapter.html");
        expect($two('#prev-link').text()).toEqual("First Heading");
        expect($two('#next-link').attr('href')).toEqual("sections.html");
        expect($two('#next-link').text()).toEqual("Sections Heading");

        expect($three('#prev-link').attr('href')).toEqual("second-chapter.html");
        expect($three('#prev-link').text()).toEqual("Second Heading");
        expect($three('#next-link').length).toBe(0);

        done();
      }
    });
  });

  it("should work with files in subfolders", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      layout: "spec/support/book/layouts/navigation.html",
      liquid: {
        includes : "spec/support/book/includes"
      },
      files: [
        "spec/support/book/content/first-chapter.md",
        "spec/support/book/content/**/subfolder-file.md",
        "spec/support/book/content/sections.md"
      ],
      finish: function() {
        var $one = cheerio.load(buildContent(uid, "build1/first-chapter.html").toString());
        var $two = cheerio.load(buildContent(uid, "build1/subfolder/subfolder-file.html").toString());
        var $three = cheerio.load(buildContent(uid, "build1/sections.html").toString());

        expect($one('#prev-link').length).toBe(0);
        expect($one('#next-link').attr('href')).toEqual("subfolder/subfolder-file.html");
        expect($one('#next-link').text()).toEqual("Subfolder Heading");

        expect($two('#prev-link').attr('href')).toEqual("../first-chapter.html");
        expect($two('#prev-link').text()).toEqual("First Heading");
        expect($two('#next-link').attr('href')).toEqual("../sections.html");
        expect($two('#next-link').text()).toEqual("Sections Heading");

        expect($three('#prev-link').attr('href')).toEqual("subfolder/subfolder-file.html");
        expect($three('#prev-link').text()).toEqual("Subfolder Heading");
        expect($three('#next-link').length).toBe(0);

        done();
      }
    });
  });

});
