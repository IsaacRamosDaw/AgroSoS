import { describe, it, expect } from 'vitest'
import { isValidEmail, validateLoginForm, validateSignUpForm, validatePlantForm, validateModifyForm } from '../utils/validation.utils'

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

describe('validatePlantForm', () => {
  const base = { name: 'Tomato', x: '10', y: '20' }

  it.each([
    // [descripcion,                          overrides,                  isValid, field?]
    ['formulario válido',                     {},                         true,    null  ],
    ['nombre vacío',                          { name: '' },               false,   'name'],
    ['nombre solo espacios',                  { name: '   ' },            false,   'name'],
    ['x vacío',                               { x: '' },                  false,   'x'   ],
    ['x no numérico',                         { x: 'abc' },               false,   'x'   ],
    ['y vacío',                               { y: '' },                  false,   'y'   ],
    ['y no numérico',                         { y: 'abc' },               false,   'y'   ],
    ['x negativo (válido)',                   { x: '-5' },                true,    null  ],
    ['x decimal (válido)',                    { x: '3.14' },              true,    null  ],
  ])('%s → isValid: %s', (_desc, overrides, expectedValid, expectedField) => {
    const formData = { ...base, ...overrides }
    const result = validatePlantForm(formData)
    expect(result.isValid).toBe(expectedValid)
    if (expectedField) expect(result.field).toBe(expectedField)
  })
})

describe('validateModifyForm', () => {
  const base = { name: 'Test User', email: 'test@test.com', password: '', confirmPassword: '' }

  it.each([
    // [descripcion,                          overrides,                                        isValid, field?]
    ['nombre y email válidos, sin contraseña', {},                                              true,    null            ],
    ['nombre, email y contraseña válidos',     { password: 'abc123', confirmPassword: 'abc123' }, true, null            ],
    ['nombre vacío',                          { name: '' },                                     false,   'name'          ],
    ['nombre solo espacios',                  { name: '   ' },                                  false,   'name'          ],
    ['email inválido',                        { email: 'noemail' },                             false,   'email'         ],
    ['email vacío',                           { email: '' },                                    false,   'email'         ],
    ['contraseña muy corta',                  { password: 'abc', confirmPassword: 'abc' },      false,   'password'      ],
    ['contraseñas no coinciden',              { password: 'abc123', confirmPassword: 'xyz789' }, false,  'confirmPassword'],
    ['contraseña larga sin confirmación',     { password: 'abc123', confirmPassword: '' },       false,  'confirmPassword'],
  ])('%s → isValid: %s', (_desc, overrides, expectedValid, expectedField) => {
    const formData = { ...base, ...overrides }
    const result = validateModifyForm(formData)
    expect(result.isValid).toBe(expectedValid)
    if (expectedField) expect(result.field).toBe(expectedField)
  })
})
