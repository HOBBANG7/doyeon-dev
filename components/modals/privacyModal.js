import React, { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { personal_data_array } from 'utils/_data'

export default function PrivacyModal({ isOpen, setIsOpen }) {
  function closeModal() {
    setIsOpen(false)
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          {/* <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"> */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="my-8 inline-block h-[520px] w-[480px] transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-sm transition-all">
              <div className="flex w-full flex-col px-8 pb-6 pt-4">
                <div className="bg-white-100 mb-2 mt-1 flex w-full items-center justify-end rounded-full text-black ">
                  <div onClick={() => setIsOpen(false)} className="cursor-pointer text-sm text-gray-500 underline-offset-2 hover:text-purple-800">
                    닫기
                    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#7F7F7F" className="w-6 h-6">
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                        clipRule="evenodd"
                      />
                    </svg> */}
                  </div>
                </div>
                <div className="mt-1.5 grid space-y-6">
                  <div className="flex px-4">
                    {/* <p className="text-sm text-start font-normal text-gray-500">잠시만요 작가님!</p> */}
                    <span className="mx-auto flex items-center gap-2">
                      <h1 className="text-lg font-bold text-gray-800">개인정보 수집 및 이용에 대한 동의</h1>
                    </span>
                  </div>
                  <div className="mx-auto h-[380px] w-full space-y-6 overflow-y-scroll px-4 scrollbar-hide">
                    {personal_data_array.map((elem, index) => {
                      return (
                        <div className="flex w-full flex-col text-justify" key={elem._id}>
                          <p className="text-sm font-bold text-gray-800">{elem.heading}</p>
                          <p className="text-sm leading-normal text-gray-700" dangerouslySetInnerHTML={{ __html: elem.content }}></p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
