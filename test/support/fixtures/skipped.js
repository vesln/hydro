describe('Skipped tests', function() {
  it('skipped (explicit)', function() {}).skip();
  it('skipped (explicit)').skip();
  it('skipped (empty)');
  it('not skipped', function(){}).skip(false);
});
