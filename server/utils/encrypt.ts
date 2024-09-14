export function encodeId(id: string): string {
  return Buffer.from(id, 'utf-8').toString('base64')
}

export function decodeId(encodedId: string): string {
  return Buffer.from(encodedId, 'base64').toString('utf-8')
}
