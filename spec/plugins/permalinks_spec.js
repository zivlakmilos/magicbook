describe("Permalinks", function() {

  it('should default to glob', function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      files: "spec/support/book/content/**/subfolder-file.md",
      finish: function() {
        expect(buildPath(uid, "build1/subfolder/subfolder-file.html")).toExist();
        done();
      }
    });
  });

  it('should use permalink from config', function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      permalink : "permafolder/permafile.html",
      files: "spec/support/book/content/**/subfolder-file.md",
      finish: function() {
        expect(buildPath(uid, "build1/subfolder/subfolder-file.html")).not.toExist();
        expect(buildPath(uid, "build1/permafolder/permafile.html")).toExist();
        done();
      }
    });
  });

  it('should prioritize permalink from frontmatter', function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      permalink : "permafolder/permafile.html",
      files: "spec/support/book/content/permalinks.md",
      finish: function() {
        expect(buildPath(uid, "build1/permafolder/permafile.html")).not.toExist();
        expect(buildPath(uid, "build1/frontmatterpermafolder/frontmatterpermafile.html")).toExist();
        done();
      }
    });
  });

  it('should use :parts and :title variable', function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      permalink : ":parts/:title.html",
      files: [
        {
          label: "Part 1",
          files: [
            "spec/support/book/content/first-chapter.md",
            {
              label: "Part 2",
              files: [ "spec/support/book/content/**/subfolder-file.md" ]
            }
          ]
        }
      ],
      finish: function() {
        expect(buildPath(uid, "build1/part-1/first-chapter.html")).toExist();
        expect(buildPath(uid, "build1/part-1/part-2/subfolder-file.html")).toExist();
        done();
      }
    });
  });

});
