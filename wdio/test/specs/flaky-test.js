describe('Flaky test', () => {
    it('should randomly pass or fail', async () => {
        const random = Math.floor(Math.random() * 2); // Random value (0 or 1)
        await browser.url('https://www.google.com');
        // Expecting the random value to be 0, which will make the test pass 50% of the time
        await expect(random).toBe(0); // 50/50 flaky test
    });
});
