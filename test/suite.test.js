var Suite = require('../lib/hydro/suite');

test('construction', function() {
  var suite = new Suite('title');
  suite.title.should.eq('title');
});
