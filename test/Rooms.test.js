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
            headless: false,
        })

        page = await browser.newPage();

        await page.goto('http://localhost:3000');

        secondBrowser = await puppeteer.launch({
            headless: false,
            slowMo: 100
        })

        secondPage = await secondBrowser.newPage();

        await secondPage.goto('http://localhost:3000');
    })

    afterAll(async () => {
        const playerOneLeaveButton = await page.$('button.leave-button');

        await playerOneLeaveButton.evaluate(btn => btn.click());

        const playerTwoLeaveButton = await secondPage.$('button.leave-button');

        await playerTwoLeaveButton.evaluate(btn => btn.click());

        await browser.close();
        await secondBrowser.close();
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

    test('player 2 able to join a room', async () => {


        const enterButton = await secondPage.$('button.enter-button-0');

        await enterButton.evaluate(btn => btn.click());

        await secondPage.keyboard.type(playerTwoName);

        const setUsernameButton = await secondPage.$('button.set-username-btn');

        await setUsernameButton.evaluate(btn => btn.click());


    })

    test('players one to leave room', async () => {

        const playerOneLeaveButton = await page.$('button.leave-button');

        await playerOneLeaveButton.evaluate(btn => btn.click());


    })

    test('player two able to leave room', async () => {

        const playerTwoLeaveButton = await secondPage.$('button.leave-button');

        await playerTwoLeaveButton.evaluate(btn => btn.click());

    })

    test('start button should appear when 2 players inside a room', async () => {

        const enterButton = await page.$('button.enter-button-0');

        await enterButton.evaluate(btn => btn.click());

        await page.keyboard.type(playerOneName);

        const setUsernameButton = await page.$('button.set-username-btn');

        await setUsernameButton.evaluate(btn => btn.click());

        //player 2

        const secondPageEnterButton = await secondPage.$('button.enter-button-0');

        const secondPageUsernameButton = await secondPage.$('button.set-username-btn');

        await secondPageEnterButton.evaluate(btn => btn.click());

        await secondPage.keyboard.type(playerTwoName);

        await secondPageUsernameButton.evaluate(btn => btn.click());

        const startButton = await secondPage.$('button.start-button');

        await expect(startButton).not.toBe(null);

    })

})