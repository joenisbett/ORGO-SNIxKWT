const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export const convertToValidDate = (unFormattedDate: Date): string => {
  if (typeof unFormattedDate === 'string') return unFormattedDate

  const month = unFormattedDate.getMonth()
  const date = unFormattedDate.getDate().toString().padStart(2, '0')
  const year = `${unFormattedDate.getFullYear()}`

  return `${date} ${months[month]}, ${year}`
}
