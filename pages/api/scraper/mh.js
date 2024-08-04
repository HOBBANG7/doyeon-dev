export default async function handle(req, res) {
  const axios = require('axios')
  const iconv = require('iconv-lite')
  const cheerio = require('cheerio')
  let data = []
  let number = 0
  let pageLength = 43

  let title, date, src, detail, url
  let description = ''
  let source = '민후'

  for (let i = 0; i < pageLength; i++) {
    await axios({
      // 크롤링을 원하는 페이지 URL
      url: `https://www.minwho.kr/board/column.html?page=${i + 1}&plist=&find_field=&find_word=&find_state=&find_ordby=&conf=&find_mode=&mode=&language=KOR`,
      method: 'GET',
      // responseType: 'arraybuffer',
    })
      // 성공했을 경우
      .then(response => {
        // 만약 content가 정상적으로 출력되지 않는다면, arraybuffer 타입으로 되어있기 때문일 수 있다.
        // 현재는 string으로 반환되지만, 만약 다르게 출력된다면 뒤에 .toString() 메서드를 호출하면 된다.
        // const content = iconv.decode(response.data, 'EUC-KR')

        const content = response.data
        const $ = cheerio.load(content)
        const itemSelector = '#contents > div > table > tbody > tr'

        $(itemSelector).each((i, elem) => {
          number = number + 1
          title = $(elem).find('td.text_left > a').text()
          let word = extractWord(title)

          if (word.length > 0) {
            // console.log("word", word[0])
            // title = title.replace(`[${word[0]}] `, ``)
            description = `[${word[0]}]`
          }
          date = $(elem).find('td:nth-child(5)').text()
          url = 'https://www.minwho.kr/' + $(elem).find('td.text_left > a').attr('href')

          axios({
            // 크롤링을 원하는 페이지 URL
            url: url,
            method: 'GET',
            // responseType: 'arraybuffer',
          }).then(response => {
            const content = response.data
            const $ = cheerio.load(content)
            const itemSelector = '#contents > div > table > tbody > tr:nth-child(2) > td > p > span:nth-child(3)'
            // #contents > div > table > tbody > tr:nth-child(2) > td > p > span:nth-child(3) > a
            $(itemSelector).each((i, elem) => {
              src = $(elem).find('a').attr('href')
            })
          })
          // title = title.replace(`\n              `, ``)
          // date = date.replace(`\n                `, ``)
          // date = date.replace(`\n              `, ``)

          // const image = $(elem).find('a > div.thumb_post > img').attr('src') ? 'https:' + $(elem).find('a > div.thumb_post > img').attr('src') : ''
          // const price = $(elem).find('p.price > strong').text()
          // const imgUrl = $(elem).find('p.image > a > img').attr('src')
          data.push({ source, number, title, description, detail, src, url, date })
        })

        if (i === pageLength - 1) {
          // return data
          res.status(200).json(data)
        }
      })

    // 실패했을 경우
    //   .catch(err => {
    //     console.error(err)
    //   })
  }
}

function extractWord(str) {
  const words = []
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === '[') {
      const stopIndex = str.indexOf(']', i)
      if (stopIndex !== -1) words.push(str.substring(i + 1, stopIndex))
    }
  }
  return words
}
