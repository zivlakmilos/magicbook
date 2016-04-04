describe("TOC plugin", function() {

  it("should insert TOC into file", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      files: [
        "spec/support/book/content/toc.md",
        "spec/support/book/content/htmlbook.html"
      ],
      finish: function() {
        expect(buildContent(uid, "build1/toc.html")).toEqual(fileContent("spec/support/fixtures/toc.html"));
        done();
      }
    });
  });

  it("should insert TOC into layout")

  it("should insert navigation object in config")

});
