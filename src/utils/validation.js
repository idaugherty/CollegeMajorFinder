const MURRAY_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@murraystate\.edu$/i;

export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export function validateMurrayEmail(email) {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    return 'Email is required.';
  }
  if (!MURRAY_EMAIL_REGEX.test(normalized)) {
    return 'Email must end with @murraystate.edu';
  }
  return '';
}

export function validateDisplayName(name) {
  if (!name) {
    return '';
  }

  const trimmed = String(name).trim();
  if (!trimmed) {
    return 'Display name cannot be blank spaces.';
  }
  if (trimmed.length < 2) {
    return 'Display name must be at least 2 characters.';
  }
  if (trimmed.length > 50) {
    return 'Display name must be 50 characters or fewer.';
  }

  return '';
}

export function validatePassword(password) {
  if (!password) {
    return 'Password is required.';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must include at least one uppercase letter.';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must include at least one lowercase letter.';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must include at least one number.';
  }
  return '';
}

export function validatePasswordConfirm(password, confirmPassword) {
  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }
  return '';
}
