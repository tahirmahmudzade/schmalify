export function generateResetCode() {
  return Math.floor(100000 + Math.random() * 900000) // Generates a number between 100000 and 999999
}
