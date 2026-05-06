import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Login from '../views/Login'

// ─── Nivel 2: Tests de Componente ─────────────────────────────────────────────

const mockLogin = vi.fn()
const mockShowToast = vi.fn()

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: null, login: mockLogin, isAdmin: () => false }),
}))

vi.mock('../context/ToastContext', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )

describe('Login – Renderizado', () => {
  it('muestra el campo de email (getByLabelText)', () => {
    renderLogin()
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
  })

  it('muestra el campo de contraseña (getByLabelText)', () => {
    renderLogin()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
  })

  it('muestra el botón "Entrar" (getByRole)', () => {
    renderLogin()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('no muestra ningún error al cargar (queryByRole)', () => {
    renderLogin()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

describe('Login – Validación de formulario', () => {
  beforeEach(() => {
    mockLogin.mockClear()
    mockShowToast.mockClear()
  })

  it('muestra error si se envía con email vacío', () => {
    renderLogin()
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    expect(screen.getByRole('alert')).toHaveTextContent(/correo/i)
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('muestra error si se envía con contraseña vacía', () => {
    renderLogin()
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'user@test.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    expect(screen.getByRole('alert')).toHaveTextContent(/contraseña/i)
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('llama a login con las credenciales introducidas', async () => {
    mockLogin.mockResolvedValue(undefined)
    renderLogin()
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'user@test.com' },
    })
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@test.com', 'password123')
    })
  })

  it('muestra el error del servidor cuando login falla', async () => {
    mockLogin.mockRejectedValue(new Error('Credenciales incorrectas'))
    renderLogin()
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'user@test.com' },
    })
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'wrongpass' },
    })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/credenciales incorrectas/i)
    })
  })

  it('deshabilita el botón mientras espera respuesta del servidor', async () => {
    mockLogin.mockReturnValue(new Promise(() => {})) // nunca resuelve
    renderLogin()
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'user@test.com' },
    })
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /cargando/i })).toBeDisabled()
    })
  })
})
