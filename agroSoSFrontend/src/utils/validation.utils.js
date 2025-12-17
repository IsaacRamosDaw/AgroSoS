
// Valida si un email tiene el formato correcto usando Regex
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};


// Valida el formulario de registro (SignUp)
export const validateSignUpForm = (formData) => {
  if (!formData.accepted) { return { isValid: false, error: 'Debes aceptar los términos de uso.' }; }

  if (!formData.name || formData.name.trim() === '') { return { isValid: false, error: 'Debes ingresar un nombre.' }; }

  if (!formData.email || !isValidEmail(formData.email)) { return { isValid: false, error: 'Debes ingresar un correo electrónico válido.' }; }

  if (!formData.password) { return { isValid: false, error: 'Debes ingresar una contraseña.' }; }

  if (!formData.confirmPassword) { return { isValid: false, error: 'Debes confirmar la contraseña.' }; }

  if (formData.password !== formData.confirmPassword) { return { isValid: false, error: 'Las contraseñas no coinciden.' }; }

  return { isValid: true, error: null };
};

// Valida el formulario de inicio de sesión (Login)
export const validateLoginForm = (email, password) => {
  if (!email || email.trim() === '') { return { isValid: false, error: 'Debes ingresar un correo electrónico.' }; }

  if (!password) { return { isValid: false, error: 'Debes ingresar una contraseña.' }; }

  return { isValid: true, error: null };
};
