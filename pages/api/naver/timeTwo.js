import puppeteer from 'puppeteer'
import axios from 'axios'
import cheerio from 'cheerio'
import { setTimeout } from 'node:timers/promises'

export default async function handle(req, res) {
  //   const url = 'https://map.naver.com/p/search/%EC%B9%B4%ED%8E%98/place/1414125007?c=13.00,0,0,0,dh&placePath=%3Fentry%253Dbmp' // first landing page with list of blog urls
  const url = 'https://naver.me/G4WAHgeR' // first landing page with list of blog urls

  /**
   * 01. Create browser and blank page (tab) objects with Puppeteer
   * 02. There is an issue with out-of-process frames, so you need to launch chromium with --disable-features=site-per-process
   * 03. { headless: "new"} option doesn't open browser, but still conduct same crawling operation
   */
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--disable-features=site-per-process'],
    defaultViewport: null,
    args: [
      '--start-maximized' // you can also use '--start-fullscreen'
    ]
  })

  const page = await browser.newPage()

  // Custom user agent
  const customUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
  await page.setUserAgent(customUA)

  // Navigate the page to a URL
  await page.goto(url, { waitUntil: 'networkidle0' })

  //   // 1. 검색한 주소 기반
  //   await setTimeout(1000)
  //   await page.type('.input_search', '합정동 441-36')
  //   await setTimeout(1000)
  //   await page.keyboard.press('Enter')
  //   await setTimeout(2000)
  //   const clearBtn = await page.waitForSelector('.btn_clear')
  //   await setTimeout(1000)
  //   await clearBtn.click()

  //   const minusBtn = await page.waitForSelector('.btn_widget_zoom.zoom_out')
  //   await minusBtn.click()
  //   await setTimeout(1000)
  //   await minusBtn.click()

  //   const cafeBtnIndex = await page.evaluate(() => {
  //     const keywordTab = document.getElementsByClassName('item_bubble_keyword') // Index of "review button" can be different from time to time.
  //     for (let i = 0; i < keywordTab.length; i++) {
  //       if (keywordTab[i].innerText.includes('카페')) return i + 1 // Returns "review button" index from the menu tab
  //     }
  //   })
  //   console.log('cafeBtnIndex', cafeBtnIndex)

  //   let cafeBtn = await page.waitForSelector(`#app-layout > div.sc-wli0gr.gZQCQZ > div > div.sc-17rgyed.hHUuYe > ul > li:nth-child(${cafeBtnIndex})`) //good
  //   await setTimeout(1000)
  //   await cafeBtn.click()
  //   await setTimeout(1000)
  //   //   console.log('btnIndex', btnIndex)

  //   /** Select search list iFrame */
  //   const iframeSelector = 'iframe[id="searchIframe"]'
  //   const f = await page.waitForSelector(iframeSelector)
  //   const searchFrame = await f.contentFrame()

  //   /** Scroll down the list */
  //   // let divSelector = await searchFrame.waitForSelector('.Ryr1F')
  //   //   await divSelector?.evaluate(async (el) => {
  //   //     await new Promise((resolve, reject) => {
  //   //       let totalHeight = 0
  //   //       const distance = 100
  //   //       const timer = setInterval(() => {
  //   //         const scrollHeight = el.scrollHeight
  //   //         el.scrollBy(0, distance)
  //   //         totalHeight += distance
  //   //         if (totalHeight >= scrollHeight) {
  //   //           clearInterval(timer)
  //   //           resolve()
  //   //         }
  //   //       }, 100)
  //   //     })
  //   //   })

  //   /** Count the numbers of <li> element in <ul> element  */
  //   //   const listSelector = await searchFrame.waitForSelector(`#_pcmap_list_scroll_container > ul`)
  //   //   const list = await listSelector?.evaluate((el) => el.innerHTML)
  //   //   let listString = list.toString()
  //   //   const listLength = listString.split('</li>').length - 1 // -1 because it returns +1 value of the actual list length.
  //   //   console.log('listLength', listLength)

  //   let linkSelector = await searchFrame.waitForSelector(`#_pcmap_list_scroll_container > ul > li:nth-child(2) > div.CHC5F > a.tzwk0`)
  //   await setTimeout(1000)
  //   await linkSelector.click()
  //   await setTimeout(1000)

  /** Select search list iFrame */
  const f2 = await page.waitForSelector('iframe[id="entryIframe"]')
  const entryFrame = await f2.contentFrame()

  const timeBtn = await entryFrame.waitForSelector('.y6tNq')
  await setTimeout(1000)
  await timeBtn.click()

  //   // 필요없을듯
  //   const timeSelector = await entryFrame.waitForSelector(`.gKP9i.RMgN0`)
  //   const timeString = await timeSelector?.evaluate((el) => el.innerHTML)
  //   let timeString = timeString.toString()
  //   const timeLength = timeString.split('w9QyJ').length - 1 // -1 because it returns +1 value of the actual list length.
  //   console.log('timeLength', timeLength)

  const timeString = await entryFrame.evaluate(() => {
    let data = []
    const divs = document.querySelectorAll('.y6tNq')
    divs.forEach((div) => data.push(div.innerText))
    return data
  })
  //   res.status(200).json(timeString)

  let weeklySchedule = []
  let count = 0
  for (let i = 1; i < timeString.length; i++) {
    // console.log(`entered loop ${i}`)
    let dailySchedule = { day: '', hours: '', index: null }

    const check = days.findIndex((elem) => timeString[i].includes(elem))
    if (check < 0 && !timeString[i].includes('매일')) return

    console.log('passed')
    // if (!days.includes(timeString[i].substring(0, 1))) return

    if (timeString[i].includes('라스트오더')) {
      console.log('라스트오더')
      const str = timeString[i]
      const splitted = str.split('\n')
      dailySchedule.day = splitted[0] // '월'
      dailySchedule.hours = splitted[1] // "09:00 - 19:00"
      dailySchedule.lastOrder = splitted[2] // "09:00 - 19:00"
      const index = days.findIndex((elem) => splitted[0] === elem)
      dailySchedule.index = index // 0
      weeklySchedule.push(dailySchedule)
      console.log(`${weeklySchedule}`)
      //
    } else {
      //   console.log(`else 진입 ${i}`)
      const str = timeString[i]
      const splitted = str.split('\n')
      dailySchedule.day = splitted[0] // '월'
      dailySchedule.hours = splitted[1] // "09:00 - 19:00"
      const index = days.findIndex((elem) => splitted[0] === elem)
      dailySchedule.index = index // 0
      weeklySchedule.push(dailySchedule)
      console.log(`${weeklySchedule}`)
    }
    count++
    if (count === 6) break
  }
  const sortedSchedule = weeklySchedule.sort((a, b) => a.index - b.index)
  res.status(200).json(sortedSchedule)
}
const days = ['월', '화', '수', '목', '금', '토', '일']
