import getAllItems from '~/server/service/item'

export default defineEventHandler(async event => {
  const items = await getAllItems()

  return {
    status: 200,
    items: items.map(item => ({ ...item, id: encodeId(item.id) })),
  }
})
