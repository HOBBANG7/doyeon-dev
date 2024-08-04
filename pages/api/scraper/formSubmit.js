// poc_name, company, poc_email, poc_phone, inquiryHtml, inquiryRoute, submittedPage

import { data } from 'autoprefixer'

let formData = { name: '', company: '', email: '', phone: '', inquiry: '' }
let finalData = { poc_name: '', company: '', poc_email: '', poc_phone: '', inquiryHtml: '', inquiryRoute: '', submittedPage: '' }
// let _updatedMetaObj = { ...metaData[nextStage], ...{ timeStamp: now, completed: true } }

export function onInputChange(event) {
  // let newValue = event.target.value;
  console.log('entered')
  //   let elementId = event.target.id
  //   let value = event.target.value
  //   let parentId = event.target.parent.id
  const { id, value } = event.target
  formData = { ...formData, [id]: value }
}
