const puppeteer = require('puppeteer');

(async()=> {
    const browser = await puppeteer.launch({
        headless: false, slowMo: 100,
        args: ['--start-fullscreen']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
    await page.setViewport({width: 1600, height: 1080});
    const userAgent = await page.evaluate(() => navigator.userAgent);
    await page.goto('https://www.dice.com/dashboard/login');
    await page.type('input#email', 'kkrajus777@gmail.com')
    await page.type('input#password', 'Kkraju**7')
    await page.click('button[type="submit"]')
    await page.waitFor('#searchInput-div > form > div > div.flex-grow-1.mr-md-2 > div > dhi-new-typeahead-input > div > input')
    await page.type('#searchInput-div > form > div > div.flex-grow-1.mr-md-2 > div > dhi-new-typeahead-input > div > input', 'React.js')
    await page.waitFor('input#google-location-search')
    await page.type('input#google-location-search', 'Dallas, TX, USA')
    await page.waitFor('button#submitSearch-button')
    await page.click('button#submitSearch-button')
    await page.waitFor('a.card-title-link')
    const jobPostings = await page.$$('a.card-title-link')
    for(let i=0; i<jobPostings.length; i++){
        let currentJob = await jobPostings[i]
        currentJob.click()
        await page.waitFor('button#applybtn-2')
        let button = await page.$('button#applybtn-2')
        let buttonText = await page.evaluate(element => element.textContent, button);
        if(buttonText && buttonText.trim().toLowerCase() === 'apply now'){
            await page.click('button#applybtn-2')
            await page.waitFor('span.bfh-selectbox-option')
            await page.click('span.bfh-selectbox-option')
            await page.waitFor('ul#resume-select-options')
            await page.click('ul#resume-select-options>li>a')
            await page.waitFor('button#submit-job-btn')
            await page.click('button#submit-job-btn')
        }
        await page.goBack()
    }

})()