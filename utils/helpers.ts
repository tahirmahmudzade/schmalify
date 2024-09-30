export function getProfilePicUrl(avatar?: string | null, userId?: string | null) {
  return avatar?.startsWith('https') ? avatar : `/api/users/${userId}/serveImg`
}
