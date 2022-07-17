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
    await page.type('input#email', 'kkrajus777@gmail.com')
    await page.type('input#password', 'Kkraju**7')
    await page.click('button[type="submit"]')

    let currPage = 1
    let jobApplied = 0
    const reapply = async () =>{
        await page.goto(`https://www.dice.com/jobs?q=node js&countryCode=US&radius=30&radiusUnit=mi&page=${currPage}&pageSize=20&filters.employmentType=CONTRACTS&filters.isRemote=true&language=en&eid=S2Q_,gKQ_`)
        await page.waitFor(5000)

        // jobs on current page
        const jobsOnCurrPage = await page.evaluate(
            () => Array.from(
                document.querySelectorAll('a.card-title-link'),
                a => a.getAttribute('href')
            )
        )

        //visiting job link page in loop
        for(let j=0; j<jobsOnCurrPage.length; j++){
            let page2 = await browser.newPage()
            try{
                await page2.setViewport({width: 1800, height: 1080});
                await page2.goto(jobsOnCurrPage[j])


                //pulling apply button
                const applyNowButton = (await page2.$x("/html/body/div[3]/div[5]/div[2]/div[2]/div/div[2]/div[1]/dhi-wc-apply-button"))[0]

                await applyNowButton.click()

                const nextButton = await page2.waitFor('#app > div > span > div > div.step-one > div.navigation-buttons > button.btn.btn-primary.btn-next.btn-block')
                await nextButton.click()

                const applyButton = await page2.waitFor('#app > div > span > div > div.step-four > div.navigation-buttons > button.btn.btn-primary.btn-next.btn-split')
                await applyButton.click()

                console.log(`currently applying ${j} of ${jobsOnCurrPage.length} on page ${currPage}, job applied in total ${jobApplied}`)
                await page2.close()
                jobApplied = jobApplied + 1

            }catch(e){
                console.log('errored out', e)
                await page2.close()
            }
        }

        currPage = currPage + 1
        await reapply()

    }
    await reapply()

})()
