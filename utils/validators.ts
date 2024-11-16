import parsePhoneNumberFromString from 'libphonenumber-js'

export function validatePhoneNumber(phone: string) {
  const phoneNumber = parsePhoneNumberFromString(phone)
  return phoneNumber ? phoneNumber.isValid() : false
}
