const puppeteer = require('puppeteer');

const playerOneName = 'stedy';
const playerTwoName = 'poppy';

describe('Board integration test', () => {
    beforeAll(async () => {

        browser = await puppeteer.launch({
            headless: false,
        })

        page = await browser.newPage();

        await page.goto('http://localhost:3000');

        secondBrowser = await puppeteer.launch({
            headless: false,
            slowMo: 500
        })

        secondPage = await secondBrowser.newPage();

        await secondPage.goto('http://localhost:3000');
    })

    afterAll(async () => {

        await browser.close();
        await secondBrowser.close();
    })

    test('when game start players will redirected to board page', () => {

    })
})