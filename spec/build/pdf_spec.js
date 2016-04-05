describe("PDF", function() {

  it('should combine HTML into single file', function(done) {
    var uid = triggerBuild({
      builds: [{ format: "pdf" }],
      finish: function() {
        expect(buildPath(uid, "build1/consolidated.html")).toExist();
        expect(buildPath(uid, "build1/consolidated.html")).toHaveContent("First Heading</h1>");
        expect(buildPath(uid, "build1/consolidated.html")).toHaveContent("Second Heading</h1>");
        done();
      }
    });
  });

  it('should not apply layout more than once', function(done) {
    var uid = triggerBuild({
      builds: [{ format: "pdf" }],
      layout: 'spec/support/book/layouts/main.html',
      finish: function() {
        expect(buildContent(uid, "build1/consolidated.html")).not.toMatch(/Main layout[\s\S]*Main layout/)
        done();
      }
    });
  });

});
