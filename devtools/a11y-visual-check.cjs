const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const cwd = process.cwd();
    const browser = await chromium.launch({ headless: true });
    const checks = [
        { file: 'index.html', width: 390, height: 900, out: 'devtools/test-results/a11y-home-mobile.png' },
        { file: 'index.html', width: 1366, height: 900, out: 'devtools/test-results/a11y-home-desktop.png' },
        { file: 'fique-por-dentro-metodologia-etapa-1.html', width: 390, height: 900, out: 'devtools/test-results/a11y-step1-mobile.png' }
    ];
    const results = [];

    for (const check of checks) {
        const page = await browser.newPage({
            viewport: { width: check.width, height: check.height },
            deviceScaleFactor: 1,
            isMobile: check.width < 768
        });

        await page.goto('file:///' + path.join(cwd, check.file).replace(/\\/g, '/'));
        await page.screenshot({ path: path.join(cwd, check.out), fullPage: true });

        results.push(await page.evaluate(({ file, width }) => ({
            file,
            width,
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
            activeMenuHidden: document.querySelector('#menuPrincipal')?.getAttribute('aria-hidden'),
            overflow: document.documentElement.scrollWidth > window.innerWidth + 1
        }), check));

        await page.close();
    }

    console.log(JSON.stringify(results, null, 2));
    await browser.close();
})();
