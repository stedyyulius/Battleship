const puppeteer = require('puppeteer');

const playerOneName = 'stedy';
const playerTwoName = 'poppy';

describe('room integration test', () => {

    let browser;
    let page;
    let secondBrowser;
    let secondPage;

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
    })

    afterAll(() => {

        setTimeout(async () => {
            await browser.close();
            await secondBrowser.close();
        }, 10000);
    })

    test('player one should be able to join room', async () => {
        const enterButton = await page.$('button.enter-button-0');

        await enterButton.evaluate(btn => btn.click());

        await page.keyboard.type(playerOneName);

        const setUsernameButton = await page.$('button.set-username-btn');

        await setUsernameButton.evaluate(btn => btn.click());

    })

    test('leave button should appear when player enter a room', async () => {
        const playerOneLeaveButton = await page.$('button.leave-button');

        await expect(playerOneLeaveButton).not.toBe(null);

    })

    test('player 2 able to join a room', () => {

        setTimeout(async () => {
            const enterButton = await secondPage.$('button.enter-button-0');

            await enterButton.evaluate(btn => btn.click());

            await secondPage.keyboard.type(playerTwoName);

            const setUsernameButton = await secondPage.$('button.set-username-btn');

            await setUsernameButton.evaluate(btn => btn.click());
        }, 3000)

    })

    test('players one to leave room', () => {

        setTimeout(async () => {

            const playerOneLeaveButton = await page.$('button.leave-button');

            await playerOneLeaveButton.evaluate(btn => btn.click());

        }, 5000)

    })

    test('player two able to leave room', () => {

        setTimeout(async () => {

            const playerTwoLeaveButton = await secondPage.$('button.leave-button');

            await playerTwoLeaveButton.evaluate(btn => btn.click());
        }, 6000)
    })

    test('start button should appear when 2 players inside a room', async () => {

        setTimeout(async () => {
            const enterButton = await page.$('button.enter-button-0');

            await enterButton.evaluate(btn => btn.click());

            await page.keyboard.type(playerOneName);

            const setUsernameButton = await page.$('button.set-username-btn');

            await setUsernameButton.evaluate(btn => btn.click());
        }, 7000)


        setTimeout(async () => {
            const enterButton = await secondPage.$('button.enter-button-0');

            await enterButton.evaluate(btn => btn.click());

            await secondPage.keyboard.type(playerTwoName);

            const setUsernameButton = await secondPage.$('button.set-username-btn');

            await setUsernameButton.evaluate(btn => btn.click());
        }, 8000)

        setTimeout(async () => {
            const startButton = await page.$('button.start-button');

            await expect(startButton).not.toBe(null);
        }, 9000)

    })
    
})