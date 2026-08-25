import { format } from "date-fns"

/**
 * Generates initials from a person's name.
 *
 * Use this when displaying a user's initials, such as in an avatar or profile placeholder.
 *
 * @param name - The person's full name
 * @returns The uppercase initials of the name
 */
export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

/**
 * Formats a hyphen-separated name into a properly capitalized name.
 *
 * Use this when displaying names that are stored with hyphens instead of spaces.
 *
 * @param name - The hyphen-separated name to format
 * @returns The formatted name with each word capitalized and spaces between words
 */
export const formatName = (name: string): string => {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/**
 * Formats a number as a USD currency price.
 *
 * Use this when displaying prices in US dollar currency format.
 *
 * @param price - The price amount to format
 * @returns The formatted price as a USD currency string
 */
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD",
  }).format(price)
}

/**
 * Returns a greeting based on the current time of day.
 *
 * Use this when displaying a time-based greeting to the user.
 *
 * @param date - The date used to determine the time of day
 * @returns A greeting such as "Good morning", "Good afternoon", "Good evening", or "Good night"
 */
export function getGreeting(date = new Date()) {
  const hour = date.getHours()

  if (hour >= 5 && hour < 12) return "Good morning"
  if (hour >= 12 && hour < 17) return "Good afternoon"
  if (hour >= 17 && hour < 21) return "Good evening"
  return "Good night"
}

export const formatDateParam = (date: Date) => {
  return format(date, "yyyy-MM-dd")
}
