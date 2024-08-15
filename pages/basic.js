'use client'

import { useEffect, useState } from 'react'
import Layout from 'components/layout'
import Head from 'next/head'

import _ from 'lodash'
// import Link from 'next/link'

export default function Search() {
  useEffect(() => {
    async function getPageData() {}
    getPageData()
  }, [])
  const [file, setFile] = useState('')

  const handleFileChange = (event) => {
    if (event.target.files) {
      const currentFile = event.target.files[0]
      setFile(currentFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST'
    })
    const { url } = await response.json()
    await fetch(url, {
      method: 'PUT',
      body: formData
    })
  }
  // useEffect(() => {
  // }, [])

  // grid-cols-[240px_1fr_1.2fr]
  const handleDownload = async () => {
    const response = await fetch('/api/download')
    const blob = await response.blob()
    const fileURL = window.URL.createObjectURL(blob)
    let anchor = document.createElement('a')
    anchor.href = fileURL
    anchor.download = 'filename.pdf'
    anchor.click()
  }

  return (
    <>
      <Layout>
        <Head>
          <title>Clib My Asset ver1.</title>
          <meta name="description" content="Clib My Asset" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="px-[10vw]">
          <div className="h-[60px] bg-black">e</div>
          <div className="h-auto">
            {/* <div className="grid place-items-center bg-black h-[240px]">
            <div className="h-full w-full px-64 bg-white">s</div>
          </div> */}
            <div className="grid h-[240px] grid-cols-[1fr_844px_1fr] bg-gray-200">
              <div />
              <div className="grid h-full w-full place-content-center py-8 text-4xl font-bold">
                <p>타입리걸 개인정보처리방침</p>
                <button
                  type="button"
                  className="rounded-md bg-pink-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
                  onClick={handleDownload}
                >
                  Download
                </button>
              </div>
              <div className="bg-yellow w-full text-center">
                {/* <DocumentIcon className="mx-auto h-12 w-12 text-gray-500" aria-hidden="true" /> */}
                <div className="mt-4 text-sm leading-6 text-gray-400">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input type="file" accept="application/pdf" id="file-upload" name="file-upload" className="sr-only" onChange={handleFileChange} />
                  </label>
                </div>
                <p className="text-xs leading-5 text-gray-400">{file?.name ? file.name : 'PDF up to 100MB'}</p>
              </div>
              <div />
            </div>
            <div className="mx-auto grid grid-cols-[1fr_844px_1fr]">
              <div />
              <div className="py-16">
                {/* <div className="text-center font-bold text-2xl py-16">서비스 이용약관</div> */}
                {/* {privacy_array.map((elem, index) => {
                return <PolicyCard dataList={elem} index={index} key={elem._id} />
              })} */}
              </div>
              <div />
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

const Spinner = () => {
  return (
    <>
      <div className="grid place-content-center items-center">
        <div role="status">
          <svg aria-hidden="true" class="mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      </div>
    </>
  )
}

// function PolicyCard({ dataList, index }) {
//   // console.log('dataList', { dataList })

//   return (
//     <>
//       <div>
//         {/* 1. 제목 */}
//         {dataList.is_clause && (
//           <div className="mb-2 flex w-full text-justify">
//             <p className="text-lg font-medium text-gray-900">
//               <b>{dataList.heading}</b>
//             </p>
//           </div>
//         )}

//         {/* 2. 본문 */}
//         <div className="mb-8 text-justify">
//           <div className="space-y-0.5 text-base" dangerouslySetInnerHTML={{ __html: dataList.content }}></div>
//         </div>
//       </div>
//     </>
//   )
// }
