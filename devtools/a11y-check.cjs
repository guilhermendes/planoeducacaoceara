const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
    const cwd = process.cwd();
    const files = fs.readdirSync(cwd).filter(file => file.endsWith('.html'));
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 390, height: 900 }, isMobile: true });
    const failures = [];

    for (const file of files) {
        await page.goto('file:///' + path.join(cwd, file).replace(/\\/g, '/'));

        const result = await page.evaluate(() => ({
            main: document.querySelectorAll('main#conteudo-principal').length,
            skip: !!document.querySelector('.skip-link[href="#conteudo-principal"]'),
            menuButton: !!document.querySelector('#menuToggle[aria-controls="menuPrincipal"]'),
            roleButtonCount: document.querySelectorAll('[role="button"]').length,
            hashLinks: document.querySelectorAll('a[href="#"]').length
        }));

        if (result.main !== 1 || !result.skip || !result.menuButton || result.roleButtonCount || result.hashLinks) {
            failures.push({ file, result });
        }
    }

    await page.goto('file:///' + path.join(cwd, 'index.html').replace(/\\/g, '/'));
    await page.click('#menuToggle');
    const openState = await page.evaluate(() => ({
        expanded: document.querySelector('#menuToggle').getAttribute('aria-expanded'),
        hidden: document.querySelector('#menuPrincipal').getAttribute('aria-hidden'),
        firstTab: document.querySelector('#menuPrincipal a').getAttribute('tabindex')
    }));

    await page.keyboard.press('Escape');
    const closedState = await page.evaluate(() => ({
        expanded: document.querySelector('#menuToggle').getAttribute('aria-expanded'),
        hidden: document.querySelector('#menuPrincipal').getAttribute('aria-hidden'),
        firstTab: document.querySelector('#menuPrincipal a').getAttribute('tabindex'),
        focused: document.activeElement.id
    }));

    await page.goto('file:///' + path.join(cwd, 'fique-por-dentro-metodologia-etapa-1.html').replace(/\\/g, '/'));
    await page.click('[data-modal-target="modal-comissao-intersetorial"]');
    const modalOpen = await page.evaluate(() => ({
        open: document.querySelector('#modal-comissao-intersetorial').classList.contains('is-open'),
        hidden: document.querySelector('#modal-comissao-intersetorial').getAttribute('aria-hidden'),
        activeTag: document.activeElement.tagName,
        activeClass: document.activeElement.className
    }));

    await page.keyboard.press('Escape');
    const modalClosed = await page.evaluate(() => ({
        open: document.querySelector('#modal-comissao-intersetorial').classList.contains('is-open'),
        hidden: document.querySelector('#modal-comissao-intersetorial').getAttribute('aria-hidden'),
        activeTarget: document.activeElement.getAttribute('data-modal-target')
    }));

    console.log(JSON.stringify({ failures, openState, closedState, modalOpen, modalClosed }, null, 2));
    await browser.close();
})();
