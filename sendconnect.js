const puppeteer = require('puppeteer');
const fs = require('fs');


let temp = 1
try {
    if(fs.existsSync('file.txt')) {
        fs.readFile('file.txt', 'utf-8', (err, data) => {
            if(err) {
                throw err;
            }
            temp = parseInt(data)
        });
    }
} catch (err) {
    console.error(err, '<========== Error when reading the file ==========>');
}

let marketText = ''
try {
    if(fs.existsSync('market.txt')) {
        fs.readFile('market.txt', 'utf-8', (err, data) => {
            if(err) {
                throw err;
            }
           marketText = data
        });
    }
} catch (err) {
    console.error(err, '<========== Error when reading the file ==========>');
}

(async () => {
    const browser = await puppeteer.launch({
        headless:false, slowMo: 75
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
    await page.setViewport({width: 1330, height: 1080});
    await page.goto('https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin');
    const userAgent = await page.evaluate(() => navigator.userAgent );
    // await page.waitFor(2000)
    await page.type('#username', '')
    await page.type('#password', "")
    await page.click('[aria-label="Sign in"]')

    let connectionReqSent = 0

    const reConnectInPage= async ()=> {
        try {
            if (page.url == 'https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin') {
            } else if (parseInt(temp) > 1) {
                await page.goto(`https://www.linkedin.com/search/results/people/?keywords=it%20recruiters&page=${parseInt(temp)}`)
            } else {
                await page.goto('https://www.linkedin.com/search/results/people/?keywords=it%20recruiters')
            }

            await page.waitForSelector('.search-results__list')

            await page.waitForSelector('.search-result__actions--primary')
            const buttons = await page.$$('.search-result__actions--primary')


            for (let i = 0; i <= buttons.length; i++) {
                let currButton = await buttons[i]
                let connButton = await page.evaluate(currButton => currButton && currButton.innerText, currButton)
                if (connButton && connButton.trim().toLowerCase() === 'connect') {
                    // await page.evaluate(currButton => currButton && currButton.scrollIntoView(), currButton)
                    await page.waitFor(1000)
                    currButton.click()
                    await page.waitFor(2000)
                    await page.waitForSelector('[aria-label="Add a note"]')
                    await page.waitFor(2000)
                    await page.click('[aria-label="Add a note"]')
                    await page.waitForSelector('#custom-message')


                    if (await page.$('input[id="email"]') !== null){
                            await page.waitForSelector('[aria-label="Cancel adding a note"]')
                            await page.click('[aria-label="Dismiss"]')
                    }else{
                        await page.type(
                            '#custom-message',
                            marketText
                        )
                        await page.waitForSelector('[aria-label="Done"]')
                        await page.click('[aria-label="Done"]')
                        connectionReqSent = connectionReqSent + 1
                        console.log(`<========== Connection request sent to ${connectionReqSent} people ==========>`)
                    }

                } else {
                    console.log('<========== Connection request to this person has been already sent ==========>')
                }
            }
            temp = parseInt(temp) + 1
            fs.writeFile('file.txt', temp.toString(), (err) => {
                if (err) {
                    throw err;
                }
                console.log("Saving page number to file.");
            });


            if (connectionReqSent <= 65) {
                await reConnectInPage()
            } else {
                console.log('<========== Successfully sent requests to 65 people ==========>')
                await browser.close();
            }
        }catch(error){
            console.log(error, '<========== App broke please restart ==========>')
        }
    }

    await reConnectInPage()
})();