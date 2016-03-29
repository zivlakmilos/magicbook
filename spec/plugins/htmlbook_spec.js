var HTMLBook = require('../../src/plugins/htmlbook');
var hb = new HTMLBook();
var _ = require('lodash');

describe("HTMLBook plugin", function() {

  // automatically make tests from array
  var files = ["headings"];
  _.each(files, function(file) {

    var f1 = file + "_1.html";
    var f2 = file + "_2.html";

    it("should match " + f1 + " and " + f2, function() {
      expect(hb.convertHtmlFragment(fileContent('spec/support/fixtures/' + f1)))
        .toEqual(fileContent('spec/support/fixtures/' + f2));
    });

  });



});
