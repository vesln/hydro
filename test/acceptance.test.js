var fixtures = require('path').join(__dirname, 'fixtures');

test('passing tests', function(done) {
  cli()
  .stdout(/3 tests, 0 failures/)
  .run(fixtures + '/passing.js')
  .code(0)
  .end(done);
});

test('failing tests', function(done) {
  cli()
  .stdout(/5 failures/)
  .run(fixtures + '/failing.js')
  .code(5)
  .end(done);
});

test('skipped tests', function(done) {
  cli()
  .stdout(/3 skipped/)
  .run(fixtures + '/skipped.js')
  .code(0)
  .end(done);
});

test('suites', function(done) {
  cli()
  .run(fixtures + '/suite.js --formatter test-json')
  .expect(function(res) {
    var tests = JSON.parse(res.stdout);
    var expected = [
        { title: 'a-test-1', suite: 'a' }
      , { title: 'a-test-2', suite: 'a' }
      , { title: 'b-test-1', suite: 'b' }
      , { title: 'b-test-2', suite: 'b' }
    ];

    expected.forEach(function(expect, i) {
      tests[i].title.should.eq(expect.title);
      tests[i].suite.should.eq(expect.suite);
    });
  })
  .end(done);
});
