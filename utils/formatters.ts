export function formatDateToDDMMYYYY(dateString: string): string {
  // Convert the input date string into a JavaScript Date object
  const date = new Date(dateString)

  // Extract the day, month, and year
  const day = String(date.getDate()).padStart(2, '0') // Ensure day is two digits
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based, so add 1
  const year = String(date.getFullYear()) // Use the full year (yyyy)

  // Return in the format dd-mm-yyyy
  return `${day}-${month}-${year}`
}
