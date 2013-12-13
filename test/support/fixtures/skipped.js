describe('Skipped tests', function() {
  it('skipped (explicit)', function() {}).skip();
  it('skipped (explicit)').skip();
  it('not skipped', function(){}).skip(false);
});
