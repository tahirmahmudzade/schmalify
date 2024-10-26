type Condition = 'new' | 'like new' | 'very good' | 'good' | 'fair' | 'poor'

type Status = 'available' | 'sold'

type GoogleUser = {
  sub: string
  name: string
  given_name: string
  family_name: string
  picture: string
  email: string
  email_verified: boolean
}

type MessageData = { senderId: string; receiverId: string; content: string; timestamp: string }
