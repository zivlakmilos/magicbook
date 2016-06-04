describe("Parts", function() {

  var tree = [
    "spec/support/book/content/toc.html",
    "spec/support/book/content/first-chapter.md",
    {
      label: "Part 1",
      files: [
        "spec/support/book/content/second-chapter.html",
        {
          label: "Sub Part",
          files: [
            "spec/support/book/content/subfolder/subfolder-file.md"
          ]
        },
        "spec/support/book/content/third-chapter.md"
      ]
    },
    {
      label: "Part 2",
      files: "spec/support/book/content/sections.md"
    }
  ];

  it("should generate files from part tree", function(done) {
    var uid = triggerBuild({
      files: tree,
      liquid: {
        includes: "spec/support/book/includes",
      },
      builds: [{ format: "html" }],
      finish: function() {
        expect(buildPath(uid, "build1/toc.html")).toExist();
        expect(buildPath(uid, "build1/first-chapter.html")).toExist();
        expect(buildPath(uid, "build1/second-chapter.html")).toExist();
        expect(buildPath(uid, "build1/subfolder-file.html")).toExist();
        expect(buildPath(uid, "build1/third-chapter.html")).toExist();
        expect(buildPath(uid, "build1/sections.html")).toExist();
        done();
      }
    });
  });

  it("should populate TOC with parts", function(done) {
    var uid = triggerBuild({
      files: tree,
      liquid: {
        includes: "spec/support/book/includes",
      },
      builds: [{ format: "html" }],
      finish: function() {
        console.log(buildContent(uid, 'build1/toc.html').toString())
        done();
      }
    });
  });

  it('should pass part parents to page and layout');
  it('should pass extra part variables to page and layout')

});
