const puppeteer = require("puppeteer");
const path = require('path');
const browserOptions = {
    headless: true,
    ignoreHTTPSErrors: true,
}

let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch(browserOptions);
    page = await browser.newPage();
    await page.goto('file://' + path.resolve('./index.html'));
}, 30000);

afterAll((done) => {
    try {
        this.puppeteer.close();
    } catch (e) { }
    done();
});

describe('Semantic elements', () => {
    it("Page Should contain semantic html tags", async () => {
        const semanticTags = await page.$('article, section, nav, aside, cite, ul, li, footer');
        expect(semanticTags).toBeTruthy();
    });
    it("Page Should use heading tags for headings", async () => {
        const headings = await page.$('h1, h2');
        expect(headings).toBeTruthy();
    });
    it("Page Should use paragraph tags for paragraphs", async () => {
        const ps = await page.$('p');
        expect(ps).toBeTruthy();
    });
});

describe('Meta tags', () => {
    it("head tag should contain a `charset` meta tag", async () => {
        const head = await page.$eval('head', el => el.innerHTML);
        expect(head).toMatch(/<meta charset/i);
    });
    it("head tag should contain a `viewport` meta tag", async () => {
        const head = await page.$eval('head', el => el.innerHTML);
        expect(head).toMatch(/<meta name="viewport"/i);
    });
    it("head tag should contain a title tag", async () => {
        const head = await page.$eval('head', el => el.innerHTML);
        expect(head).toMatch(/<title>.*<\/title>/i);
    });
})

describe('Links', () => {
    it("Page should contain at least one link referencing an external resource", async () => {
        const externalLinks = await page.$$eval('a', el => el.filter(el => el.href.includes('https://')));
        expect(externalLinks.length).toBeTruthy()
    });
})

describe('Styling', () => {
    it("CSS styling should be applied to elements on the page", async () => {
        const styles = await page.$('link[rel="stylesheet"], *[style]')
        expect(styles).toBeTruthy()
    });
})
