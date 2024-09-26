type Condition = 'new' | 'like new' | 'very good' | 'good' | 'fair' | 'poor'

type GoogleUser = {
  sub: string
  name: string
  given_name: string
  family_name: string
  picture: string
  email: string
  email_verified: boolean
}
