export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validatePassword(password) {
  return password.length >= 8
}

export function validatePhone(phone) {
  return /^[\+]?[\d\s\-\(\)]{7,15}$/.test(phone)
}

export function validateRequired(value) {
  return String(value).trim().length > 0
}

export function validateBillingForm(data) {
  const errors = {}
  if (!validateRequired(data.name))    errors.name    = "Full name is required"
  if (!validateEmail(data.email))      errors.email   = "Valid email is required"
  if (!validatePhone(data.phone))      errors.phone   = "Valid phone number is required"
  if (!validateRequired(data.street))  errors.street  = "Street address is required"
  if (!validateRequired(data.city))    errors.city    = "City is required"
  if (!validateRequired(data.state))   errors.state   = "State is required"
  if (!validateRequired(data.zip))     errors.zip     = "ZIP code is required"
  return errors
}

export function validateRegisterForm(data) {
  const errors = {}
  if (!validateRequired(data.name))             errors.name    = "Full name is required"
  if (!validateEmail(data.email))               errors.email   = "Valid email is required"
  if (!validatePassword(data.password))         errors.password= "Password must be at least 8 characters"
  if (data.password !== data.confirmPassword)   errors.confirmPassword = "Passwords do not match"
  return errors
}
