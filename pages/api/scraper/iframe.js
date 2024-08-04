import puppeteer from 'puppeteer'
import axios from 'axios'
import cheerio from 'cheerio'
import { setTimeout } from 'node:timers/promises'

export default async function handle(req, res) {
  const url = 'https://map.naver.com/p/search/%EC%B9%B4%ED%8E%98/place/37837603?c=13.00,0,0,3,dh&placePath=/home'
  // const url = 'https://data05.tistory.com/8'
  // const url = 'https://eopla.net/'

  // Puppeteer로 브라우저와 빈 페이지(탭) 객체 생성
  //   const browser = await puppeteer.launch({ headless: 'new' }) // await puppeteer.launch({ headless: false })
  console.log('1')

  // there is an issue with out-of-process frames, so you need to launch chromium with --disable-features=site-per-process
  const browser = await puppeteer.launch({ headless: false, args: ['--disable-features=site-per-process'] }) // await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  await page.setViewport({ width: 1440, height: 1024 }) // Set screen size

  // Custom user agent
  console.log('2')
  const customUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
  await page.setUserAgent(customUA) // Set custom user agent

  // Navigate the page to a URL
  console.log('3')
  await page.goto(url, { waitUntil: 'networkidle0' })

  // Select iFrame
  // const searchFrame = page.frames().find((frame) => frame.id() === 'searchIframe')
  // iframeSelector = 'iframe[name="myiframe"]' // would also work
  console.log('4')
  //   const iframeSelector = '.iframe-container iframe'; // for classes
  //   const iframeSelector = '#searchIframe' // for id
  const iframeSelector = 'iframe[id="searchIframe"]'
  const f = await page.waitForSelector(iframeSelector)
  const frame = await f.contentFrame()
  //   const frameContent = await frame.content() // good (getting html content)
  //   let buttonElement = await frame.waitForSelector('#_pcmap_list_scroll_container > ul > li:nth-child(1) > div.CHC5F > a') //good
  //   await buttonElement.click('.tzwk0') //good

  let divSelector = await frame.waitForSelector('#_pcmap_list_scroll_container')
  //   await iframe.evaluate(() => {
  //     window.scrollBy(0, 100) // Scrolling down by 100 pixels
  //   })

  await divSelector?.evaluate(async (el) => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0
      const distance = 100
      const timer = setInterval(() => {
        const scrollHeight = el.scrollHeight
        el.scrollBy(0, distance)
        totalHeight += distance
        if (totalHeight >= scrollHeight) {
          clearInterval(timer)
          resolve()
        }
      }, 100)
    })
  })
  //   console.log('buttonElement', buttonElement.innerHTML)
  // 아래 줄 good
  // await page.waitForSelector(iframeSelector, {
  //   visible: true
  // })
  //   const iframeElementHandle = await page.$(iframeSelector) // replace '#iframeId' with your iframe selector
  //   await iframeElementHandle.waitForSelector('#searchIframe')

  console.log('5') // 아래 두줄 good
  //   const iframe = await iframeElementHandle.contentFrame() // good
  //   const iframeContent = await iframe.content() // good (getting html content)

  // await browser.close()
}
