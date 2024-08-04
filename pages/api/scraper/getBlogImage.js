import puppeteer from 'puppeteer'

export default async function handle(req, res) {
  //   const cheerio = require('cheerio')
  //   const sanitizeHtml = require('sanitize-html')
  console.log('1')
  let datas = []

  // Puppeteer로 브라우저와 빈 페이지(탭) 객체 생성
  // const browser = await puppeteer.launch()
  const browser = await puppeteer.launch({ headless: false }) // await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.setViewport({ width: 1080, height: 1024 }) // Set screen size

  // Custom user agent
  const customUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
  await page.setUserAgent(customUA) // Set custom user agent

  // Navigate the page to a URL
  // const url = 'https://lhwn.tistory.com/entry/8-puppeteer-%EC%9D%84-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EB%8F%99%EC%A0%81-Crawling'

  // await page.goto('https://developer.chrome.com/?hl=ko')
  // const url = 'https://blog.naver.com/genie096/223514684019'
  const url = 'https://blog.naver.com/genie096/223514684019'
  await page.goto(url)

  const frameSelector = 'iframe[name="mainFrame"]'
  const f = await page.waitForSelector(frameSelector)
  const frame = await f.contentFrame()

  //   const frame = page.frames().find((frame) => frame.name() === 'mainFrame')
  const html = await frame.content()

  //   const text = await frame.$eval('.se-main-container', (element) => element.textContent)
  //   const frame = await element.evaluate(frame => frame.name ?? frame.id);

  // Using page.$ to Select Single Elements
  //   const elementHandle = await page.$('#uniqueElementId')

  // Get the text content of the page's body
  // const content = await page.evaluate(() => document.body.textContent)

  // Type into search box
  //   await page.type('.devsite-search-field', 'automate beyond recorder')

  // Wait and click on first result
  //   const searchResultSelector = '.devsite-result-item-link'
  //   const searchResultSelector = '.devsite-search-field'
  //   await page.waitForSelector(searchResultSelector)
  //   await page.click(searchResultSelector)

  //   const toggleSelector = '.toggle'
  //   await page.click(toggleSelector)

  // Locate the full title with a unique string.
  //   const textSelector = await page.locator('text/강력한 웹').waitHandle()
  //   const fullTitle = await textSelector?.evaluate((el) => el.textContent)
  // Print the full title.
  //   console.log('The title of this blog post is "%s".', fullTitle)

  //   const html = await page.content()

  let isReview = false
  let platformIndex

  //   string.indexOf(substring)
  //   html.indexOf(reviewPlatform[i].key) !== -1

  for (let i = 0; i < reviewPlatform.length; i++) {
    if (html.toString().includes(reviewPlatform[i].key)) {
      // if (html.toString().indexOf(reviewPlatform[i].key) !== -1) {
      console.log('reviewPlatform', reviewPlatform[i].key)
      platformIndex = i
      if (reviewPlatform[i].key !== '내돈내산') isReview = true
    }
  }
  const imgs = await frame.$$eval('.se-component-content img[src]', (imgs) => imgs.map((img) => img.getAttribute('src')))

  //   const imgs = await page.$$eval('img.se-sticker-image[src]', (imgs) => imgs.map((img) => img.getAttribute('src')))
  res.status(200).json(imgs)

  //   const bar = await frame.evaluate(() => {
  //     let images = []

  //     // const myElement = document.querySelector('.flicking-camera')
  //     // const my_div = document.getElementsByClassName('se-main-container')
  //     const all_imgs = document.getElementsById('post-view223514335686').querySelectorAll('img')
  //     const elements = document.querySelectorAll('#se-main-container img')

  //     // for (let i = 0; i < all_imgs.length; i++) {
  //     //   images.push(all_imgs[i].getAttribute('src'))
  //     //   //   console.log(all_imgs[i])
  //     //   // var sa = siteAvatars[i];
  //     //   // var a = sa.querySelector(".avatar");
  //     //   // console.log(a);
  //     // }
  //     for (let i = 0; i < elements.length; i++) {
  //       images.push(elements[i].getAttribute('src'))
  //       //   console.log(all_imgs[i])
  //       // var sa = siteAvatars[i];
  //       // var a = sa.querySelector(".avatar");
  //       // console.log(a);
  //     }
  //     return elements
  //   })
  //   console.log('bar', bar) // will print in the console

  //   const bar = await frame.evaluate(() => {
  //     // return Array.from(document.getElementsByClassName('se-main-container').getElementsByTagName('img').map((i) => i.src))
  //     const div = page.getElementsByClassName('se-main-container')
  //     // const imgs = document.querySelectorAll('.se-sticker-image img')
  //     // imgs.forEach((img) => console.log(img.getAttribute('src')))
  //     // var divEl = document.getElementsByClassName('se-main-container')
  //     // src = divEl.getElementsByTagName('img')[0].src
  //     // return document.getElementsByClassName('se-main-container').getElementsByTagName('img')[0].src
  //     return div

  //     // console.log('images length', images.length)
  //     // return images[images.length - 1]
  //     // for (let i = 0; i < images.length; i++) {
  //     //   console.log(images[i])
  //     //   // var sa = siteAvatars[i];
  //     //   // var a = sa.querySelector(".avatar");
  //     //   // console.log(a);
  //     // }
  //     // return images
  //   })

  //   if (isReview === false) {
  //     res.status(200).json('이 글은 내돈내산 글입니다.')
  //   } else {
  //     res.status(200).json(`이 글은 ${reviewPlatform[platformIndex].name} 리뷰입니다.`)
  //   }

  // 2.
  // 특정 URL 로딩 (네이버 쇼핑의 스마트폰 목록 페이지)
  //   await page.goto('https://blog.naver.com/yumhee-/223517699584')

  //   // 페이지의 데이터 분석 및 크롤링
  //   const data = await page.evaluate(() => {
  //     // 필요한 데이터 추출
  //     const items = []
  //     // const itemElements = document.querySelectorAll('.adProduct_inner__W_nuz, .product_inner__gr8QR')
  //     // const itemElements = document.querySelectorAll('.se-main-container')
  //     res.status(200).json(document)

  //     // 검색 결과 목록에서 타이틀, 상품 페이지 링크, 가격, 리뷰개수 정보를 가진 요소를 추출
  //     // itemElements.forEach((itemElement) => {
  //     //   const titleElement = itemElement.querySelector('.adProduct_title__amInq, .product_title__Mmw2K')
  //     //   const linkElement = itemElement.querySelector('.adProduct_title__amInq > a, .product_title__Mmw2K > a')
  //     //   const priceElement = itemElement.querySelector('.adProduct_price__9gODs .price_num__S2p_v, .product_price__52oO9 .price_num__S2p_v')
  //     //   const reviewElement = itemElement.querySelector('.product_etc_box__ElfVA em.product_num__fafe5')

  //     //   // 텍스트 데이터를 추출
  //     //   const title = titleElement ? titleElement.textContent : null
  //     //   const link = titleElement ? titleElement.href : null
  //     //   const price = priceElement ? priceElement.textContent : null
  //     //   const reviews = reviewElement ? reviewElement.textContent : null

  //     //   items.push({ title, link, price, reviews }) // 배열에 상품의 텍스트 정보 한개를 추가
  //     // })

  //     // res.status(200).json(datas)
  //     // return items
  //   })

  // 콘솔창에 추출한 배열 데이터를 출력
  //   console.log(items)
  //   await browser.close()
}

const reviewPlatform = [
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
  { key: '강남맛집', name: '강남맛집' },
  { key: '체험단', name: '체험단' },
  { key: '소정의 제품', name: '제품을 지급받은' },
  { key: '소정의 서비스', name: '서비스를 지급받은' },
  { key: '원고료', name: '원고료를 지급받은' },
  { key: '제공받고', name: '대가를 지급받은' },
  { key: '제공받아', name: '대가를 지급받은' },
  { key: '내돈내산', name: '내돈내산' }
  // { key: '내산', name: '내돈내산' }
]
