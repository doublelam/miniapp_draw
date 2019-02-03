// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: 'draw-9d1e6d'})
const db = cloud.database()
const collection = db.collection('allPics')

// 云函数入口函数
const addAPic = async (event, context) => {
  const data = {
    ...cloud.getWXContext(),
    ...event,
    createdAt: new Date().getTime()
  }
  try {
    return await collection.add({
      data
    })
  } catch (e) {
    return e
  }
}

exports.main = async (event, context) => {
  if (event.type === 'add') {
    try {
      return await addAPic(event, context)
    } catch (e) {
      return e
    }
  };
}
