

describe("Destination", function() {

  it("should prioritize format destination", function(done) {
    var uid = triggerBuild({
      builds: [{
        format: "html",
        destination: "spec/support/book/tmp/abcdef/myhtml"
      }],
      finish: function() {
        expect(buildPath('abcdef', "myhtml/first-chapter.html")).toHaveContent("First Heading</h1>");
        done();
      }
    });
  });

  describe("Globs", function() {

    it("should use folders from glob file.relative")

  });

});
