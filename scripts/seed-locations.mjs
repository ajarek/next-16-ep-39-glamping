import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc, getDocs } from 'firebase/firestore'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const firebaseConfig = {
  apiKey: 'AIzaSyDIj0oW6j8keSdmv-XecQusIEt9_wB_dMw',
  authDomain: 'wild-haven-glamping.firebaseapp.com',
  projectId: 'wild-haven-glamping',
  storageBucket: 'wild-haven-glamping.firebasestorage.app',
  messagingSenderId: '129989142242',
  appId: '1:129989142242:web:03482d791401fb7fcd20bb',
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataPath = path.resolve(__dirname, '../public/data/locations.json')
const locations = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function seedLocations() {
  const locationsCol = collection(db, 'locations')
  const snapshot = await getDocs(locationsCol)

  console.log(`Firestore currently has ${snapshot.size} location documents.`)

  for (const location of locations) {
    await setDoc(doc(locationsCol, location.id), location)
    console.log(`Seeded/updated ${location.id}`)
  }

  console.log('Seed completed successfully.')
}

seedLocations().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
