const puppeteer = require('puppeteer');

const playerOneName = 'stedy';
const playerTwoName = 'poppy';

describe('Board integration test', () => {
    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: false
        })

        page = await browser.newPage();
        
        await page.goto('http://localhost:3000');

        secondBrowser = await puppeteer.launch({
            headless: false
        })

        secondPage = await secondBrowser.newPage();
       
        await secondPage.goto('http://localhost:3000');

        const enterButton = await page.$('button.enter-button-0');

        await enterButton.evaluate(btn => btn.click());

        await page.keyboard.type(playerOneName);

        await setUsernameButton.evaluate(btn => btn.click());

        await enterButton.evaluate(btn => btn.click());

        await secondPage.keyboard.type(playerTwoName);

        const setUsernameButton = await secondPage.$('button.set-username-btn');

        await setUsernameButton.evaluate(btn => btn.click());
    })

    
    afterAll(() => {

        setTimeout(async () => {
            await browser.close();
            await secondBrowser.close();
        }, 10000);
    })

    test('when game start players will redirected to board page', () => {
           
    })
})