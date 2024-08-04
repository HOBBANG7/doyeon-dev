import puppeteer from 'puppeteer'
import axios from 'axios'
import cheerio from 'cheerio'
import { setTimeout } from 'node:timers/promises'

export default async function handle(req, res) {
  const vision = require('@google-cloud/vision')

  const client = new vision.ImageAnnotatorClient({
    keyFilename: 'utils/dykim-281905-7c71bf7fc5ac.json'
  })
  //   const url = 'https://map.naver.com/p/search/%EC%B9%B4%ED%8E%98/place/37837603?c=13.00,0,0,3,dh&placePath=/home'
  //   const url = 'https://naver.me/IMR6G87Q'
  let firstDate
  const url = 'https://naver.me/5ux2jPJl'
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

  // 이제 상세페이지 iFrame 선택해야 함.
  const iframeSelector2 = 'iframe[id="entryIframe"]'
  const f2 = await page.waitForSelector(iframeSelector2)
  const entryFrame = await f2.contentFrame()

  const bar = await entryFrame.evaluate(() => {
    const myElement = document.querySelector('.flicking-camera')
    const siteAvatars = document.getElementsByClassName('_tab-menu')
    for (let i = 0; i < siteAvatars.length; i++) {
      if (siteAvatars[i].innerText.includes('리뷰')) return i + 1
      // var sa = siteAvatars[i];
      // var a = sa.querySelector(".avatar");
      // console.log(a);
    }
  })
  console.log('bar', bar) // will print in the console "blah blah blah"

  let reviewBtn = await entryFrame.waitForSelector(`#app-root > div > div > div > div.place_fixed_maintab > div > div > div > div > a:nth-child(${bar})`) //good
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
  let dateSelector, lastDate
  let foo = true
  let loadMore = true
  let loadCount = 0
  const firstDateSelector = await entryFrame.waitForSelector(`#app-root > div > div > div > div:nth-child(6) > div:nth-child(3) > div > div.place_section_content > ul > li:nth-child(1) > a > div.sDBiR > span.BB1G2 > time`) //
  firstDate = await firstDateSelector?.evaluate((el) => el.textContent)

  while (foo && loadMore && loadCount < 1) {
    // dateSelector = await entryFrame.waitForSelector(`#app-root > div > div > div > div:nth-child(6) > div:nth-child(3) > div > div.place_section_content > ul > li:nth-last-child(1) > a > div.kT8X8 > div.FYQ74 > span:nth-child(1)`) // view1 good
    dateSelector = await entryFrame.waitForSelector(`#app-root > div > div > div > div:nth-child(6) > div:nth-child(3) > div > div.place_section_content > ul > li:nth-last-child(1) > a > div.sDBiR > span.BB1G2 > time`) //
    await setTimeout(1000)

    let loadBtn = await entryFrame.waitForSelector(`#app-root > div > div > div > div:nth-child(6) > div:nth-child(3) > div > div.NSTUp > div > a`) //good
    await setTimeout(1000)

    lastDate = await dateSelector?.evaluate((el) => el.textContent)
    let month = lastDate.substring(3, 4)
    console.log('lastDate', lastDate)
    if (parseInt(month) > 6 && loadBtn) {
      await entryFrame.evaluate(async () => {
        window.scrollTo(0, document.body.scrollHeight)
      })
      await loadBtn.click()
      await setTimeout(1000)
    } else {
      console.log('break!')
      loadMore = false
      foo = false
      // exit condition met
      break
    }
    loadCount = loadCount + 1
  }

  /////

  /** Count the numbers of <li> element in <ul> element  */

  const listSelector = await entryFrame.waitForSelector(`#app-root > div > div > div > div:nth-child(6) > div:nth-child(3) > div > div.place_section_content > ul`)
  const list = await listSelector?.evaluate((el) => el.innerHTML)
  let listString = list.toString()
  const listLength = listString.split('</li>').length - 1 // +1로 나옴
  console.log('listLength', listLength)
  //   res.status(200).json(listLength)
  let result = []
  console.log('before!')

  let startCount = 10
  //   let startCount = 0

  for (let x = startCount; x < listLength; x++) {
    console.log('**********************************************************************')
    console.log('**********************************************************************')
    console.log(`>>>>>>>>>>>> START REVIEW DETECTION #${x} <<<<<<<<<<<<`)

    let data = { url: '', isReview: false, reviewPlatform: '', idx: null }
    let platformIndex
    let continueSearch = true
    let firstSelector = await entryFrame.waitForSelector(`#app-root > div > div > div > div:nth-child(6) > div:nth-child(3) > div > div.place_section_content > ul > li:nth-child(${x + 1}) > a`)
    //   const firstSelector = await entryFrame.waitForSelector(`#app-root > div > div > div > div:nth-child(6) > div:nth-child(3) > div > div.place_section_content > ul > li:nth-child(1) > a > div`)
    await setTimeout(1000)

    //   await firstSelector.click()

    ///////////

    // 두번째 페이지를 연다
    let page2 = await browser.newPage()
    await page2.setViewport({ width: 1440, height: 1024 }) // Set screen size

    // Custom user agent
    await page2.setUserAgent(customUA) // Set custom user agent

    let href = await firstSelector.evaluate((element) => element.href)
    console.log(`블로그 ${x} : ${href}`)
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

      console.log(`>>>>>> [1] START HTML SEARCH #${x}`)
      for (let i = 0; i < reviewPlatform.length; i++) {
        const index = reviewPlatform.findIndex((elem) => html.includes(elem.key))
        if (index > 0) {
          console.log(`*** TEXT DETECTED! "${reviewPlatform[i].name}" (HTML SEARCH from #${i})`)

          if (realReview.includes(reviewPhrase[index].name)) {
            data.reviewPlatform = `${reviewPlatform[index].name}`
          } else {
            data.isReview = true
            data.reviewPlatform = `${reviewPlatform[index].name}`
          }
          continueSearch = false
          break
        }
        // console.log(`HTML Search #${i}: 0 RESULT`) // 자리 너무 많이 차지

        // if (html.includes(reviewPlatform[i].key)) {
        //   // if (html.indexOf(reviewPlatform[i].key) > 0) {
        //   //   console.log(`>>> Text Search #${i}: SUCCESSFUL`)

        //   console.log(`>>>    TEXT DETECTED: "${reviewPlatform[i].name}" (HTML SEARCH from #${i})`)
        //   platformIndex = i
        //   if (reviewPlatform[i].name === '내돈내산') {
        //     data.reviewPlatform = `${reviewPlatform[platformIndex].name}`
        //   } else {
        //     data.isReview = true
        //     data.reviewPlatform = `${reviewPlatform[platformIndex].name}`
        //   }
        //   continueSearch = false
        //   break
        // }
        // console.log(`HTML Search #${i}: 0 RESULT`)
      }

      /** STEP 2 */
      let str = ''
      if (continueSearch) {
        console.log('(HTML SEARCH: 0 DETECTED)')
        console.log(`>>>>>> [2] START OCR SEARCH PART1 #${x} <<<<<<`)

        // OCR START
        console.log('(01) BEGIN IMAGE OCR (OCR #1)')
        let frame = page2.frames().find((frame) => frame.name() === 'mainFrame')
        await setTimeout(2000)
        const imgs = await frame.$$eval('.se-component-content img[src]', (imgs) => imgs.map((img) => img.getAttribute('src')))
        await setTimeout(1000)
        console.log('(02) RETREIVED LAST IMAGE IN HTML (OCR #1)')
        const [result] = await client.textDetection(imgs[imgs.length - 1])
        const annotations = result?.textAnnotations
        for (let x = 0; x < annotations.length; x++) {
          str = str + annotations[x].description
          // console.log(annotations[x].description)
        }
        str = str.replace(/\s/g, '')
        console.log(`(03) OCR RESULT: ${str} (OCR #1)`)
        console.log('(04) IMAGE OCR FINISHED. BEGIN TEXT DETECTION (OCR #1)')
        // OCR END

        for (let j = 0; j < reviewPhrase.length; j++) {
          const index = reviewPhrase.findIndex((elem) => str.includes(elem.key))

          if (index > 0) {
            console.log(`*** TEXT DETECTED! "${reviewPhrase[index].key}" (OCR #1)`)
            if (realReview.includes(reviewPhrase[index].name)) {
              data.reviewPlatform = `${reviewPhrase[index].name}`
            } else {
              data.isReview = true
              data.reviewPlatform = `${reviewPlatform[index].name}`
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
        console.log('>>>>>> OCR SEARCH PART1: 0 DETECTED <<<<<<')
        console.log('...')
        console.log(`>>>>>> START OCR SEARCH PART2 #${x} <<<<<<`)

        for (let k = 0; k < reviewPlatform.length; k++) {
          // OCR START
          const index = reviewPlatform.findIndex((elem) => str.includes(elem.key))
          if (index > 0) {
            console.log(`>>>>>> TEXT DETECTED: "${reviewPlatform[index].name}" (OCR #2)`)
            if (realReview.includes(reviewPlatform[index].name)) {
              data.reviewPlatform = `${reviewPlatform[index].name}`
            } else {
              data.isReview = true
              data.reviewPlatform = `${reviewPlatform[index].name}`
            }
            continueSearch = false
            break
          } else {
            console.log('>>>>>> FINAL RESULT: 이 글은 내돈내산 포스팅입니다')
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
    .json({ 기간: `${firstDate}~${lastDate}`, 전체포스팅수: `${listLength - startCount}개`, 리뷰갯수: `${reviewCount.length}개`, 리뷰비율: `${Math.floor((reviewCount.length / (listLength - startCount)) * 100)}%`, result: result })
  //   if (isReview === false) {
  //     res.status(200).json('이 글은 내돈내산 글입니다.')
  //   } else {
  //     res.status(200).json(`이 글은 ${reviewPlatform[platformIndex].name} 리뷰입니다.`)
  //   }
}

const reviewPlatform = [
  { key: '내돈내산', name: '내돈내산' },
  { key: '내돈내먹', name: '내돈내먹' },
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
  { key: '내돈내먹', name: '내돈내먹' },
  { key: '원고료', name: '원고료를 지급받은 글', type: 'etc' },
  { key: '서비스', name: '서비스를 지급받은 글', type: 'etc' },
  { key: '식사권', name: '식사권를 지급받은 글', type: 'etc' },
  { key: '수수료', name: '수수료를 지급받은 글', type: 'etc' }
]

const realReview = ['내돈내산', '내돈내먹']
