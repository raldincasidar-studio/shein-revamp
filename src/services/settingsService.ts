import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const SETTINGS_DOC = "app_settings";
const SETTINGS_COLLECTION = "settings";

export async function getGeminiApiKey(): Promise<string | null> {
  try {
    const ref = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data().geminiApiKey || null;
    }
    return null;
  } catch (err) {
    console.error("Failed to fetch Gemini API key:", err);
    return null;
  }
}

export async function saveGeminiApiKey(apiKey: string): Promise<void> {
  const ref = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC);
  await setDoc(ref, { geminiApiKey: apiKey }, { merge: true });
}
