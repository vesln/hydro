var loadCount = 0;

module.exports = function(hydro) {
  hydro.set('globals', 'fixturePlugin', ++loadCount);
  module.exports.called = true;
};

module.exports.flags = [
  '--foo Bar'
]
