var cheerio = require('cheerio');

describe('ID plugin', function() {
  it('should add ids to sections without id', function(done) {
    var uid = triggerBuild({
      builds: [{ format: 'html' }],
      files: ['spec/support/book/content/ids.html'],
      finish: function() {
        var content = buildContent(uid, 'build1/ids.html').toString();
        var $ = cheerio.load(content);
        expect(
          $('section[data-type=sect1]')
            .eq(0)
            .attr('id')
        ).toEqual('existing');
        expect(
          $('section[data-type=sect1]')
            .eq(1)
            .attr('id')
        ).toEqual('sect-1-vqWMCPD');
        expect(
          $('section[data-type=sect5]')
            .eq(0)
            .attr('id')
        ).toEqual('sect-5-RDyxCZa');
        done();
      }
    });
  });

  it('should not remove ids from existing elements', function(done) {
    var uid = triggerBuild({
      builds: [{ format: 'html' }],
      files: ['spec/support/book/content/ids.html'],
      finish: function() {
        var content = buildContent(uid, 'build1/ids.html').toString();
        var $ = cheerio.load(content);
        expect(
          $('h1')
            .eq(2)
            .attr('id')
        ).toEqual('heading-id');
        done();
      }
    });
  });

  it('should not have duplicate ids for same structure in separate files', function(
    done
  ) {
    var uid = triggerBuild({
      builds: [{ format: 'html' }],
      files: [
        'spec/support/book/content/duplicate_id1.md',
        'spec/support/book/content/duplicate_id2.md'
      ],
      finish: function() {
        var content1 = buildContent(
          uid,
          'build1/duplicate_id1.html'
        ).toString();
        var content2 = buildContent(
          uid,
          'build1/duplicate_id2.html'
        ).toString();
        var $1 = cheerio.load(content1);
        var $2 = cheerio.load(content2);
        expect($1('section').attr('id')).not.toEqual($2('section').attr('id'));
        done();
      }
    });
  });
});
