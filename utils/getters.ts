export function getProfilePicUrl(avatar?: string | null, userId?: string | null): string {
  return avatar?.startsWith('https') ? avatar : `/api/blob/${userId}/serveProfile`
}
