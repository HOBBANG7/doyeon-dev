// import { useEffect, useState, useRef } from 'react'
import Layout from 'components/layout'
import Head from 'next/head'
// import Image from 'next/image'
// import Link from 'next/link'
// import { Inter } from 'next/font/google'

export default function Start() {
  // const [currentMemoIdx, setCurrentMemoIdx] = useState(0) // 선택된 메모의 인덱스. 디폴트는 첫번째 메모로 지정함.
  // const [currentMemo, setCurrentMemo] = useState({ content: '', title: '' }) // 타이핑이 발생할때 업데이트 해줌. ==> 업데이트 된 메모 정보를 담는 역할을 수행한다.
  // const [memoData, setMemoData] = useState(dummyMemo) // 메모장 데이터
  // const [toggleDate, setToggleDate] = useState(false) // 메모장 본문의 날짜를 클릭했는지, 안 했는지 트래킹 한다.
  // const [searchInput, setSearchInput] = useState('') // 검색인풋에 입력한 값
  // const [filteredMemoData, setFilteredMemoData] = useState(dummyMemo) // 검색을 토대로 필터링 된 메모 리스트
  // const [toggleSearch, setToggleSearch] = useState(false) // 검색 버튼 클릭 됐는지 안 됐는지 트랙킹 한다.
  // const [dataHolder, setDataHolder] = useState(dummyMemo) // 수정된 데이터 등 저장
  // const [currentMember, setCurrentMember] = useState('') // 로그인 시, 현재 로그인된 맴버 저장
  // const [signupState, setSignupState] = useState(false) // 회원가입버튼
  // const [deleteState, setDeleteState] = useState(false) // 삭제버튼

  // useEffect(() => {
  //   console.log('signupState', signupState)
  // }, [currentMemoIdx, memoData, currentMemo, filteredMemoData, currentMember, signupState])

  return (
    <Layout>
      <Head>
        <title>Projects | by Doyeon Kim</title>
        <meta name="description" content="Doyeon's Dev Site" />
        <meta property="og:title" content="Doyeon's Dev Site" />
        <link rel="icon" href="icon/memo.png" />
      </Head>
      <div className="h-screen bg-gray-200 px-[10vw] py-24">시작입니다</div>
    </Layout>
  )
}
