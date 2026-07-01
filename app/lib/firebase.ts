import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app"
import { getAuth, Auth } from "firebase/auth"
import { getFirestore, Firestore } from "firebase/firestore"

// Konfiguracja Firebase pobierana ze zmiennych środowiskowych
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Sprawdzamy, czy konfiguracja jest kompletna
const isFirebaseConfigured =
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

interface MockUser {
  uid: string
  email: string
  displayName: string
}

type AuthCallback = (user: MockUser | null) => void

// Lokalny fallback (Mock) na wypadek braku konfiguracji Firebase
class MockAuth {
  private user: MockUser | null = null
  private listeners: AuthCallback[] = []

  constructor() {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("mock_user")
      if (savedUser) {
        this.user = JSON.parse(savedUser) as MockUser
      }
    }
  }

  onAuthStateChanged(callback: AuthCallback) {
    this.listeners.push(callback)
    callback(this.user)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback)
    }
  }

  async signInWithEmailAndPassword(email: string) {
    // Prosta symulacja logowania
    const mockUser: MockUser = {
      uid: "mock-user-123",
      email,
      displayName: "Gość Wild Haven",
    }
    this.user = mockUser
    if (typeof window !== "undefined") {
      localStorage.setItem("mock_user", JSON.stringify(mockUser))
    }
    this.notifyListeners()
    return { user: mockUser }
  }

  async createUserWithEmailAndPassword(email: string) {
    const mockUser: MockUser = {
      uid: "mock-user-123",
      email,
      displayName: "Nowy Właściciel",
    }
    this.user = mockUser
    if (typeof window !== "undefined") {
      localStorage.setItem("mock_user", JSON.stringify(mockUser))
    }
    this.notifyListeners()
    return { user: mockUser }
  }

  async signOut() {
    this.user = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("mock_user")
    }
    this.notifyListeners()
  }

  get currentUser() {
    return this.user
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.user))
  }
}

class MockFirestore {
  private getStorageKey(collectionName: string) {
    return `mock_firestore_${collectionName}`
  }

  async addDoc(collectionName: string, data: Record<string, unknown>) {
    if (typeof window === "undefined") return { id: "mock-id" }
    const key = this.getStorageKey(collectionName)
    const existing = JSON.parse(localStorage.getItem(key) || "[]") as Record<
      string,
      unknown
    >[]
    const newDoc = {
      id: `doc_${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
    }
    existing.push(newDoc)
    localStorage.setItem(key, JSON.stringify(existing))
    return newDoc
  }

  async getDocs(collectionName: string) {
    if (typeof window === "undefined") return []
    const key = this.getStorageKey(collectionName)
    return JSON.parse(localStorage.getItem(key) || "[]") as Record<
      string,
      unknown
    >[]
  }
}

let app: FirebaseApp | undefined
let auth: Auth | MockAuth | null = null
let db: Firestore | MockFirestore | null = null

const mockAuth = new MockAuth()
const mockDb = new MockFirestore()

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
    auth = getAuth(app)
    db = getFirestore(app)
  } catch (error) {
    console.error("Błąd podczas inicjalizacji Firebase:", error)
  }
}

export const firebaseAuth = isFirebaseConfigured && auth ? auth : mockAuth
export const firebaseDb = isFirebaseConfigured && db ? db : mockDb
export const isFirebaseEnabled = !!isFirebaseConfigured
export { app }
