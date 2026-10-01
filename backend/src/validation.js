function validateUser({ name, email, address, password }) {
  const errors = {};
  if (!name || name.length < 20 || name.length > 60) {
    errors.name = 'Name must be between 20 and 60 characters';
  }
  if (!address || address.length > 400) {
    errors.address = 'Address is required and must be at most 400 characters';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')) {
    errors.email = 'Enter a valid email address';
  }
  if (password !== undefined && !/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(password)) {
    errors.password = 'Password must be 8-16 characters with at least one uppercase and one special character';
  }
  return errors;
}

module.exports = { validateUser };
