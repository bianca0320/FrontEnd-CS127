/**
 * Generate a UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Generate initials from a name
 * Example: "David Jonathan Pasumbal" -> "DJP"
 */
export function generateInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
}

/**
 * Generate Reference ID based on borrower and lender
 * Format: BorrowerInitials_LenderInitials
 * Example: "DJP_DJP" for David Jonathan Pasumbal borrowing from David Jonathan Pasumbal
 */
export function generateReferenceId(
  borrower: { name: string; initials?: string } | string,
  lender: { firstName: string; lastName: string } | string
): string {
  let borrowerInitials: string
  
  if (typeof borrower === 'string') {
    borrowerInitials = generateInitials(borrower)
  } else {
    borrowerInitials = borrower.initials || generateInitials(borrower.name)
  }
  
  let lenderInitials: string
  if (typeof lender === 'string') {
    lenderInitials = generateInitials(lender)
  } else {
    lenderInitials = generateInitials(`${lender.firstName} ${lender.lastName}`)
  }
  
  return `${borrowerInitials}_${lenderInitials}`
}

