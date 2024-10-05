"use client"
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { Storage } from 'redux-persist';

// Define a type for the noop storage methods
interface NoopStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

// Create a noop storage implementation
const createNoopStorage = (): NoopStorage => {
  return {
    getItem(_key: string): Promise<string | null> {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string): Promise<void> {
      return Promise.resolve();
    },
    removeItem(_key: string): Promise<void> {
      return Promise.resolve();
    },
  };
};

// Use `createWebStorage` if `window` is defined, otherwise fallback to noop storage
const storage: Storage = typeof window !== "undefined" 
  ? createWebStorage("local") 
  : createNoopStorage();

export default storage;