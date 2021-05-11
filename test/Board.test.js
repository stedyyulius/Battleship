const puppeteer = require('puppeteer');

const { updateRoom } = require('../api/room');

const playerOneName = 'willy';
const playerTwoName = 'niko';
const roomNumber = 0;

describe('Board integration test', () => {
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

        const enterButton = await page.$(`button.enter-button-${roomNumber}`);

        await enterButton.evaluate(btn => btn.click());

        await page.keyboard.type(playerOneName);

        const setUsernameButton = await page.$('button.set-username-btn');

        await setUsernameButton.evaluate(btn => btn.click());

        //player 2

        const secondEnter = await secondPage.$(`button.enter-button-${roomNumber}`);

        await secondEnter.evaluate(btn => btn.click());

        await secondPage.keyboard.type(playerTwoName);

        const secondUserNameBtn = await secondPage.$('button.set-username-btn');

        await secondUserNameBtn.evaluate(btn => btn.click());

    })

    afterAll(async () => {

        await updateRoom({
            id: roomNumber,
            players: [],
            boards: [],
            status: 'idle'
        });

        await browser.close();
        await secondBrowser.close();
    })

    test('when game start players will redirected to board page', async (done) => {

        const startButton = await secondPage.$('button.start-button');

        startButton.click();

        console.log(secondPage.url())

        setTimeout(async () => {
            expect(secondPage.url()).toBe(`http://localhost:3000/duelroom/${roomNumber}`);

            const playerTwoLeaveButton = await secondPage.$('button.leave-button');

            await playerTwoLeaveButton.evaluate(btn => btn.click());

            done();

        }, 10000);
    })
})