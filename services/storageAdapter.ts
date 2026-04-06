import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const isWeb = Platform.OS === "web";

/**
 * Key-value persistence: `localStorage` on web (AsyncStorage has no native module there),
 * `@react-native-async-storage/async-storage` on iOS/Android.
 */
export async function storageGetItem(key: string): Promise<string | null> {
  if (isWeb) {
    try {
      return globalThis.localStorage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  }
  return AsyncStorage.getItem(key);
}

export async function storageSetItem(key: string, value: string): Promise<void> {
  if (isWeb) {
    globalThis.localStorage?.setItem(key, value);
    return;
  }
  await AsyncStorage.setItem(key, value);
}

export async function storageRemoveItem(key: string): Promise<void> {
  if (isWeb) {
    globalThis.localStorage?.removeItem(key);
    return;
  }
  await AsyncStorage.removeItem(key);
}
