import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../hook/auth/AuthContext'

// ─── Nivel 3: Tests de Integración ────────────────────────────────────────────

const fakeUser = {
  id: 1,
  name: 'Test User',
  email: 'test@test.com',
  role: 'USER',
  createdAt: '2024-01-01T00:00:00',
  updatedAt: '2024-01-01T00:00:00',
}

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>

describe('AuthContext – Integración con localStorage (vi.spyOn)', () => {
  let setItemSpy
  let removeItemSpy

  beforeEach(() => {
    localStorage.clear()
    setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem')

    // Mock de fetch: nunca llama a la API real
    global.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          success: true,
          user: fakeUser,
          device: null,
        }),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('guarda el usuario en localStorage después del login', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login('test@test.com', 'password123')
    })

    expect(setItemSpy).toHaveBeenCalledWith(
      'auth:user',
      expect.stringContaining('"id":1')
    )
  })

  it('establece el usuario en el estado después del login', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login('test@test.com', 'password123')
    })

    expect(result.current.user).not.toBeNull()
    expect(result.current.user.email).toBe('test@test.com')
  })

  it('elimina la sesión de localStorage al hacer logout', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login('test@test.com', 'password123')
    })

    act(() => {
      result.current.logout()
    })

    expect(removeItemSpy).toHaveBeenCalledWith('auth:user')
    expect(result.current.user).toBeNull()
  })

  it('llama a la API de login con POST y las credenciales correctas', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login('test@test.com', 'password123')
    })

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'test@test.com', password: 'password123' }),
      })
    )
  })

  it('lanza un error si el servidor devuelve success: false', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({ success: false, message: 'Credenciales inválidas' }),
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await expect(
      act(async () => {
        await result.current.login('wrong@test.com', 'badpass')
      })
    ).rejects.toThrow('Credenciales inválidas')
  })
})
