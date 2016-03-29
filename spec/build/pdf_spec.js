describe("PDF", function() {

  it('should combine HTML into single file', function(done) {
    var uid = triggerBuild({
      enabledFormats: ["pdf"],
      finish: function() {
        expect(buildPath(uid, "pdf/consolidated.html")).toExist();
        expect(buildPath(uid, "pdf/consolidated.html")).toHaveContent("First Heading</h1>");
        expect(buildPath(uid, "pdf/consolidated.html")).toHaveContent("Second Heading</h1>");

        done();
      }
    });
  });

  it('should not apply layout more than once', function(done) {
    var uid = triggerBuild({
      enabledFormats: ["pdf"],
      layout: 'spec/support/book/layouts/main.html',
      finish: function() {
        expect(buildContent(uid, "pdf/consolidated.html")).not.toMatch(/Main layout[\s\S]*Main layout/)
        done();
      }
    });
  });

});
