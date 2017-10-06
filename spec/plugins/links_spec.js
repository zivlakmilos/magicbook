describe('Links plugin', function() {
  describe('internal links', function() {
    it('should add filename to link in HTML', function(done) {
      var uid = triggerBuild({
        builds: [{ format: 'html' }],
        finish: function() {
          expect(buildPath(uid, 'build1/first-chapter.html')).toHaveContent(
            'second-chapter.html#my-anchor'
          );
          expect(buildPath(uid, 'build1/second-chapter.html')).toHaveContent(
            'id="my-anchor"'
          );
          done();
        }
      });
    });

    it('should work with files in subfolders', function(done) {
      var uid = triggerBuild({
        builds: [
          {
            format: 'html',
            files: [
              'spec/support/book/content/subfolder/subfolder-file.md',
              'spec/support/book/content/second-chapter.html'
            ]
          }
        ],
        finish: function() {
          expect(buildPath(uid, 'build1/subfolder-file.html')).toHaveContent(
            '../second-chapter.html#my-anchor'
          );
          done();
        }
      });
    });

    it('should not add filename to link in PDF', function(done) {
      var uid = triggerBuild({
        builds: [{ format: 'pdf' }],
        finish: function() {
          expect(buildPath(uid, 'build1/consolidated.html')).not.toHaveContent(
            'second-chapter.html#my-anchor'
          );
          done();
        }
      });
    });
  });
});
