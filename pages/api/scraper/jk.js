export default async function handle(req, res) {
  const axios = require('axios');
  const iconv = require('iconv-lite');
  const cheerio = require('cheerio');
  let data = [];
  let number = 0;
  let pageLength = 12;
  for (let i = 1; i < pageLength; i++) {
    await axios({
      // 크롤링을 원하는 페이지 URL
      url: `https://www.jobkorea.co.kr/Theme/TemplateFreeGnoList/start_up?rlistTab=0&rOrderTab=99&rSearchText=&bpart_no=0&spart_no=&scd=&jtype=&careerTypeCode=&ctype=&jobFilter=1&listDisplayCode=2&MainPageNo=1&FreePageNo=${i}&psTab=20&themeNo=100&tabNo=0&giDisplayCntLimitStat=0&GIOpenTypeCode=0&pay=&pay_type_code=&IsPartCodeSearch=false&_=1698046058328`,
      method: 'GET',
      // responseType: 'arraybuffer',
    })
      // 성공했을 경우
      .then(response => {
        // 만약 content가 정상적으로 출력되지 않는다면, arraybuffer 타입으로 되어있기 때문일 수 있다.
        // 현재는 string으로 반환되지만, 만약 다르게 출력된다면 뒤에 .toString() 메서드를 호출하면 된다.

        // const content = iconv.decode(response.data, 'EUC-KR')
        const content = response.data;
        const $ = cheerio.load(content);
        const itemSelector = 'div.tplList.tplJobList > table > tbody > tr';
        // company =        body > div.tplList.tplJobList > table > tbody > tr:nth-child(1) > td.tplCo > a
        // companyType =    body > div.tplList.tplJobList > table > tbody > tr:nth-child(1) > td.tplCo > div
        // title =          body > div.tplList.tplJobList > table > tbody > tr > td.tplTit > div > strong > a
        // etc =            body > div.tplList.tplJobList > table > tbody > tr:nth-child(1) > td.tplTit > div > p.etc
        // desc =           body > div.tplList.tplJobList > table > tbody > tr:nth-child(1) > td.tplTit > div > p.dsc
        // deadline =       body > div.tplList.tplJobList > table > tbody > tr:nth-child(12) > td.odd > span.date.dotum
        let companyName, companyUrl, companyType, jobDesc, jobTitle, jobEtc, jobEtcHTML, jobUrl, deadline;

        $(itemSelector).each((i, elem) => {
          let source = '잡코리아';
          number = number + 1;
          companyName = $(elem).find('td.tplCo > a').text();
          companyUrl = `https://www.jobkorea.co.kr${$(elem).find('td.tplCo > a').attr('href')}`;
          jobDesc = $(elem).find('td.tplTit > div > p.dsc').text();
          jobTitle = $(elem).find('td.tplTit > div > strong > a').text();
          jobUrl = `https://www.jobkorea.co.kr${$(elem).find('td.tplTit > div > strong > a').attr('href')}`;
          jobEtc = $(elem).find('td.tplTit > div > p.etc').text();
          //   jobEtcHTML = $(elem).find('td.tplTit > div > p.etc').html();

          deadline = $(elem).find('td.odd > span.date.dotum').text();
          companyType = $(elem).find('td.tplCo > div').text();

          if (companyType.includes('벤처') && !companyType.includes('강소기업')) {
            companyType = '벤처';
          } else if (companyType.includes('벤처') && companyType.includes('강소기업')) {
            companyType = '벤처/강소기업';
          } else if (!companyType.includes('벤처') && companyType.includes('강소기업')) {
            companyType = '강소기업';
          } else if (!companyType.includes('벤처') && !companyType.includes('강소기업')) {
            companyType = '해당없음';
          }

          jobEtc = jobEtc.replace(`\n                                    `, ``);
          jobEtc = jobEtc.replace(`\n                                `, ``);
          jobEtc = jobEtc.replace(`\n                                                                    `, ``);

          jobEtc = jobEtc.replace(/\n/g, ' / ');
          jobEtc = jobEtc.replace(/ +(?= )/g, '');

          //   data.push({ companyName, companyUrl, companyType, jobDesc, jobTitle, jobEtc, jobEtcHTML, jobUrl, deadline });

          data.push({ companyName, companyUrl, companyType, jobDesc, jobTitle, jobEtc, jobEtcHTML, jobUrl, deadline });
        });
        if (i === pageLength - 1) {
          // return data
          res.status(200).json(data);
        }
      });
    // 실패했을 경우
    //   .catch(err => {
    //     console.error(err)
    //   })
  }
}
