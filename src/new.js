var path = require('path');
var fsx = require('fs-extra');

module.exports = function(projectName) {

  var copyFrom = path.join(__dirname, '../example');
  var copyTo   = path.join(process.cwd(), projectName);

  fsx.copy(copyFrom, copyTo, function (err) {
    if (err) return console.error(err)
    console.log('Created folder: ' + projectName)
  });

}
