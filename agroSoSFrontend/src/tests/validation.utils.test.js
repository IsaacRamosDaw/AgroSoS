import { describe, it, expect } from 'vitest'
import { isValidEmail, validateLoginForm, validateSignUpForm } from '../utils/validation.utils'

// ─── Nivel 1: Tests Parametrizados ────────────────────────────────────────────

describe('isValidEmail', () => {
  it.each([
    ['valid@email.com',       true],
    ['user@domain.org',       true],
    ['a@b.co',                true],
    ['',                      false],
    ['sinArroba',             false],
    ['@sinUsuario.com',       false],
    ['sinDominio@',           false],
    ['doble@@dominio.com',    false],
    ['espacios @dominio.com', false],
    [null,                    false],
  ])('isValidEmail("%s") → %s', (input, expected) => {
    expect(isValidEmail(input)).toBe(expected)
  })
})

describe('validateLoginForm', () => {
  it.each([
    // [descripcion,                      email,            password,      isValid]
    ['credenciales válidas',              'u@test.com',     'pass123',     true ],
    ['email vacío',                       '',               'pass123',     false],
    ['email solo espacios',               '   ',            'pass123',     false],
    ['contraseña vacía',                  'u@test.com',     '',            false],
    // BUG DETECTADO: contraseña de solo espacios pasaba la validación
    ['contraseña solo espacios (BUG)',    'u@test.com',     '   ',         false],
    ['email nulo',                        null,             'pass123',     false],
    ['contraseña nula',                   'u@test.com',     null,          false],
  ])('%s → isValid: %s', (_desc, email, password, expected) => {
    expect(validateLoginForm(email, password).isValid).toBe(expected)
  })
})

describe('validateSignUpForm', () => {
  const base = {
    name: 'Test User',
    email: 'test@test.com',
    password: 'pass123',
    confirmPassword: 'pass123',
    accepted: true,
  }

  it.each([
    // [descripcion,                          overrides,                                              isValid]
    ['formulario completo válido',            {},                                                     true ],
    ['sin aceptar términos',                  { accepted: false },                                    false],
    ['nombre vacío',                          { name: '' },                                           false],
    ['nombre solo espacios',                  { name: '   ' },                                        false],
    ['email inválido',                        { email: 'noemail' },                                   false],
    ['contraseña vacía',                      { password: '' },                                       false],
    ['confirmación vacía',                    { confirmPassword: '' },                                false],
    ['contraseñas no coinciden',              { confirmPassword: 'diferente' },                       false],
    // BUG DETECTADO: contraseñas de solo espacios pasaban la validación
    ['contraseña solo espacios (BUG)',        { password: '   ', confirmPassword: '   ' },            false],
  ])('%s → isValid: %s', (_desc, overrides, expected) => {
    const formData = { ...base, ...overrides }
    expect(validateSignUpForm(formData).isValid).toBe(expected)
  })
})
