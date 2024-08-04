import puppeteer from 'puppeteer'
import axios from 'axios'
import cheerio from 'cheerio'
import { setTimeout } from 'node:timers/promises'

export default async function handle(req, res) {
  //   const url = 'https://map.naver.com/p/search/%EC%B9%B4%ED%8E%98/place/1414125007?c=13.00,0,0,0,dh&placePath=%3Fentry%253Dbmp' // first landing page with list of blog urls
  const url = 'https://map.naver.com/p?c=17.00,0,0,0,dh' // first landing page with list of blog urls

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

  // 1. 검색한 주소 기반
  await setTimeout(1000)
  await page.type('.input_search', '합정동 441-36')
  await setTimeout(1000)
  await page.keyboard.press('Enter')
  await setTimeout(2000)
  const clearBtn = await page.waitForSelector('.btn_clear')
  await setTimeout(1000)
  await clearBtn.click()

  const minusBtn = await page.waitForSelector('.btn_widget_zoom.zoom_out')
  await minusBtn.click()
  await setTimeout(1000)
  await minusBtn.click()

  const cafeBtnIndex = await page.evaluate(() => {
    const keywordTab = document.getElementsByClassName('item_bubble_keyword') // Index of "review button" can be different from time to time.
    for (let i = 0; i < keywordTab.length; i++) {
      if (keywordTab[i].innerText.includes('카페')) return i + 1 // Returns "review button" index from the menu tab
    }
  })
  console.log('cafeBtnIndex', cafeBtnIndex)

  let cafeBtn = await page.waitForSelector(`#app-layout > div.sc-wli0gr.gZQCQZ > div > div.sc-17rgyed.hHUuYe > ul > li:nth-child(${cafeBtnIndex})`) //good
  await setTimeout(1000)
  await cafeBtn.click()
  await setTimeout(1000)
  //   console.log('btnIndex', btnIndex)

  /** Select search list iFrame */
  const iframeSelector = 'iframe[id="searchIframe"]'
  const f = await page.waitForSelector(iframeSelector)
  const searchFrame = await f.contentFrame()

  /** Scroll down the list */
  let divSelector = await searchFrame.waitForSelector('.Ryr1F')
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

  /** Count the numbers of <li> element in <ul> element  */
  const listSelector = await searchFrame.waitForSelector(`#_pcmap_list_scroll_container > ul`)
  const list = await listSelector?.evaluate((el) => el.innerHTML)
  let listString = list.toString()
  const listLength = listString.split('</li>').length - 1 // -1 because it returns +1 value of the actual list length.
  console.log('listLength', listLength)

  let result = [] // Array to store inspected results.
  let startCount = 27 // If you want to inspect part of the entire blog urls, set startCount.

  for (let x = startCount; x < listLength; x++) {
    console.log('\n\n')
    console.log(`>>> START REVIEW DETECTION (idx: #${x})`)
    let shop = { name: '', hours: '', idx: null } // Obj that will save working hours result, and will be pushed into result array

    let linkSelector = await searchFrame.waitForSelector(`#_pcmap_list_scroll_container > ul > li:nth-child(${x + 1}) > div.CHC5F > a.tzwk0`)
    await setTimeout(1000)
    await linkSelector.click()
    await setTimeout(1000)

    /** Select search list iFrame */
    const f2 = await page.waitForSelector('iframe[id="entryIframe"]')
    const entryFrame = await f2.contentFrame()

    // const timeBtn = await entryFrame.waitForSelector('.y6tNq')
    // await setTimeout(1000)
    // await timeBtn.click()

    let checkTime = await entryFrame.evaluate(() => {
      let el = document.querySelector('.y6tNq')
      return el ? el.innerText : ''
    })

    if (checkTime === '') {
      console.log('undefined')
    } else {
      const timeBtn = await entryFrame.waitForSelector('.y6tNq')
      await setTimeout(1000)
      await timeBtn.click()
      const timeString = await entryFrame.evaluate(() => {
        let data = []
        const divs = document.querySelectorAll('.y6tNq')
        divs.forEach((div) => data.push(div.innerText))
        return data
      })
      //   res.status(200).json(timeString)

      let weeklySchedule = []
      let count = 0
      console.log('before loop')

      for (let i = 1; i < timeString.length; i++) {
        // console.log(`entered loop ${i}`)
        let dailySchedule = { day: '', hours: '', index: null }

        if (timeString[i].length < 1) return

        const check = days.findIndex((elem) => timeString[i].includes(elem))
        if (check < 0 && !timeString[i].includes('매일')) return
        // if (!days.includes(timeString[i].substring(0, 1))) return

        if (timeString[i].includes('매일')) {
          console.log('라스트오더')
          const str = timeString[i]
          const splitted = str.split('\n')
          dailySchedule.day = splitted[0] // '매일'
          dailySchedule.hours = splitted[1] // "09:00 - 19:00"
          if (timeString[i].includes('라스트오더')) {
            dailySchedule.lastOrder = splitted[2] // "09:00 - 19:00"
          }
          dailySchedule.index = 0 // 0
          weeklySchedule.push(dailySchedule)
          console.log(`${weeklySchedule}`)
          count = 6
        } else {
          console.log('라스트오더')
          const str = timeString[i]
          const splitted = str.split('\n')
          dailySchedule.day = splitted[0] // '월'
          dailySchedule.hours = splitted[1] // "09:00 - 19:00"
          if (timeString[i].includes('라스트오더')) {
            dailySchedule.lastOrder = splitted[2] // "09:00 - 19:00"
          }
          const index = days.findIndex((elem) => splitted[0] === elem)
          dailySchedule.index = index // 0
          weeklySchedule.push(dailySchedule)
          console.log(`${weeklySchedule}`)
          count++
        }
        if (count === 6) break
      }
      console.log('after loop')
      if (weeklySchedule.length > 1) {
        weeklySchedule = weeklySchedule.sort((a, b) => a.index - b.index)
      }
      console.log('1')
      shop['hours'] = weeklySchedule
      shop.idx = x
      console.log('2')
      // GHAhO
      const textSelector = await entryFrame.waitForSelector('.GHAhO')
      console.log('3')
      shop['name'] = await textSelector?.evaluate((el) => el.textContent)
      console.log('4')
      result.push(shop)
      console.log(shop)
    }
  }
  res.status(200).json(result)
}

const days = ['월', '화', '수', '목', '금', '토', '일']
