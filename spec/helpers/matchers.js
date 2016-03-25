var fs = require('fs');

beforeEach(function () {

  jasmine.addMatchers({

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
