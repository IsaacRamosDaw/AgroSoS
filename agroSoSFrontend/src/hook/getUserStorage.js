export function getUserStorage() {
  const rawUser = localStorage.getItem("auth:user")
  const user = rawUser ? JSON.parse(rawUser) : null
  return user
}