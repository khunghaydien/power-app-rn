import { STORAGE_KEYS } from "@/utils/constants";
import {
  storageGetItem,
  storageRemoveItem,
  storageSetItem,
} from "./storageAdapter";

export async function getAccessToken(): Promise<string | null> {
  return storageGetItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export async function getRefreshToken(): Promise<string | null> {
  return storageGetItem(STORAGE_KEYS.REFRESH_TOKEN);
}

export async function setTokens(tokens: {
  accessToken: string;
  refreshToken: string;
}): Promise<void> {
  await Promise.all([
    storageSetItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken),
    storageSetItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken),
  ]);
}

export async function clearTokens(): Promise<void> {
  await Promise.all([
    storageRemoveItem(STORAGE_KEYS.ACCESS_TOKEN),
    storageRemoveItem(STORAGE_KEYS.REFRESH_TOKEN),
  ]);
}
