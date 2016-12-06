describe('a file should not be included', () => {
  it('should thorw', () => {
    throw new Error('this file should not be included');
  });
});
