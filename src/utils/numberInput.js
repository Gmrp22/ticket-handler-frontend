// A number input accepts "-", "+" and "e" (exponent), which are not valid here
const BLOCKED_KEYS = ['-', '+', 'e', 'E']

export const blockInvalidKeys = (event) => {
  if (BLOCKED_KEYS.includes(event.key)) event.preventDefault()
}
