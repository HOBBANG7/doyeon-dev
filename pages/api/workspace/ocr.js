import { GoogleAuth } from 'google-auth-library'

export default async function handle(req, res) {
  console.log('1')
  const vision = require('@google-cloud/vision')
  const credentials = JSON.parse(process.env.GOOGLE_CLOUDVISON_API_KEY)
  const auth = new GoogleAuth({ credentials })
  const client = new vision.ImageAnnotatorClient({ auth })
  //   console.log('1.8')
  let str = ''

  async function detectText() {
    console.log('1.9')

    // const [result] = await client.textDetection('public/image/35.png')
    const [result] = await client.textDetection('https://storep-phinf.pstatic.net/ogq_5a5ff364e96bc/original_15.png?type=p100_100')

    console.log('1.91')

    const annotations = result.textAnnotations
    console.log('Text:')
    for (let i = 0; i < annotations.length; i++) {
      str = str + annotations[i].description
      console.log(annotations[i].description)
    }
    // annotations.forEach((annotation) => {
    //   str = str + annotation.description
    //   console.log(annotation.description)
    // })
    // str = str.replace(/\s/g, '')
    res.status(200).json(str)
  }

  //   const text = detectText()
  detectText()

  //   console.log('2')

  //   let fileName = 'public/image/35.png'
  //   console.log('3')

  //   const [result] = await client.textDetection(fileName)
  //   console.log('4')

  //   const detections = result.textAnnotations
  //   console.log('5')

  //   console.log('Text:')

  //   detections.forEach((text) => console.log(text))
  //   console.log('6')

  //

  //   const { ImageAnnotatorClient } = require('@google-cloud/vision')
}
