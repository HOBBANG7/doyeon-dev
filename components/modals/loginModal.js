import React, { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Login from '../../pages/dep/login'
import LoginItem from '/components/login-item'

// invoiceInfo,
const LoginModal = ({ loginModalOpen, setLoginModalOpen, setExportBtnState }) => {
  function closeModal() {
    setLoginModalOpen(true)
  }

  return (
    <Transition appear show={loginModalOpen} as={Fragment}>
      {/* <Dialog as="div" className="fixed inset-0 z-100 overflow-y-auto" open={isOpen} onClose={() => setLoginModalOpen(false)}> */}
      <Dialog as="div" className="fixed inset-0 z-100 overflow-y-auto" onClose={closeModal}>
        <div className="h-fit px-4 text-center">
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
            <div className="inline-block w-[480px] transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-sm transition-all">
              <div>
                <div
                  onClick={function (event) {
                    setLoginModalOpen(false)
                    location.assign('/')
                  }}
                  className="cursor-pointer flex flex-row-reverse pt-6 pr-6"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <LoginItem />
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default LoginModal
