const puppeteer = require('puppeteer');

async function fetchVideoDescription(url) {
    let description = '';

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2' });

        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            description = await page.evaluate(() => {
                const descElement = document.querySelector('#description-inline-expander');
                if (descElement) {
                    const spanElement = descElement.querySelector('span');
                    return spanElement ? spanElement.innerText : 'No description available';
                }
                return 'No description available';
            });
        } else if (url.includes('dailymotion.com')) {
            description = await page.evaluate(() => {
                const descElement = document.querySelector('.VideoDescription.description');
                return descElement ? descElement.innerText : 'No description available';
            });
        }

        await browser.close();
    } catch (error) {
        console.error("Error fetching video description:", error);
    }

    return description;
}

module.exports = fetchVideoDescription;
