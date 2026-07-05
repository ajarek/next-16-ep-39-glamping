/**
 * Skrypt do ustawiania roli admina w Firestore.
 *
 * Użycie:
 *   npx tsx scripts/set-admin.ts <email> <uid>
 *
 * Przykład:
 *   npx tsx scripts/set-admin.ts admin@wildhaven.pl abc123xyz
 *
 * Wymaga zmiennych środowiskowych w .env.local:
 *   NEXT_PUBLIC_FIREBASE_API_KEY
 *   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
 *   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 *   NEXT_PUBLIC_FIREBASE_APP_ID
 */

import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"

// Wczytanie zmiennych środowiskowych z .env.local
import { readFileSync } from "fs"
import { resolve } from "path"

function loadEnv() {
  try {
    const envPath = resolve(__dirname, "../.env.local")
    const envContent = readFileSync(envPath, "utf-8")
    const env: Record<string, string> = {}
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const eqIndex = trimmed.indexOf("=")
      if (eqIndex > 0) {
        const key = trimmed.slice(0, eqIndex).trim()
        const value = trimmed.slice(eqIndex + 1).trim()
        env[key] = value
      }
    }
    return env
  } catch {
    return {}
  }
}

async function main() {
  const args = process.argv.slice(2)
  if (args.length < 2) {
    console.error("❌ Użycie: npx tsx scripts/set-admin.ts <email> <uid>")
    console.error("   Przykład: npx tsx scripts/set-admin.ts admin@wildhaven.pl abc123xyz")
    process.exit(1)
  }

  const [email, uid] = args
  console.log(`\n🔧 Ustawiam rolę admina...`)
  console.log(`   Email: ${email}`)
  console.log(`   UID:   ${uid}`)

  const env = loadEnv()

  const firebaseConfig = {
    apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }

  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error("❌ Brak zmiennych środowiskowych Firebase w .env.local")
    console.error("   Upewnij się, że plik .env.local zawiera NEXT_PUBLIC_FIREBASE_API_KEY i NEXT_PUBLIC_FIREBASE_PROJECT_ID")
    process.exit(1)
  }

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
  const db = getFirestore(app)

  // Zapisz dokument użytkownika z rolą admina
  const userRef = doc(db, "users", uid)
  await setDoc(userRef, {
    uid,
    email,
    role: "admin",
  })

  // Weryfikacja
  const snap = await getDoc(userRef)
  if (snap.exists() && snap.data().role === "admin") {
    console.log("\n✅ Rola admina ustawiona pomyślnie!")
    console.log(`   Dokument: users/${uid}`)
    console.log(`   Dane: { uid: "${uid}", email: "${email}", role: "admin" }`)
  } else {
    console.error("\n❌ Wystąpił błąd podczas weryfikacji. Sprawdź reguły Firestore.")
    process.exit(1)
  }

  process.exit(0)
}

main().catch((err) => {
  console.error("❌ Błąd:", err.message)
  process.exit(1)
})
