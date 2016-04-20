var fs = require('fs');
var diff = require('diff');
var rimraf = require('rimraf');

beforeAll(function(done) {
  rimraf("spec/support/book/tmp/*", function() {
    done();
  });
});

beforeEach(function () {

  jasmine.addMatchers({

    toDiffLines: function() {
      return {
        compare: function (actual, expected) {
          var result = {
            pass: true,
            message: ""
          }
          try {
            var diffResult = diff.diffLines(actual.toString().trim(), expected.toString().trim());
            diffResult.forEach(function(part){
              if(part.added || part.removed) {
                var label = part.added ? '+ ' : '-';
                result.message += label + part.value.replace(/\n/g, "") + "\n"
                result.pass = false;
              }
            });
          }
          catch(err) {
            result.pass = false;
            result.message = err.toString();
          }
          return result;
        }
      };
    },

    toExist: function() {
      return {
        compare: function (file) {
          var result = {
            pass: true
          }
          try {
            var content = fs.readFileSync(file);
          }
          catch(err) {
            result.pass = false;
            result.message = file + " does not exist";
          }
          return result;
        }
      };
    },

    toHaveContent: function() {
      return {
        compare: function (file, substring) {
          var result = {
            pass: true
          }
          try {
            var content = fs.readFileSync(file);
            if(content.indexOf(substring) == -1) {
              result.pass = false;
              result.message = "'"+substring+"'" + " not found in" + "'"+content+"'";
            }
          }
          catch(err) {
            result.pass = false;
            result.message = file + " does not exist";
          }
          return result;
        }
      };
    }

  })

});
