import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBH1D26jWvPpQFLTZ64OxHEPdi2ex-2xPo",
  authDomain: "eco-vivah-ai.firebaseapp.com",
  projectId: "eco-vivah-ai",
  storageBucket: "eco-vivah-ai.firebasestorage.app",
  messagingSenderId: "153253136922",
  appId: "1:153253136922:web:e9b241164b7150f4fd1fa3"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
