describe('Pass test', () => {
    before(async () => {
        // Ensure the session is ready before interacting with the browser
        await browser.url('https://www.google.com');
    });

    it('should pass', async () => {
        // Use getUrl and expect with .toContain
        const currentUrl = await browser.getUrl();
        expect(currentUrl).toContain('google');
    });
});
