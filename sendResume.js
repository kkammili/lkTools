const puppeteer = require('puppeteer');
(async()=>{
    const browser = await puppeteer.launch({
        headless:false, slowMo: 100,
        args: ['--start-fullscreen']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
    await page.setViewport({width: 1600, height: 1080});
    await page.goto('https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin');
    const userAgent = await page.evaluate(() => navigator.userAgent );
// await page.waitFor(2000)
    await page.type('#username', '***')
    await page.type('#password', "***")
    await page.click('[aria-label="Sign in"]')
    let start = 25

    const reApply= async ()=> {
        try {
            await page.goto(`https://www.linkedin.com/jobs/search/?keywords=react%20js&start=${parseInt(start)}`)

            // if (page.url == 'https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin') {
            // } else if (parseInt(currPage) > 1) {
            //     await page.goto(`https://www.linkedin.com/jobs/search/?keywords=react%20js&page=${parseInt(currPage)}`)
            // } else {
            //     await page.goto('https://www.linkedin.com/jobs/search/?keywords=react%20js')
            // }

            // await page.waitForSelector('.search-s-facet__button')
            // await page.$eval('.search-s-facet__button', btn => btn.click());
            // await page.$eval('.search-s-facet-value__input', btn => btn.click())
            // await page.$eval('.facet-collection-list__apply-button', btn => btn.click())
            await page.waitFor(500)

            await page.waitForSelector('.jobs-search-results__list')

            await page.waitForSelector('.artdeco-list__item--offset-2.artdeco-list__item')
            const jobTabs = await page.$$('.artdeco-list__item--offset-2.artdeco-list__item')
            for (let eachJob = 0; eachJob < jobTabs.length; eachJob++) {
                console.log(eachJob, jobTabs.length, '<----- curr job tab, jobtabs length')
                let currJob = await jobTabs[eachJob]
                currJob.click()
                await page.waitFor(5000)
                if ((await page.$('button.jobs-apply-button>span')) !== null) {  // if jobs apply button exists
                    let button = await page.$('button.jobs-apply-button>span')
                    let buttonText = await page.evaluate(element => element.textContent, button);

                    if (buttonText.trim().toLowerCase() === 'easy apply') {   // if easy apply button
                        console.log(buttonText.trim().toLowerCase(), '<---- check button text')
                        await page.click('.jobs-apply-button')
                        await page.waitFor(3000)


                        if ((await page.$('[aria-label="Submit application"]')) !== null) { //if submit application button
                            await page.click('[aria-label="Submit application"]')
                            await page.waitFor(5000)
                            console.log('<----- clicked on submit button')
                        } else {
                            console.log('<---- unable to find close button')
                            await page.waitForSelector('[aria-label="Dismiss"]')
                            await page.click('[aria-label="Dismiss"]')
                            await page.click('.artdeco-modal__confirm-dialog-btn.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view')
                        }


                    }
                }else{
                    if(eachJob >= jobTabs.length - 4){
                        start = start + 25
                        await reApply()
                    }
                }

            }
        } catch (e) {
            console.log(e, '<----- error occoured')
            start = start + 25
            await reApply()
        }
        // currPage = currPage + 1
        // await reApply()
    }

    await reApply()
})()