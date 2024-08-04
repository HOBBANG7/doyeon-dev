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
  const iframeSelector1 = 'iframe[id="searchIframe"]'
  const f1 = await page.waitForSelector(iframeSelector1)
  const searchIframe = await f1.contentFrame()
  //   const frameContent = await frame.content() // good (getting html content)
  //   let buttonElement = await frame.waitForSelector('#_pcmap_list_scroll_container > ul > li:nth-child(3) > div.CHC5F > a') //good
  //   await buttonElement.click('.tzwk0') //good

  let options = { button: 'middle' } //<- 이거가 휠로 누르는 것
  //   let listElement = await frame.waitForSelector(`#_pcmap_list_scroll_container > ul > li:nth-child(${i}) > div.CHC5F > a`) //good
  let listElement = await searchIframe.waitForSelector(`#_pcmap_list_scroll_container > ul > li:nth-child(4) > div.CHC5F > a`) //good
  await setTimeout(3000)
  await listElement.click()
  await setTimeout(1000)

  // 이제 상세페이지 iFrame 선택해야 함.
  const iframeSelector2 = 'iframe[id="entryIframe"]'
  const f2 = await page.waitForSelector(iframeSelector2)
  const entryFrame = await f2.contentFrame()
  let reviewBtn = await entryFrame.waitForSelector(`#app-root > div > div > div > div.place_fixed_maintab > div > div > div > div > a:nth-child(4)`) //good
  await setTimeout(1000)
  await reviewBtn.click()
  await setTimeout(1000)

  let blogBtn = await entryFrame.waitForSelector(`#_subtab_view > div > a:nth-child(2)`) //good
  await setTimeout(1000)
  await blogBtn.click()
  await setTimeout(1000)

  //   let layoutBtn = await entryFrame.waitForSelector(`#app-root > div > div > div > div:nth-child(6) > div:nth-child(3) > div > h2 > div > a:nth-child(2)`) //good
  //   await setTimeout(1000)
  //   await layoutBtn.click()
  //   await setTimeout(1000)

  let recentBtn = await entryFrame.waitForSelector(`#app-root > div > div > div > div:nth-child(6) > div:nth-child(3) > div > div.place_section_content > div > div > div.hyyeh > span:nth-child(2)`) //good
  await setTimeout(1000)
  await recentBtn.click()
  await setTimeout(1000)

  let dateSelector, lastDate
  let foo = true
  while (foo) {
    dateSelector = await entryFrame.waitForSelector(`#app-root > div > div > div > div:nth-child(6) > div:nth-child(3) > div > div.place_section_content > ul > li:nth-last-child(1) > a > div.kT8X8 > div.FYQ74 > span:nth-child(1)`) //good
    lastDate = await dateSelector?.evaluate((el) => el.textContent)
    let month = lastDate.substring(3, 4)
    console.log('lastDate', lastDate)
    if (parseInt(month) > 5) {
      await entryFrame.evaluate(async () => {
        window.scrollTo(0, document.body.scrollHeight)
      })
      await setTimeout(1000)
      let loadBtn = await entryFrame.waitForSelector(`#app-root > div > div > div > div:nth-child(6) > div:nth-child(3) > div > div.NSTUp > div > a`) //good
      await setTimeout(1000)
      await loadBtn.click()
      await setTimeout(1000)
    } else {
      console.log('break!')
      foo = false
      // exit condition met
      break
    }
  }

  const firstSelector = await entryFrame.waitForSelector(`#app-root > div > div > div > div:nth-child(6) > div:nth-child(3) > div > div.place_section_content > ul > li:nth-child(1) > a`) //good
  await firstSelector.click(options)

  //   await entryFrame.evaluate(async () => {
  //     window.scrollTo(0, document.body.scrollHeight)
  //   })

  //   let
  //   const
  //   res.status(200).json(lastDate)

  //   let divSelector = await entryFrame.waitForSelector('.place_section_content')

  //   await divSelector?.evaluate(async (el) => {
  //     await new Promise((resolve, reject) => {
  //       let totalHeight = 0
  //       const distance = 100
  //       const timer = setInterval(() => {
  //         const scrollHeight = el.scrollHeight
  //         el.scrollBy(0, distance)
  //         totalHeight += distance
  //         if (totalHeight >= scrollHeight) {
  //           clearInterval(timer)
  //           resolve()
  //         }
  //       }, 100)
  //     })
  //   })

  //   await divSelector?.evaluate(async (el) => {
  //     await new Promise((resolve, reject) => {
  //       let totalHeight = 0
  //       const distance = 100
  //       const timer = setInterval(() => {
  //         const scrollHeight = el.scrollHeight
  //         el.scrollBy(0, distance)
  //         totalHeight += distance
  //         if (totalHeight >= scrollHeight) {
  //           clearInterval(timer)
  //           resolve()
  //         }
  //       }, 100)
  //     })
  //   })

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
