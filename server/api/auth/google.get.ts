import { createUser, getUserByEmail } from '~/server/service/user'
import { generateRandomToken } from '~/server/utils/generateRandomToken'

export default defineOAuthGoogleEventHandler({
  config: { scope: ['email', 'profile'] },
  async onSuccess(event, { user }) {
    const userInfo = user as GoogleUser

    const { email, family_name: lastName, given_name: firstName, name, picture: avatar } = userInfo
    const username = name.toLowerCase().trim().replaceAll(' ', '')

    let id = ''

    const isUser = await getUserByEmail(userInfo.email)

    if (!isUser) {
      const newUser = await createUser({ email, firstName, lastName, avatar, username, password: generateRandomToken() })
      id = newUser.id
    } else {
      id = isUser.id
    }

    await replaceUserSession(event, {
      loggedInAt: new Date().toISOString(),
      user: { email, id: encodeId(id), username, isGuest: false },
    })

    return sendRedirect(event, '/')
  },
  onError(event, error) {
    console.error('Google OAuth error:', error)
    return sendRedirect(event, '/')
  },
})
