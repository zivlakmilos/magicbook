describe("Load", function() {

  it("should use part tree", function(done) {
    var uid = triggerBuild({
      files: {
        files: [
          "spec/support/book/content/toc.html"
        ],
        children: [
          {
            name: "Part 1",
            files: [
              "spec/support/book/content/first-chapter.md",
              "spec/support/book/content/second-chapter.html"
            ],
            children: [
              {
                name: "Sub Part",
                files: [
                  "spec/support/book/content/subfolder/subfolder-file.md"
                ]
              }
            ]
          },
          {
            name: "Part 2",
            files: "spec/support/book/content/sections.md"
          }
        ]
      },
      builds: [{ format: "html" }],
      finish: function() {
        expect(buildPath(uid, "build1/first-chapter.html")).toExist();
        expect(buildPath(uid, "build1/second-chapter.html")).toExist();
        expect(buildPath(uid, "build1/subfolder-file.html")).toExist();
        expect(buildPath(uid, "build1/sections.html")).toExist();
        done();
      }
    });
  });

});
