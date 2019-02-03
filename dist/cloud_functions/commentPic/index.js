// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'draw-9d1e6d' })
const db = cloud.database()
const collection = db.collection('comments')

const addAComment = async (picId, comment, userInfo, event) => {
  try {
    const reslt = await collection.add({
      data: {
        picId,
        comment,
        user: userInfo,
        ...cloud.getWXContext(),
        createAt: new Date().getTime()
      }
    })
    return { success: true, data: reslt }
  } catch (e) {
    return { sucess: false, error: e }
  }
}

const getComments = async picId => {
  try {
    const rslt = await collection.where({
      picId
    }).get()
    return rslt
  } catch (e) {
    return { sucess: false, error: e }
  }
}
// 云函数入口函数
exports.main = async (event, context) => {
  const { picId, info, comment } = event
  if (event.type === 'add') {
    const rslt = await addAComment(picId, comment, info)
    return rslt
  }
  if (event.type === 'get') {
    const rslt = await getComments(picId)
    return rslt
  }
}
