import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app"
import { getAuth, Auth } from "firebase/auth"
import { getFirestore, Firestore } from "firebase/firestore"
import locationsData from "@/public/data/locations.json"
import { Location } from "../types"

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
  !!(process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)

export interface MockUser {
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
    
    // Sprawdzamy, czy dokument o takim id już istnieje
    const id = (data.id as string) || `doc_${Date.now()}`
    const updatedData = { ...data, id }
    
    const index = existing.findIndex((item) => item.id === id)
    if (index !== -1) {
      existing[index] = updatedData
    } else {
      existing.push(updatedData)
    }
    
    localStorage.setItem(key, JSON.stringify(existing))
    return updatedData
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

// Helper do logowania
export async function loginUser(email: string, password: string) {
  if (isFirebaseConfigured && auth) {
    const { signInWithEmailAndPassword } = await import("firebase/auth")
    return signInWithEmailAndPassword(auth as Auth, email, password)
  } else {
    return (firebaseAuth as MockAuth).signInWithEmailAndPassword(email)
  }
}

// Helper do rejestracji
export async function registerUser(email: string, password: string) {
  if (isFirebaseConfigured && auth) {
    const { createUserWithEmailAndPassword } = await import("firebase/auth")
    return createUserWithEmailAndPassword(auth as Auth, email, password)
  } else {
    return (firebaseAuth as MockAuth).createUserWithEmailAndPassword(email)
  }
}

// Helper do wylogowania
export async function logoutUser() {
  if (isFirebaseConfigured && auth) {
    const { signOut } = await import("firebase/auth")
    return signOut(auth as Auth)
  } else {
    return (firebaseAuth as MockAuth).signOut()
  }
}

// Helper do subskrypcji stanu autoryzacji
export function subscribeToAuth(callback: (user: unknown) => void) {
  if (isFirebaseConfigured && auth) {
    let unsubscribe: () => void = () => {}
    import("firebase/auth").then(({ onAuthStateChanged }) => {
      unsubscribe = onAuthStateChanged(auth as Auth, callback)
    })
    return () => unsubscribe()
  } else {
    return (firebaseAuth as MockAuth).onAuthStateChanged(callback)
  }
}

// Helper do pobierania lokalizacji ze wsparciem dla automatycznego seedowania
export async function getLocations(): Promise<Location[]> {
  try {
    if ("getDocs" in firebaseDb) {
      // Mock Firestore
      const docs = await firebaseDb.getDocs("locations")
      if (docs.length === 0) {
        // Seedowanie mocka
        for (const loc of locationsData) {
          await firebaseDb.addDoc("locations", loc)
        }
        const seededDocs = await firebaseDb.getDocs("locations")
        return seededDocs as unknown as Location[]
      }
      return docs as unknown as Location[]
    } else {
      // Prawdziwy Firestore
      const { collection, getDocs, doc, setDoc } = await import("firebase/firestore")
      const locationsCol = collection(firebaseDb, "locations")
      const querySnapshot = await getDocs(locationsCol)
      
      if (querySnapshot.empty) {
        // Seedowanie prawdziwego Firestore
        const seeded: Location[] = []
        for (const loc of locationsData) {
          const docRef = doc(locationsCol, loc.id)
          await setDoc(docRef, loc)
          seeded.push(loc)
        }
        return seeded
      } else {
        const locations: Location[] = []
        querySnapshot.forEach((doc) => {
          locations.push({
            id: doc.id,
            ...doc.data(),
          } as Location)
        })
        return locations
      }
    }
  } catch (error) {
    console.error("Błąd podczas pobierania lokalizacji z Firebase:", error)
    return locationsData as Location[]
  }
}

// Helper do dodawania nowej lokalizacji (oferty)
export async function addLocation(location: Omit<Location, "id"> & { id?: string }): Promise<Location> {
  const finalId = location.id || `loc-${Date.now()}`
  const finalLocation = { ...location, id: finalId }

  try {
    if ("addDoc" in firebaseDb) {
      // Mock Firestore
      await firebaseDb.addDoc("locations", finalLocation)
      return finalLocation
    } else {
      // Prawdziwy Firestore
      const { collection, doc, setDoc } = await import("firebase/firestore")
      const locationsCol = collection(firebaseDb, "locations")
      const docRef = doc(locationsCol, finalId)
      await setDoc(docRef, finalLocation)
      return finalLocation
    }
  } catch (error) {
    console.error("Błąd podczas dodawania lokalizacji do Firebase:", error)
    throw error
  }
}
