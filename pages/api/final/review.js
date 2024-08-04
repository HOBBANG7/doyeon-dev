import puppeteer from 'puppeteer'
import axios from 'axios'
import cheerio from 'cheerio'
import { setTimeout } from 'node:timers/promises'

export default async function handle(req, res) {
  // Init google cloud vision
  const vision = require('@google-cloud/vision')
  const client = new vision.ImageAnnotatorClient({ keyFilename: process.env.GOOGLE_API_JSON })

  const url = 'https://map.naver.com/p/entry/place/1947170937?placePath=%2Fhome&c=15.00,0,0,0,dh' // first landing page with list of blog urls

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

  // Set screen size
  // await page.setViewport({ width: 1440, height: 1024 })

  // Custom user agent
  const customUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
  await page.setUserAgent(customUA)

  // Navigate the page to a URL
  await page.goto(url, { waitUntil: 'networkidle0' })

  // Select iFrame (Our target html is placed inside an iFrame)
  const iframeSelector = 'iframe[id="entryIframe"]'
  const f = await page.waitForSelector(iframeSelector)
  const entryFrame = await f.contentFrame()

  const btnIndex = await entryFrame.evaluate(() => {
    const menuTab = document.getElementsByClassName('_tab-menu') // Index of "review button" can be different from time to time.
    for (let i = 0; i < menuTab.length; i++) {
      if (menuTab[i].innerText.includes('리뷰')) return i + 1 // Returns "review button" index from the menu tab
    }
  })
  //   console.log('btnIndex', btnIndex)

  let reviewBtn = await entryFrame.waitForSelector(`#app-root > div > div > div > div.place_fixed_maintab > div > div > div > div > a:nth-child(${btnIndex})`) //good
  await setTimeout(1000)
  await reviewBtn.click()
  await setTimeout(1000)

  let blogBtn = await entryFrame.waitForSelector(`#_subtab_view > div > a:nth-child(2)`) //good
  await setTimeout(1000)
  await blogBtn.click()
  await setTimeout(1000)

  let layoutBtn = await entryFrame.waitForSelector(`#app-root > div > div > div > div:nth-child(6) > div:nth-child(3) > div > h2 > div > a:nth-child(2)`) //good
  await setTimeout(1000)
  await layoutBtn.click()
  await setTimeout(1000)

  let recentBtn = await entryFrame.waitForSelector(`#app-root > div > div > div > div:nth-child(6) > div:nth-child(3) > div > div.place_section_content > div > div > div.hyyeh > span:nth-child(2)`) //good
  await setTimeout(1000)
  await recentBtn.click()
  //   await setTimeout(1000)

  /* Load current 6 months of blog reviews */
  let dateSelector, firstDate, lastDate
  let loadMore = true
  let loadCount = 0

  const firstDateSelector = await entryFrame.waitForSelector(`#app-root > div > div > div > div:nth-child(6) > div:nth-child(3) > div > div.place_section_content > ul > li:nth-child(1) > a > div.sDBiR > span.BB1G2 > time`) //
  firstDate = await firstDateSelector?.evaluate((el) => el.textContent)

  while (loadMore && loadCount < 1) {
    // Used li:nth-last-child(1) to select the last <li> element
    dateSelector = await entryFrame.waitForSelector(`#app-root > div > div > div > div:nth-child(6) > div:nth-child(3) > div > div.place_section_content > ul > li:nth-last-child(1) > a > div.sDBiR > span.BB1G2 > time`) //
    await setTimeout(1000)

    let loadBtn = await entryFrame.waitForSelector(`#app-root > div > div > div > div:nth-child(6) > div:nth-child(3) > div > div.NSTUp > div > a`) //good
    await setTimeout(1000)

    lastDate = await dateSelector?.evaluate((el) => el.textContent)
    let month = lastDate.substring(3, 4)
    console.log('lastDate', lastDate)

    if (parseInt(month) > 4 && loadBtn) {
      await entryFrame.evaluate(async () => {
        window.scrollTo(0, document.body.scrollHeight) // Scroll to bottom to click "load more button"
      })
      await loadBtn.click()
      await setTimeout(1000)
    } else {
      console.log('break!')
      loadMore = false // If last blog's posted date is outdated, do not load anymore and break
      // Exit condition met
      break
    }
    loadCount = loadCount + 1 // +1 loadCount equals to 10 more blog postings loaded.
  }

  /** Count the numbers of <li> element in <ul> element  */
  const listSelector = await entryFrame.waitForSelector(`#app-root > div > div > div > div:nth-child(6) > div:nth-child(3) > div > div.place_section_content > ul`)
  const list = await listSelector?.evaluate((el) => el.innerHTML)
  let listString = list.toString()
  const listLength = listString.split('</li>').length - 1 // -1 because it returns +1 value of the actual list length.
  console.log('listLength', listLength)

  let result = [] // Array to store inspected results.
  let startCount = 0 // If you want to inspect part of the entire blog urls, set startCount.

  for (let x = startCount; x < listLength; x++) {
    console.log('\n\n')
    console.log(`>>> START REVIEW DETECTION (idx: #${x})`)

    let data = { url: '', isReview: false, reviewPlatform: '', idx: null } // Obj that will save inspected result, and will be pushed into result array
    let continueSearch = true
    let linkSelector = await entryFrame.waitForSelector(`#app-root > div > div > div > div:nth-child(6) > div:nth-child(3) > div > div.place_section_content > ul > li:nth-child(${x + 1}) > a`)
    await setTimeout(1000)

    // 두번째 페이지를 연다
    let page2 = await browser.newPage()
    await page2.setViewport({ width: 1440, height: 1024 }) // Set screen size

    // Custom user agent
    await page2.setUserAgent(customUA) // Set custom user agent

    let href = await linkSelector.evaluate((element) => element.href)
    console.log(`ㄴ URL: ${href}`)
    data.url = href
    data.idx = x + 1

    await page2.goto(href, { waitUntil: 'networkidle0' })
    let frameDocument
    let html = await page2.evaluate(() => {
      frameDocument = document.querySelector('iframe[id=mainFrame]').contentWindow.document // this is the solution
      const videoMessage = frameDocument.querySelector('div.se-main-container') // just for checking that we can access elements
      return videoMessage.innerHTML.toString()
    })
    html = html.replace(/\s/g, '')

    // await setTimeout(1000)

    if (html !== undefined) {
      /** STEP 1 */

      console.log(`[1] START HTML SEARCH (idx: ${x})`)
      for (let i = 0; i < reviewPlatform.length; i++) {
        const index = reviewPlatform.findIndex((elem) => html.includes(elem.key))
        if (index > 0) {
          console.log(`[1] TEXT DETECTED! "${reviewPlatform[i].name}" (HTML SEARCH from #${i})`)

          if (realReview.includes(reviewPlatform[index].key)) {
            data.reviewPlatform = `${reviewPlatform[index].name}`
          } else {
            data.isReview = true
            data.reviewPlatform = `${reviewPlatform[index].name}`
          }
          continueSearch = false
          break
        }
        // console.log(`HTML Search #${i}: 0 RESULT`) // 자리 너무 많이 차지
      }

      /** STEP 2 */
      let str = ''
      if (continueSearch) {
        console.log('[1] RETULT: 0 DETECTED')
        console.log('...')
        console.log(`[2] START OCR SEARCH PART1 (idx: ${x})`)
        // OCR START
        console.log(`[2] BEGIN IMAGE OCR (블로그 #${x})`)
        let frame = page2.frames().find((frame) => frame.name() === 'mainFrame')
        await setTimeout(2000)
        const imgs = await frame.$$eval('.se-component-content img[src]', (imgs) => imgs.map((img) => img.getAttribute('src')))
        await setTimeout(1000)
        // console.log('(02) RETREIVED LAST IMAGE IN HTML (OCR #1)')
        const [result] = await client.textDetection(imgs[imgs.length - 1])
        const annotations = result?.textAnnotations
        for (let x = 0; x < annotations.length; x++) {
          str = str + annotations[x].description
          // console.log(annotations[x].description)
        }
        str = str.replace(/\s/g, '')
        console.log(`[2] OCR COMPLETED : ${str}`)
        console.log(`[2] Running text detection...... (OCR #1 / 블로그 #${x})`)
        // OCR END

        for (let j = 0; j < reviewPhrase.length; j++) {
          const index = reviewPhrase.findIndex((elem) => str.includes(elem.key))

          if (index > 0) {
            console.log(`[2] TEXT DETECTED! "${reviewPhrase[index].key}" (OCR #1 / 블로그 #${x})`)
            if (realReview.includes(reviewPhrase[index].key)) {
              data.reviewPlatform = `${reviewPhrase[index].name}`
            } else {
              data.isReview = true
              data.reviewPlatform = `${reviewPhrase[index].name}`
            }
            continueSearch = false
            break
          }
          //   else {
          //     console.log(`* OCR SEARCH #${i}: 0 RESULT`)
          //     // console.log('* (OCR #1) SEARCH RESULT: 0 DETECTED')
          //   }
        }
      }

      /** STEP 3 */
      if (continueSearch) {
        console.log('[2] RETULT: 0 DETECTED')
        console.log('...')
        console.log(`[3] START OCR SEARCH PART2 (idx: ${x})`)
        console.log(`[3] Running text detection......`)
        for (let k = 0; k < reviewPlatform.length; k++) {
          // OCR START
          const index = reviewPlatform.findIndex((elem) => str.includes(elem.key))
          if (index > 0) {
            console.log(`[3] TEXT DETECTED: "${reviewPlatform[index].name}" (OCR #2 / 블로그 #${x})`)
            if (realReview.includes(reviewPlatform[index].key)) {
              data.reviewPlatform = `${reviewPlatform[index].name}`
            } else {
              data.isReview = true
              data.reviewPlatform = `${reviewPlatform[index].name}`
            }
            continueSearch = false
            break
          } else {
            console.log('[3] FINAL RESULT: 이 글은 내돈내산 포스팅입니다')
            continueSearch = false
            data.reviewPlatform = `내돈내산`
            break
          }
          // OCR END
        }
      }

      result.push(data)
      await page2.close()
    } else {
      await page2.close()
    }
    // await page.bringToFront()
    // await page.waitForNavigation()
  }
  let reviewCount = result.filter((item) => {
    return item.isReview === true // filter review if true
    // return item.reviewPlatform === '내돈내산' // filter review if true
  })
  console.log('reviewCount', reviewCount)

  res
    .status(200)
    .json({ 기간: `${lastDate} - ${firstDate}`, 검사포스팅수: `${listLength - startCount}개`, 리뷰갯수: `${reviewCount.length}개`, 리뷰비율: `${Math.floor((reviewCount.length / (listLength - startCount)) * 100)}%`, 상세결과: result })
  //   if (isReview === false) {
  //     res.status(200).json('이 글은 내돈내산 글입니다.')
  //   } else {
  //     res.status(200).json(`이 글은 ${reviewPlatform[platformIndex].name} 리뷰입니다.`)
  //   }
}

const reviewPlatform = [
  { key: '내돈내산', name: '내돈내산' },
  { key: '내돈내먹', name: '내돈내산' },
  { key: 'cometoplay', name: '놀러와체험단' },
  { key: 'dailyview', name: '데일리뷰' },
  { key: 'revu', name: '레뷰' },
  { key: 'reviewnote', name: '리뷰노트' },
  { key: 'reviewerlab', name: '리뷰어랩' },
  { key: 'reviewjin', name: '리뷰진' },
  { key: 'reviewplace', name: '리뷰플레이스' },
  { key: 'dinnerqueen', name: '디너의여왕' },
  { key: 'blogmall', name: '미블' },
  { key: 'mrblog', name: '미블' },
  { key: 'ringble', name: '링블' },
  { key: 'seoulouba', name: '서울오빠' },
  { key: 'd3i7y4ugnppb9p', name: '슈퍼멤버스' },
  { key: 'storyn', name: '스토리앤미디어' },
  { key: 'assaview', name: '아싸뷰' },
  { key: 'kormedia', name: '오마이블로그' },
  { key: 'chehumdan', name: '체험단닷컴' },
  { key: 'chvu', name: '체험뷰' },
  { key: 'cloudreview', name: '클라우드리뷰' },
  { key: 'tble', name: '티블' },
  { key: '4blog', name: '포블로그' },
  { key: 'xn--939au0g4vj8sq', name: '강남맛집' },
  { key: '강남맛집', name: '강남맛집' }
  //   { key: '체험단', name: '체험단' },
  //   { key: '소정의 제품', name: '제품을 지급받은' },
  //   { key: '소정의 수수료', name: '수수료를 지급받은' },
  //   { key: '소정의 서비스', name: '서비스를 지급받은' },
  //   { key: '제공받고', name: '대가를 지급받은' },
  //   { key: '제공받아', name: '대가를 지급받은' }
  // { key: '원고료', name: '원고료를 지급받은 글', type: 'etc' },
  // { key: '서비스', name: '서비스를 지급받은 글', type: 'etc' },
  // { key: '식사권', name: '식사권를 지급받은 글', type: 'etc' },
  // { key: '수수료', name: '수수료를 지급받은 글', type: 'etc' }

  // { key: '내산', name: '내돈내산' }
]

const reviewPhrase = [
  //   { key: '소정의 제품', name: '제품을 지급받은' },
  //   { key: '소정의 수수료', name: '수수료를 지급받은' },
  //   { key: '소정의 서비스', name: '서비스를 지급받은' },
  //   { key: '제공받고', name: '대가를 지급받은' },
  //   { key: '제공받아', name: '대가를 지급받은' },
  { key: '내돈내산', name: '내돈내산' },
  { key: '내돈내먹', name: '내돈내산' },
  { key: '원고료', name: '원고료를 지급받은 글', type: 'etc' },
  { key: '서비스', name: '서비스를 지급받은 글', type: 'etc' },
  { key: '식사권', name: '식사권를 지급받은 글', type: 'etc' },
  { key: '수수료', name: '수수료를 지급받은 글', type: 'etc' }
]

const realReview = ['내돈내산', '내돈내먹']
