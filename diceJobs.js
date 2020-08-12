const puppeteer = require('puppeteer');


(async()=> {
    const browser = await puppeteer.launch({
        headless: false, slowMo: 100,
        args: ['--start-fullscreen']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
    await page.setViewport({width: 1600, height: 1080});
    await page.evaluate(() => navigator.userAgent);
    await page.goto('https://www.dice.com/dashboard/login');
    await page.type('input#email', '')
    await page.type('input#password', '')
    await page.click('button[type="submit"]')

    let currPage = 1
    let jobApplied = 0
    const reapply = async () =>{
        await page.goto(`https://www.dice.com/jobs?q=react.js&location=Dallas,%20TX,%20USA&latitude=32.7766642&longitude=-96.79698789999999&countryCode=US&locationPrecision=City&adminDistrictCode=TX&radius=30&radiusUnit=mi&page=${currPage}&pageSize=20&filters.postedDate=ONE&language=en`)
        const jobs = await page.evaluate(
            () => Array.from(
                document.querySelectorAll('a.card-title-link'),
                a => a.getAttribute('href')
            )
        )

        for(let j=0; j<jobs.length; j++){
            let page2 = await browser.newPage()
            await page2.setViewport({width: 1600, height: 1080});
            await page2.goto(jobs[j])
            console.log(`currently applying ${j} of ${jobs.length}`)
            try{
                await page2.waitFor('button#applybtn-2')
                let button = await page2.$('button#applybtn-2')
                let buttonText = await page2.evaluate(element => element.textContent, button);
                if(buttonText && buttonText.trim().toLowerCase() === 'apply now'){
                    await page2.waitFor('button[id="applybtn-2"]')
                    await page2.click('button[id="applybtn-2"]')
                    await page2.waitFor('#resume-select-group')
                    await page2.waitFor(1000)
                    await page2.click('#resume-select-group')
                    await page2.waitFor('ul#resume-select-options')
                    await page2.click('ul#resume-select-options>li>a')
                    await page2.waitFor(1000)

                    let encounteredCaptcha = await page2.$('#googleCaptchaSection_NEW_EA_ID')
                    if(encounteredCaptcha){
                        await page2.waitFor(3000)
                        await page2.click('.recaptcha-checkbox-border')
                        await page2.waitFor(3000)
                    }
                    // id="googleCaptchaSection_NEW_EA_ID"
                    await page2.waitFor('button#submit-job-btn')
                    await page2.click('button#submit-job-btn')
                    jobApplied = jobApplied + 1
                }
                console.log('Total number of jobs applied:', jobApplied)
                await page2.close()
            }catch(e){
                await page2.close()
            }
        }
        currPage = currPage + 1
      await reapply()
    }
    await reapply()

})()


// await page.waitFor('#searchInput-div > form > div > div.flex-grow-1.mr-md-2 > div > dhi-new-typeahead-input > div > input')
// await page.type('#searchInput-div > form > div > div.flex-grow-1.mr-md-2 > div > dhi-new-typeahead-input > div > input', 'React.js')
// await page.waitFor('input#google-location-search')
// await page.type('input#google-location-search', 'Dallas, TX, USA')
// await page.waitFor('button#submitSearch-button')
// await page.click('button#submitSearch-button')
// await page.waitFor('a.card-title-link')