import Link from 'next/link'
import DarkModeToggleButton from './dark-mode-toggle-button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css' // optional for styling

export default function Header() {
  const [currentMember, setCurrentMember] = useState('')

  useEffect(() => {
    async function getPageData() {
      localStorage.theme = 'light'

      if (sessionStorage.getItem('member_key')) {
        let member_value = JSON.parse(sessionStorage.getItem('member_key'))
        setCurrentMember(member_value)
        // console.log('member_value', member_value)
      }
      tippy('#loginBtn', {
        content: '엑세스를 제공 받으신 분만 사용 가능합니다.'
      })
    }
    getPageData()
  }, [])

  function logOutUser() {
    sessionStorage.removeItem('member_key')
    refreshPage()
  }

  function refreshPage() {
    window.location.reload()
  }
  return (
    <>
      <header className="body-font flex h-[60px] w-full border-b-2 bg-white px-[10vw] py-2 text-gray-600">
        <div className="mx-auto flex h-full w-full flex-wrap items-center md:flex-row">
          {/* 홈 링크 */}
          <Link href="/" className="title-font flex font-medium text-gray-900">
            <Image alt="타입리걸" src="/icon/memo.png" width={0} height={0} sizes="100vw" className="w-[150px] justify-center p-2" />
          </Link>

          {/* 메뉴 바 */}
          <nav className="ml-auto flex flex-wrap items-center justify-center text-base">
            <div className="ml-auto flex gap-x-5">
              {
                currentMember && (
                  <button onClick={logOutUser} className="btn-plain rounded-lg border p-0.5 px-4">
                    로그아웃
                  </button>
                )
                // : (
                //   <Link href="/login" className="hover:text-gray-900">
                //     <button id="loginBtn" className="btn-plain rounded-lg border px-4 py-1">
                //       로그인
                //     </button>
                //   </Link>
                // )
              }
              {currentMember && (
                <Link href="/dashboard" className="hover:text-gray-900">
                  <button id="draftBtn" className="btn-purple rounded-lg border px-4 py-1">
                    계약서 작성하기
                  </button>
                </Link>
              )}

              {/* <DarkModeToggleButton /> */}
            </div>
          </nav>
        </div>
      </header>
    </>
  )
}
