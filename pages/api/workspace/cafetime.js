import puppeteer from 'puppeteer'
import axios from 'axios'
import cheerio from 'cheerio'
import { setTimeout } from 'node:timers/promises'

export default async function handle(req, res) {
  // Init google cloud vision
  let schedule = []
  cafes.map((cafe) => {
    // let day
    // cafe.hours.filter((x) => x.day === '매일' || x.day === '목')
    schedule.push(cafe)
  })
  //   schedule.hours = schedule.hours.filter((i) => target.includes(i.day))
  const result = cafes.filter((item) => item.selected).map((item) => ({ _id: item._id }))

  res.status(200).json(schedule)
  //   res.status(200).json(hours.filter((x) => x.day === '매일' || x.day === '목'))
}
const target = ['매일', '목']
const days = ['월', '화', '수', '목', '금', '토', '일']

const cafes = [
  {
    name: '엔엘커피',
    hours: [
      {
        day: '매일',
        hours: '12:00 - 22:00',
        index: 0,
        lastOrder: '21:30 라스트오더'
      }
    ],
    idx: 0
  },
  {
    name: '피피커피',
    hours: [
      {
        day: '월',
        hours: '정기휴무 (매주 월요일)',
        index: 0
      },
      {
        day: '화',
        hours: '09:00 - 19:00',
        index: 1
      },
      {
        day: '목',
        hours: '09:00 - 19:00',
        index: 3
      },
      {
        day: '금',
        hours: '09:00 - 19:00',
        index: 4
      },
      {
        day: '토',
        hours: '09:00 - 19:00',
        index: 5
      },
      {
        day: '일',
        hours: '09:00 - 19:00',
        index: 6
      }
    ],
    idx: 1
  },
  {
    name: '크리머리',
    hours: [
      {
        day: '월',
        hours: '정기휴무 (매주 월요일)',
        index: 0
      },
      {
        day: '화',
        hours: '정기휴무 (매주 화요일)',
        index: 1
      },
      {
        day: '목',
        hours: '정기휴무 (매주 목요일)',
        index: 3
      },
      {
        day: '금',
        hours: '정기휴무 (매주 금요일)',
        index: 4
      },
      {
        day: '토',
        hours: '13:00 - 21:00',
        index: 5
      },
      {
        day: '일',
        hours: '13:00 - 21:00',
        index: 6
      }
    ],
    idx: 2
  },
  {
    name: '브릭베이글',
    hours: [
      {
        day: '월',
        hours: '12:00 - 20:00',
        index: 0
      },
      {
        day: '화',
        hours: '정기휴무 (매주 화요일)',
        index: 1
      },
      {
        day: '목',
        hours: '정기휴무 (매주 목요일)',
        index: 3
      },
      {
        day: '금',
        hours: '12:00 - 20:00',
        index: 4
      },
      {
        day: '토',
        hours: '12:00 - 20:00',
        index: 5
      },
      {
        day: '일',
        hours: '12:00 - 20:00',
        index: 6
      }
    ],
    idx: 3
  },
  {
    name: '카페꼼마 합정점',
    hours: [
      {
        day: '월',
        hours: '10:00 - 22:00',
        index: 0,
        lastOrder: '21:30 라스트오더'
      },
      {
        day: '화',
        hours: '10:00 - 22:00',
        index: 1,
        lastOrder: '21:30 라스트오더'
      },
      {
        day: '목',
        hours: '10:00 - 22:00',
        index: 3,
        lastOrder: '21:30 라스트오더'
      },
      {
        day: '금',
        hours: '10:00 - 22:00',
        index: 4,
        lastOrder: '21:30 라스트오더'
      },
      {
        day: '토',
        hours: '10:00 - 22:00',
        index: 5,
        lastOrder: '21:30 라스트오더'
      },
      {
        day: '일',
        hours: '10:00 - 22:00',
        index: 6,
        lastOrder: '21:30 라스트오더'
      }
    ],
    idx: 4
  },
  {
    name: '밀로밀',
    hours: [
      {
        day: '월',
        hours: '정기휴무 (매주 월요일)',
        index: 0
      },
      {
        day: '화',
        hours: '정기휴무 (매주 화요일)',
        index: 1
      },
      {
        day: '목',
        hours: '11:00 - 18:00',
        index: 3
      },
      {
        day: '금',
        hours: '11:00 - 18:00',
        index: 4
      },
      {
        day: '토',
        hours: '11:00 - 18:00',
        index: 5
      },
      {
        day: '일',
        hours: '11:00 - 18:00',
        index: 6
      }
    ],
    idx: 5
  },
  {
    name: '리얼커피',
    hours: [
      {
        day: '월',
        hours: '09:30 - 22:00',
        index: 0
      },
      {
        day: '화',
        hours: '09:30 - 22:00',
        index: 1
      },
      {
        day: '목',
        hours: '09:30 - 22:00',
        index: 3
      },
      {
        day: '금',
        hours: '09:30 - 22:00',
        index: 4
      },
      {
        day: '토',
        hours: '09:30 - 22:00',
        index: 5
      },
      {
        day: '일',
        hours: '10:00 - 18:00',
        index: 6
      }
    ],
    idx: 6
  },
  {
    name: '베이커리 나무',
    hours: [
      {
        day: '월',
        hours: '정기휴무 (매주 월요일)',
        index: 0
      },
      {
        day: '화',
        hours: '07:00 - 23:00',
        index: 1
      },
      {
        day: '목',
        hours: '07:00 - 23:00',
        index: 3
      },
      {
        day: '금',
        hours: '07:00 - 23:00',
        index: 4
      },
      {
        day: '토',
        hours: '07:00 - 23:00',
        index: 5
      },
      {
        day: '일',
        hours: '07:00 - 23:00',
        index: 6
      }
    ],
    idx: 7
  },
  {
    name: '구황작물',
    hours: [
      {
        day: '월',
        hours: '11:00 - 18:30',
        index: 0,
        lastOrder: '18:00 라스트오더'
      },
      {
        day: '화',
        hours: '정기휴무 (매주 화요일)',
        index: 1
      },
      {
        day: '목',
        hours: '11:00 - 18:30',
        index: 3,
        lastOrder: '18:00 라스트오더'
      },
      {
        day: '금',
        hours: '11:00 - 18:30',
        index: 4,
        lastOrder: '18:00 라스트오더'
      },
      {
        day: '토',
        hours: '11:00 - 18:30',
        index: 5,
        lastOrder: '18:00 라스트오더'
      },
      {
        day: '일',
        hours: '11:00 - 18:30',
        index: 6,
        lastOrder: '18:00 라스트오더'
      }
    ],
    idx: 8
  },
  {
    name: '아이다호',
    hours: [
      {
        day: '월',
        hours: '17:00 - 24:00',
        index: 0
      },
      {
        day: '화',
        hours: '정기휴무 (매주 화요일)',
        index: 1
      },
      {
        day: '목',
        hours: '17:00 - 24:00',
        index: 3
      },
      {
        day: '금',
        hours: '17:00 - 24:00',
        index: 4
      },
      {
        day: '토',
        hours: '13:00 - 24:00',
        index: 5
      },
      {
        day: '일',
        hours: '13:00 - 24:00',
        index: 6
      }
    ],
    idx: 10
  },
  {
    name: '버블룸',
    hours: [
      {
        day: '월',
        hours: '10:00 - 22:00',
        index: 0
      },
      {
        day: '화',
        hours: '정기휴무 (매주 화요일)',
        index: 1
      },
      {
        day: '목',
        hours: '10:00 - 22:00',
        index: 3
      },
      {
        day: '금',
        hours: '10:00 - 22:00',
        index: 4
      },
      {
        day: '토',
        hours: '09:00 - 22:00',
        index: 5
      },
      {
        day: '일',
        hours: '09:00 - 22:00',
        index: 6
      }
    ],
    idx: 11
  },
  {
    name: '크레이지파이',
    hours: [
      {
        day: '월',
        hours: '정기휴무 (매주 월요일)',
        index: 0
      },
      {
        day: '화',
        hours: '11:30 - 20:30',
        index: 1
      },
      {
        day: '목',
        hours: '11:30 - 20:30',
        index: 3
      },
      {
        day: '금',
        hours: '11:30 - 20:30',
        index: 4
      },
      {
        day: '토',
        hours: '11:30 - 20:30',
        index: 5
      },
      {
        day: '일',
        hours: '11:30 - 20:30',
        index: 6
      }
    ],
    idx: 12
  },
  {
    name: '로잉커피',
    hours: [
      {
        day: '월',
        hours: '정기휴무 (매주 월요일)',
        index: 0
      },
      {
        day: '화',
        hours: '11:00 - 22:00',
        index: 1
      },
      {
        day: '목',
        hours: '11:00 - 22:00',
        index: 3
      },
      {
        day: '금',
        hours: '11:00 - 22:00',
        index: 4
      },
      {
        day: '토',
        hours: '11:00 - 22:00',
        index: 5
      },
      {
        day: '일',
        hours: '11:00 - 22:00',
        index: 6
      }
    ],
    idx: 13
  },
  {
    name: '코코부코',
    hours: [
      {
        day: '매일',
        hours: '11:00 - 20:50',
        index: 0
      }
    ],
    idx: 14
  },
  {
    name: '쿼터',
    hours: [
      {
        day: '월(8/5)',
        hours: '정기휴무 (격주 월요일)',
        index: -1
      },
      {
        day: '화',
        hours: '18:00 - 22:00',
        index: 1
      },
      {
        day: '목',
        hours: '18:00 - 22:00',
        index: 3
      },
      {
        day: '금',
        hours: '18:00 - 22:00',
        index: 4
      },
      {
        day: '토',
        hours: '13:00 - 22:00',
        index: 5
      },
      {
        day: '일',
        hours: '13:00 - 22:00',
        index: 6
      }
    ],
    idx: 15
  },
  {
    name: '꼬레소레하우스',
    hours: [
      {
        day: '금(8/2)',
        hours: '휴무',
        index: -1
      },
      {
        day: '토(8/3)',
        hours: '휴무',
        index: -1
      },
      {
        day: '일(8/4)',
        hours: '휴무',
        index: -1
      },
      {
        day: '월(8/5)',
        hours: '휴무',
        index: -1
      },
      {
        day: '화(8/6)',
        hours: '휴무',
        index: -1
      },
      {
        day: '목',
        hours: '11:30 - 21:00',
        index: 3,
        lastOrder: '20:30 라스트오더'
      }
    ],
    idx: 16
  },
  {
    name: '카페텅 망원점',
    hours: [
      {
        day: '월',
        hours: '정기휴무 (매주 월요일)',
        index: 0
      },
      {
        day: '화',
        hours: '12:00 - 20:00',
        index: 1,
        lastOrder: '19:30 라스트오더'
      },
      {
        day: '목',
        hours: '12:00 - 20:00',
        index: 3,
        lastOrder: '19:30 라스트오더'
      },
      {
        day: '금',
        hours: '12:00 - 20:00',
        index: 4,
        lastOrder: '19:30 라스트오더'
      },
      {
        day: '토',
        hours: '12:00 - 20:00',
        index: 5,
        lastOrder: '19:30 라스트오더'
      },
      {
        day: '일',
        hours: '12:00 - 20:00',
        index: 6,
        lastOrder: '19:30 라스트오더'
      }
    ],
    idx: 17
  },
  {
    name: '카카오다다',
    hours: [
      {
        day: '월',
        hours: '정기휴무 (매주 월요일)',
        index: 0
      },
      {
        day: '화',
        hours: '정기휴무 (매주 화요일)',
        index: 1
      },
      {
        day: '목',
        hours: '11:00 - 20:00',
        index: 3
      },
      {
        day: '금',
        hours: '11:00 - 20:00',
        index: 4
      },
      {
        day: '토',
        hours: '11:00 - 20:00',
        index: 5
      },
      {
        day: '일',
        hours: '정기휴무 (매주 일요일)',
        index: 6
      }
    ],
    idx: 19
  },
  {
    name: '고미푸딩 망원점',
    hours: [
      {
        day: '월',
        hours: '정기휴무 (매주 월요일)',
        index: 0
      },
      {
        day: '화',
        hours: '정기휴무 (매주 화요일)',
        index: 1
      },
      {
        day: '목',
        hours: '12:00 - 21:00',
        index: 3,
        lastOrder: '20:50 라스트오더'
      },
      {
        day: '금',
        hours: '12:00 - 21:00',
        index: 4,
        lastOrder: '20:50 라스트오더'
      },
      {
        day: '토',
        hours: '12:00 - 21:00',
        index: 5,
        lastOrder: '20:50 라스트오더'
      },
      {
        day: '일',
        hours: '12:00 - 21:00',
        index: 6,
        lastOrder: '20:50 라스트오더'
      }
    ],
    idx: 21
  },
  {
    name: '푸하하크림빵',
    hours: [
      {
        day: '매일',
        hours: '09:30 - 22:00',
        index: 0
      }
    ],
    idx: 22
  },
  {
    name: '노모먼트',
    hours: [
      {
        day: '목(8/1)',
        hours: '12:30 - 20:00',
        index: -1
      },
      {
        day: '월',
        hours: '정기휴무 (매주 월요일)',
        index: 0
      },
      {
        day: '화',
        hours: '11:30 - 19:30',
        index: 1,
        lastOrder: '19:00 라스트오더'
      },
      {
        day: '금',
        hours: '11:30 - 19:30',
        index: 4,
        lastOrder: '19:00 라스트오더'
      },
      {
        day: '토',
        hours: '11:30 - 19:30',
        index: 5,
        lastOrder: '19:00 라스트오더'
      },
      {
        day: '일',
        hours: '정기휴무 (매주 일요일)',
        index: 6
      }
    ],
    idx: 23
  },
  {
    name: '루즈도어',
    hours: [
      {
        day: '월',
        hours: '11:00 - 18:00',
        index: 0,
        lastOrder: '17:30 라스트오더'
      },
      {
        day: '화',
        hours: '11:00 - 18:00',
        index: 1,
        lastOrder: '17:30 라스트오더'
      },
      {
        day: '목',
        hours: '11:00 - 18:00',
        index: 3,
        lastOrder: '17:30 라스트오더'
      },
      {
        day: '금',
        hours: '10:00 - 21:00',
        index: 4,
        lastOrder: '20:30 라스트오더'
      },
      {
        day: '토',
        hours: '10:00 - 21:00',
        index: 5,
        lastOrder: '20:30 라스트오더'
      },
      {
        day: '일',
        hours: '10:00 - 21:00',
        index: 6,
        lastOrder: '20:30 라스트오더'
      }
    ],
    idx: 24
  },
  {
    name: '커피하우스마이샤',
    hours: [
      {
        day: '월',
        hours: '정기휴무 (매주 월요일)',
        index: 0
      },
      {
        day: '화',
        hours: '11:00 - 22:30',
        index: 1
      },
      {
        day: '목',
        hours: '11:00 - 22:30',
        index: 3
      },
      {
        day: '금',
        hours: '11:00 - 24:00',
        index: 4
      },
      {
        day: '토',
        hours: '11:00 - 24:00',
        index: 5
      },
      {
        day: '일',
        hours: '11:00 - 21:00',
        index: 6
      }
    ],
    idx: 25
  },
  {
    name: '르메드',
    hours: [
      {
        day: '월',
        hours: '08:00 - 22:00',
        index: 0,
        lastOrder: '21:30 라스트오더'
      },
      {
        day: '화',
        hours: '정기휴무 (매주 화요일)',
        index: 1
      },
      {
        day: '목',
        hours: '08:00 - 22:00',
        index: 3,
        lastOrder: '21:30 라스트오더'
      },
      {
        day: '금',
        hours: '09:00 - 23:00',
        index: 4,
        lastOrder: '22:30 라스트오더'
      },
      {
        day: '토',
        hours: '09:00 - 23:00',
        index: 5,
        lastOrder: '22:30 라스트오더'
      },
      {
        day: '일',
        hours: '09:00 - 23:00',
        index: 6,
        lastOrder: '22:30 라스트오더'
      }
    ],
    idx: 26
  },
  {
    name: '콜트 커피바',
    hours: [
      {
        day: '목(8/1)',
        hours: '13:00 - 24:00',
        index: -1
      },
      {
        day: '월',
        hours: '정기휴무 (매주 월요일)',
        index: 0
      },
      {
        day: '화',
        hours: '12:00 - 24:00',
        index: 1,
        lastOrder: '23:30 라스트오더'
      },
      {
        day: '금',
        hours: '12:00 - 24:00',
        index: 4,
        lastOrder: '23:30 라스트오더'
      },
      {
        day: '토',
        hours: '12:00 - 24:00',
        index: 5,
        lastOrder: '23:30 라스트오더'
      },
      {
        day: '일',
        hours: '12:00 - 24:00',
        index: 6,
        lastOrder: '23:30 라스트오더'
      }
    ],
    idx: 27
  },
  {
    name: '밀토니아',
    hours: [
      {
        day: '월',
        hours: '정기휴무 (매주 월요일)',
        index: 0
      },
      {
        day: '화',
        hours: '정기휴무 (매주 화요일)',
        index: 1
      },
      {
        day: '목',
        hours: '11:30 - 21:00',
        index: 3
      },
      {
        day: '금',
        hours: '11:30 - 21:00',
        index: 4
      },
      {
        day: '토',
        hours: '11:30 - 21:00',
        index: 5
      },
      {
        day: '일',
        hours: '11:30 - 21:00',
        index: 6
      }
    ],
    idx: 28
  },
  {
    name: '소금방',
    hours: [
      {
        day: '월',
        hours: '12:00 - 20:00',
        index: 0
      },
      {
        day: '화',
        hours: '12:00 - 20:00',
        index: 1
      },
      {
        day: '목',
        hours: '12:00 - 20:00',
        index: 3
      },
      {
        day: '금',
        hours: '12:00 - 20:00',
        index: 4
      },
      {
        day: '토',
        hours: '11:30 - 21:00',
        index: 5
      },
      {
        day: '일',
        hours: '11:30 - 21:00',
        index: 6
      }
    ],
    idx: 29
  },
  {
    name: '테이크잇이지',
    hours: [
      {
        day: '목(8/1)',
        hours: '휴무',
        index: -1
      },
      {
        day: '금(8/2)',
        hours: '휴무',
        index: -1
      },
      {
        day: '토(8/3)',
        hours: '휴무',
        index: -1
      },
      {
        day: '일(8/4)',
        hours: '휴무',
        index: -1
      },
      {
        day: '월(8/5)',
        hours: '휴무',
        index: -1
      },
      {
        day: '화',
        hours: '정기휴무 (매주 화요일)',
        index: 1
      }
    ],
    idx: 30
  },
  {
    name: '메이크 베러 띵스',
    hours: [
      {
        day: '월',
        hours: '12:00 - 20:00',
        index: 0
      },
      {
        day: '화',
        hours: '12:00 - 20:00',
        index: 1
      },
      {
        day: '목',
        hours: '12:00 - 20:00',
        index: 3
      },
      {
        day: '금',
        hours: '12:00 - 20:00',
        index: 4
      },
      {
        day: '토',
        hours: '12:00 - 20:00',
        index: 5
      },
      {
        day: '일',
        hours: '12:00 - 20:00',
        index: 6
      }
    ],
    idx: 31
  },
  {
    name: '디스코볼로스',
    hours: [
      {
        day: '월',
        hours: '11:00 - 23:00',
        index: 0
      },
      {
        day: '화',
        hours: '11:00 - 23:00',
        index: 1
      },
      {
        day: '목',
        hours: '정기휴무 (매주 목요일)',
        index: 3
      },
      {
        day: '금',
        hours: '11:00 - 23:00',
        index: 4
      },
      {
        day: '토',
        hours: '11:00 - 23:00',
        index: 5
      },
      {
        day: '일',
        hours: '11:00 - 21:00',
        index: 6
      }
    ],
    idx: 32
  },
  {
    name: '손탁커피',
    hours: [
      {
        day: '월',
        hours: '정기휴무 (매주 월요일)',
        index: 0
      },
      {
        day: '화',
        hours: '정기휴무 (매주 화요일)',
        index: 1
      },
      {
        day: '목',
        hours: '정기휴무 (매주 목요일)',
        index: 3
      },
      {
        day: '금',
        hours: '정기휴무 (매주 금요일)',
        index: 4
      },
      {
        day: '토',
        hours: '09:00 - 20:00',
        index: 5
      },
      {
        day: '일',
        hours: '09:00 - 20:00',
        index: 6
      }
    ],
    idx: 33
  },
  {
    name: '스몰커피',
    hours: [
      {
        day: '월',
        hours: '12:00 - 21:30',
        index: 0
      },
      {
        day: '화',
        hours: '12:00 - 21:30',
        index: 1
      },
      {
        day: '목',
        hours: '12:00 - 21:30',
        index: 3
      },
      {
        day: '금',
        hours: '12:00 - 21:30',
        index: 4
      },
      {
        day: '토',
        hours: '12:00 - 21:30',
        index: 5
      },
      {
        day: '일',
        hours: '정기휴무 (매주 일요일)',
        index: 6
      }
    ],
    idx: 34
  },
  {
    name: '템퍼러리',
    hours: [
      {
        day: '월',
        hours: '정기휴무 (매주 월요일)',
        index: 0
      },
      {
        day: '화',
        hours: '정기휴무 (매주 화요일)',
        index: 1
      },
      {
        day: '목',
        hours: '12:00 - 21:00',
        index: 3,
        lastOrder: '20:55 라스트오더'
      },
      {
        day: '금',
        hours: '12:00 - 21:00',
        index: 4,
        lastOrder: '20:55 라스트오더'
      },
      {
        day: '토',
        hours: '12:00 - 21:00',
        index: 5,
        lastOrder: '20:55 라스트오더'
      },
      {
        day: '일',
        hours: '12:00 - 21:00',
        index: 6,
        lastOrder: '20:55 라스트오더'
      }
    ],
    idx: 35
  },
  {
    name: '바리아토',
    hours: [
      {
        day: '목(8/1)',
        hours: '휴무',
        index: -1
      },
      {
        day: '금(8/2)',
        hours: '휴무',
        index: -1
      },
      {
        day: '월',
        hours: '08:00 - 21:00',
        index: 0
      },
      {
        day: '화',
        hours: '08:00 - 21:00',
        index: 1
      },
      {
        day: '토',
        hours: '10:00 - 21:00',
        index: 5
      },
      {
        day: '일',
        hours: '10:00 - 21:00',
        index: 6
      }
    ],
    idx: 36
  },
  {
    name: '뇽뇽마카롱',
    hours: [
      {
        day: '월',
        hours: '12:00 - 21:00',
        index: 0
      },
      {
        day: '화',
        hours: '12:00 - 21:00',
        index: 1
      },
      {
        day: '목',
        hours: '12:00 - 21:00',
        index: 3
      },
      {
        day: '금',
        hours: '12:00 - 21:00',
        index: 4
      },
      {
        day: '토',
        hours: '12:00 - 21:00',
        index: 5
      },
      {
        day: '일',
        hours: '12:00 - 21:00',
        index: 6
      }
    ],
    idx: 37
  },
  {
    name: '승승 밀크티',
    hours: [
      {
        day: '월',
        hours: '정기휴무 (매주 월요일)',
        index: 0
      },
      {
        day: '화',
        hours: '17:00 - 20:00',
        index: 1
      },
      {
        day: '목',
        hours: '12:00 - 20:00',
        index: 3
      },
      {
        day: '금',
        hours: '12:00 - 20:00',
        index: 4
      },
      {
        day: '토',
        hours: '14:00 - 20:00',
        index: 5
      },
      {
        day: '일',
        hours: '14:00 - 18:00',
        index: 6
      }
    ],
    idx: 38
  },
  {
    name: '카페 핀드',
    hours: [
      {
        day: '월',
        hours: '정기휴무 (매주 월요일)',
        index: 0
      },
      {
        day: '화',
        hours: '11:00 - 22:00',
        index: 1,
        lastOrder: '21:30 라스트오더'
      },
      {
        day: '목',
        hours: '11:00 - 22:00',
        index: 3,
        lastOrder: '21:30 라스트오더'
      },
      {
        day: '금',
        hours: '11:00 - 22:00',
        index: 4,
        lastOrder: '21:30 라스트오더'
      },
      {
        day: '토',
        hours: '11:00 - 22:00',
        index: 5,
        lastOrder: '21:30 라스트오더'
      },
      {
        day: '일',
        hours: '11:00 - 18:00',
        index: 6,
        lastOrder: '17:30 라스트오더'
      }
    ],
    idx: 39
  },
  {
    name: '식물카페_화초집',
    hours: [
      {
        day: '월',
        hours: '12:00 - 20:30',
        index: 0
      },
      {
        day: '화',
        hours: '12:00 - 20:30',
        index: 1
      },
      {
        day: '목',
        hours: '12:00 - 20:30',
        index: 3
      },
      {
        day: '금',
        hours: '12:00 - 20:30',
        index: 4
      },
      {
        day: '토',
        hours: '13:30 - 20:30',
        index: 5
      },
      {
        day: '일',
        hours: '정기휴무 (매주 일요일)',
        index: 6
      }
    ],
    idx: 41
  },
  {
    name: '합정리과일집',
    hours: [
      {
        day: '월',
        hours: '정기휴무 (매주 월요일)',
        index: 0
      },
      {
        day: '화',
        hours: '12:00 - 21:00',
        index: 1
      },
      {
        day: '목',
        hours: '12:00 - 21:00',
        index: 3
      },
      {
        day: '금',
        hours: '12:00 - 21:00',
        index: 4
      },
      {
        day: '토',
        hours: '12:00 - 21:00',
        index: 5
      },
      {
        day: '일',
        hours: '12:00 - 21:00',
        index: 6
      }
    ],
    idx: 43
  },
  {
    name: '부니기',
    hours: [
      {
        day: '매일',
        hours: '10:00 - 23:00',
        index: 0
      }
    ],
    idx: 44
  },
  {
    name: '이호커피',
    hours: [
      {
        day: '화(8/6)',
        hours: '정기휴무 (격주 화요일)',
        index: -1
      },
      {
        day: '월',
        hours: '21:00 - 02:00',
        index: 0
      },
      {
        day: '목',
        hours: '21:00 - 02:00',
        index: 3
      },
      {
        day: '금',
        hours: '12:00 - 19:00',
        index: 4
      },
      {
        day: '토',
        hours: '12:00 - 19:00',
        index: 5
      },
      {
        day: '일',
        hours: '12:00 - 19:00',
        index: 6
      }
    ],
    idx: 45
  },
  {
    name: '두즈무아',
    hours: [
      {
        day: '월',
        hours: '정기휴무 (매주 월요일)',
        index: 0
      },
      {
        day: '화',
        hours: '정기휴무 (매주 화요일)',
        index: 1
      },
      {
        day: '목',
        hours: '12:00 - 18:00',
        index: 3
      },
      {
        day: '금',
        hours: '12:00 - 18:00',
        index: 4
      },
      {
        day: '토',
        hours: '12:00 - 18:00',
        index: 5
      },
      {
        day: '일',
        hours: '12:00 - 18:00',
        index: 6
      }
    ],
    idx: 46
  },
  {
    name: '디어코너',
    hours: [
      {
        day: '월',
        hours: '09:00 - 20:00',
        index: 0,
        lastOrder: '19:30 라스트오더'
      },
      {
        day: '화',
        hours: '정기휴무 (매주 화요일)',
        index: 1
      },
      {
        day: '목',
        hours: '09:00 - 20:00',
        index: 3,
        lastOrder: '19:30 라스트오더'
      },
      {
        day: '금',
        hours: '09:00 - 20:00',
        index: 4,
        lastOrder: '19:30 라스트오더'
      },
      {
        day: '토',
        hours: '09:00 - 20:00',
        index: 5,
        lastOrder: '19:30 라스트오더'
      },
      {
        day: '일',
        hours: '09:00 - 20:00',
        index: 6,
        lastOrder: '19:30 라스트오더'
      }
    ],
    idx: 47
  },
  {
    name: '후르츠바스켓',
    hours: [
      {
        day: '월',
        hours: '11:30 - 22:00',
        index: 0
      },
      {
        day: '화',
        hours: '11:30 - 22:00',
        index: 1
      },
      {
        day: '목',
        hours: '11:30 - 22:00',
        index: 3
      },
      {
        day: '금',
        hours: '11:30 - 22:00',
        index: 4
      },
      {
        day: '토',
        hours: '12:30 - 22:00',
        index: 5
      },
      {
        day: '일',
        hours: '12:30 - 22:00',
        index: 6
      }
    ],
    idx: 48
  },
  {
    name: '음과양',
    hours: [
      {
        day: '월',
        hours: '정기휴무 (매주 월요일)',
        index: 0
      },
      {
        day: '화',
        hours: '11:00 - 19:00',
        index: 1,
        lastOrder: '17:00 라스트오더'
      },
      {
        day: '목',
        hours: '11:00 - 19:00',
        index: 3,
        lastOrder: '17:00 라스트오더'
      },
      {
        day: '금',
        hours: '11:00 - 19:00',
        index: 4,
        lastOrder: '17:00 라스트오더'
      },
      {
        day: '토',
        hours: '11:00 - 19:00',
        index: 5,
        lastOrder: '17:00 라스트오더'
      },
      {
        day: '일',
        hours: '11:00 - 19:00',
        index: 6,
        lastOrder: '17:00 라스트오더'
      }
    ],
    idx: 49
  },
  {
    name: '백억커피 망원점',
    hours: [
      {
        day: '매일',
        hours: '07:00 - 03:00',
        index: 0
      }
    ],
    idx: 51
  },
  {
    name: '게릴라방앗간',
    hours: [
      {
        day: '매일',
        hours: '13:00 - 22:30',
        index: 0
      }
    ],
    idx: 53
  },
  {
    name: '옆구르기',
    hours: [
      {
        day: '일(8/4)',
        hours: '휴무',
        index: -1
      },
      {
        day: '월(8/5)',
        hours: '휴무',
        index: -1
      },
      {
        day: '화(8/6)',
        hours: '휴무',
        index: -1
      },
      {
        day: '목',
        hours: '11:00 - 20:00',
        index: 3,
        lastOrder: '19:00 라스트오더'
      },
      {
        day: '금',
        hours: '11:00 - 20:00',
        index: 4,
        lastOrder: '19:00 라스트오더'
      },
      {
        day: '토',
        hours: '11:00 - 20:00',
        index: 5,
        lastOrder: '19:00 라스트오더'
      }
    ],
    idx: 54
  },
  {
    name: '너에게로갈게II',
    hours: [
      {
        day: '매일',
        hours: '12:00 - 22:00',
        index: 0
      }
    ],
    idx: 55
  },
  {
    name: '스콘집믹스드',
    hours: [
      {
        day: '토(8/3)',
        hours: '휴무',
        index: -1
      },
      {
        day: '일(8/4)',
        hours: '휴무',
        index: -1
      },
      {
        day: '월(8/5)',
        hours: '휴무',
        index: -1
      },
      {
        day: '화(8/6)',
        hours: '휴무',
        index: -1
      },
      {
        day: '목',
        hours: '정기휴무 (매주 목요일)',
        index: 3
      },
      {
        day: '금',
        hours: '정기휴무 (매주 금요일)',
        index: 4
      }
    ],
    idx: 56
  }
]
