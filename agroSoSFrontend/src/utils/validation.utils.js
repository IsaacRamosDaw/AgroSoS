
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

  if (!formData.password || formData.password.trim() === '') { return { isValid: false, error: 'Debes ingresar una contraseña.' }; }

  if (!formData.confirmPassword || formData.confirmPassword.trim() === '') { return { isValid: false, error: 'Debes confirmar la contraseña.' }; }

  if (formData.password !== formData.confirmPassword) { return { isValid: false, error: 'Las contraseñas no coinciden.' }; }

  return { isValid: true, error: null };
};

// Valida el formulario de inicio de sesión (Login)
export const validateLoginForm = (email, password) => {
  if (!email || email.trim() === '') { return { isValid: false, error: 'Debes ingresar un correo electrónico.' }; }

  if (!password || password.trim() === '') { return { isValid: false, error: 'Debes ingresar una contraseña.' }; }

  return { isValid: true, error: null };
};

// Valida el formulario de edición de usuario (ModifyForm)
export const validateModifyForm = ({ name, email, password, confirmPassword }) => {
  if (!name || name.trim() === '') { return { isValid: false, field: 'name', error: 'Debes ingresar un nombre.' }; }

  if (!email || !isValidEmail(email)) { return { isValid: false, field: 'email', error: 'Debes ingresar un correo electrónico válido.' }; }

  if (password && password.length < 6) { return { isValid: false, field: 'password', error: 'La contraseña debe tener al menos 6 caracteres.' }; }

  if (password && password !== confirmPassword) { return { isValid: false, field: 'confirmPassword', error: 'Las contraseñas no coinciden.' }; }

  return { isValid: true, field: null, error: null };
};
