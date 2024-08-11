/*global chrome*/

// import puppeteer from 'puppeteer'
// import axios from 'axios'
// import cheerio from 'cheerio'
import { setTimeout } from 'node:timers/promises'
import { GoogleAuth } from 'google-auth-library'
// import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(req, res) {
  // Init google cloud vision
  //   const puppeteer = require('puppeteer')
  const vision = require('@google-cloud/vision')
  const chromium = require('@sparticuz/chromium-min')
  const puppeteer = require('puppeteer-core')

  const credentials = JSON.parse(process.env.GOOGLE_CLOUDVISON_API_KEY)
  const auth = new GoogleAuth({ credentials })
  const client = new vision.ImageAnnotatorClient({ auth })
  //    const url = 'https://blog.naver.com/studiolettuce/223536017697' // first landing page with list of blog urls
  //   'http://localhost:3000/api/final/reviewUrl/?url=https://blog.naver.com/studiolettuce/223536017697'
  const {
    query: { name, url },
    method
  } = req
  //   console.log(name, url, method)

  //   const puppeteer = require('puppeteer-core')

  // then you can do something with the returned browser
  // in your serverless function 👇
  const browser = await puppeteer.launch({
    args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(`https://github.com/Sparticuz/chromium/releases/download/v123.0.1/chromium-v123.0.1-pack.tar`),
    // executablePath: await chromium.executablePath(`https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar`),

    //   headless: chromium.headless,
    headless: true,
    ignoreHTTPSErrors: true
  })

  const page = await browser.newPage()

  // Set screen size
  // await page.setViewport({ width: 1440, height: 1024 })

  // Custom user agent
  const customUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
  await page.setUserAgent(customUA)

  // Navigate the page to a URL
  await page.goto(url, { waitUntil: 'networkidle0' })

  let frameDocument
  let html = await page.evaluate(() => {
    frameDocument = document.querySelector('iframe[id=mainFrame]').contentWindow.document // this is the solution
    const videoMessage = frameDocument.querySelector('div.se-main-container') // just for checking that we can access elements
    return videoMessage.innerHTML.toString()
  })
  html = html.replace(/\s/g, '')

  // await setTimeout(1000)
  let continueSearch = true
  let data = { url: '', isReview: false, reviewPlatform: '' } // Obj that will save inspected result, and will be pushed into result array

  if (html !== undefined) {
    /** STEP 1 */

    console.log(`[1] START HTML SEARCH`)
    for (let i = 0; i < reviewPlatform.length; i++) {
      const index = reviewPlatform.findIndex((elem) => html.includes(elem.key))
      if (index > 0) {
        console.log(`[1] TEXT DETECTED! "${reviewPlatform[i].name}"`)

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
      console.log(`[2] START OCR SEARCH PART1`)
      // OCR START
      console.log(`[2] BEGIN IMAGE OCR`)
      let frame = page.frames().find((frame) => frame.name() === 'mainFrame')
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
      console.log(`[2] Running text detection...... (OCR #1)`)
      // OCR END

      for (let j = 0; j < reviewPhrase.length; j++) {
        const index = reviewPhrase.findIndex((elem) => str.includes(elem.key))

        if (index > 0) {
          console.log(`[2] TEXT DETECTED! "${reviewPhrase[index].key}" (OCR #1)`)
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
      console.log(`[3] START OCR SEARCH PART2`)
      console.log(`[3] Running text detection......`)
      for (let k = 0; k < reviewPlatform.length; k++) {
        // OCR START
        const index = reviewPlatform.findIndex((elem) => str.includes(elem.key))
        if (index > 0) {
          console.log(`[3] TEXT DETECTED: "${reviewPlatform[index].name}" (OCR #2)`)
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
    data.url = url
    const obj = {
      items: [data]
    }
    res.status(200).json(obj)
    await page.close()
  } else {
    await page.close()
  }
}

/**
 * 01. Create browser and blank page (tab) objects with Puppeteer
 * 02. There is an issue with out-of-process frames, so you need to launch chromium with --disable-features=site-per-process
 * 03. { headless: "new"} option doesn't open browser, but still conduct same crawling operation
 */
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
