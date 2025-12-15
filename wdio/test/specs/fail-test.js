describe('Fail test', () => {
    it('should fail on purpose', async () => {
        await browser.url('https://www.google.com');
        // Expecting the URL to contain 'example', which will fail because the actual URL is 'google'
        await expect(browser.getUrl()).toContain('example');
    });
});
