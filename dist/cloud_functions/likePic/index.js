// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'draw-9d1e6d' })
const db = cloud.database()
const collection = db.collection('allPics')
const _ = db.command
// 云函数入口函数

const likeOne = async (picId, userInfo, event) => {
  const docCo = collection.doc(picId)
  const doc = await docCo.get()
  console.log('_doc', doc, 'doc.data__', doc)
  if (!doc) {
    return { success: false, error: 'cannot find this document' }
  }
  const likes = (doc.data.likes || []).map(v => v.openid)
  if (likes.includes(event.openid)) {
    return { success: false, error: 'already liked this document' }
  }
  console.log('likes', likes)
  try {
    const reslt = await docCo.update({
      data: {
        likes: _.push([{ ...event }]),
        likesCount: _.inc(1)
      }
    })
    return { success: true, data: reslt }
  } catch (e) {
    console.log('error', e)
    return { sucess: false, error: e }
  }
}

const cancelLikeOne = (picId, userInfo) => {

}
exports.main = async (event, context) => {
  const { picId } = event
  if (event.type === 'add') {
    try {
      return await likeOne(picId, event.info, event)
    } catch (e) {
      return {
        success: false, error: e
      }
    }
  }
}
