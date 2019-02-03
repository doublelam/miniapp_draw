const cloud = require('wx-server-sdk')
cloud.init({ env: 'draw-9d1e6d' })
const db = cloud.database()
const collection = db.collection('allPics')

const getPicsByFilter = async (events, context) => {
  const { where, orders, pagination } = events
  try {
    let col = collection
    if (where) {
      col = col.where(where)
    }
    if (orders) {
      for (const order of orders) {
        col = col.orderBy(order[0], order[1])
      }
    }
    if (pagination) {
      const { pageIndex = 0, pageNum = 100 } = pagination
      const skipedNum = pageIndex * pageNum
      col = col.skip(skipedNum)
      col = col.limit(pageNum)
    }
    const rslt = await col.get()
    const newRslt = rslt.data.map(v => Object.assign({}, v, {
      ifLiked: (v.likes || []).map(val => val.userInfo.openId).includes(events.userInfo.openId)
    }))
    return { data: newRslt }
  } catch (e) {
    return e
  }
}

const getOnePicDetail = async (picId, events) => {
  const rslt = await collection.doc(picId).get()
  if (!rslt.data) {
    return {success: false, error: 'cannot find this document'}
  }
  rslt.data.ifLiked = (rslt.data.likes || []).map(val => val.userInfo.openId).includes(events.userInfo.openId)
  return rslt
}
exports.main = async (events, context) => {
  if (events.type === 'pics') {
    const rslt = await getPicsByFilter(events, context)
    return rslt
  }
  if (events.type === 'detail') {
    const rslt = await getOnePicDetail(events.picId, events)
    return rslt
  }
}
