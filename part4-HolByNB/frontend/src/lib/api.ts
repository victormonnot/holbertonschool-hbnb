const API_BASE = "/api/v1"

function getToken(): string | null {
  return localStorage.getItem("token")
}

function authHeaders(): HeadersInit {
  const token = getToken()
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (token) headers["Authorization"] = `Bearer ${token}`
  return headers
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: authHeaders(),
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || body.message || `Erreur ${res.status}`)
  }
  return res.json()
}

// Auth
export async function login(email: string, password: string) {
  const data = await request<{ access_token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
  localStorage.setItem("token", data.access_token)
  return data
}

export function logout() {
  localStorage.removeItem("token")
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

// Parse JWT to get user info
export function getTokenPayload(): { sub: string; is_admin: boolean } | null {
  const token = getToken()
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return { sub: payload.sub, is_admin: payload.is_admin ?? false }
  } catch {
    return null
  }
}

// Users
export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
}

export function getUsers() {
  return request<User[]>("/users/")
}

export function getUser(id: string) {
  return request<User>(`/users/${id}`)
}

// Places
export interface Place {
  id: string
  title: string
  description: string
  price: number
  latitude: number
  longitude: number
  owner_id: string
  owner?: User
  amenities: { id: string; name: string }[]
  created_at: string
  updated_at: string
}

export function getPlaces() {
  return request<Place[]>("/places/")
}

export function getPlace(id: string) {
  return request<Place>(`/places/${id}`)
}

export function createPlace(data: {
  title: string
  description: string
  price: number
  latitude: number
  longitude: number
  amenities?: string[]
}) {
  return request<Place>("/places/", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function updatePlace(
  id: string,
  data: Partial<{
    title: string
    description: string
    price: number
    latitude: number
    longitude: number
    amenities: string[]
  }>
) {
  return request<{ message: string }>(`/places/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

// Reviews
export interface Review {
  id: string
  text: string
  rating: number
  user_id: string
  place_id: string
  created_at: string
  updated_at: string
}

export function getPlaceReviews(placeId: string) {
  return request<Review[]>(`/places/${placeId}/reviews`)
}

export function createReview(data: {
  text: string
  rating: number
  place_id: string
}) {
  return request<Review>("/reviews/", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function deleteReview(id: string) {
  return request<{ message: string }>(`/reviews/${id}`, { method: "DELETE" })
}

// Amenities
export interface Amenity {
  id: string
  name: string
}

export function getAmenities() {
  return request<Amenity[]>("/amenities/")
}
