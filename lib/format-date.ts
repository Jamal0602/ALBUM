export function formatDate(dateString: string): string {
  const date = new Date(dateString)

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "Invalid date"
  }

  // Format the date
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}
