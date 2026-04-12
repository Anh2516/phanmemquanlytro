import type { Room, RawRoom } from "../types/room";
import type { Landlord } from "../types/landlord";
import { buildRoomsFromRaw } from "./mockData";
import { landlordsData as defaultLandlords } from "./landlordsRaw.data";
import { rawRooms as defaultRawRooms } from "./roomsRaw.data";

const STORAGE_RAW_KEY = "trohom_admin_raw_rooms_v1";
const STORAGE_LANDLORDS_KEY = "trohom_admin_landlords_v1";

let cached: Room[] | null = null;
let inflight: Promise<Room[]> | null = null;

function readRawRoomsFromStorage(): RawRoom[] | null {
  if (typeof window === "undefined") return null;
  try {
    const s = window.localStorage.getItem(STORAGE_RAW_KEY);
    if (!s) return null;
    const parsed = JSON.parse(s) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed as RawRoom[];
  } catch {
    return null;
  }
}

function readLandlordsFromStorage(): Landlord[] | null {
  if (typeof window === "undefined") return null;
  try {
    const s = window.localStorage.getItem(STORAGE_LANDLORDS_KEY);
    if (!s) return null;
    const parsed = JSON.parse(s) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed as Landlord[];
  } catch {
    return null;
  }
}

function getRawRoomsForApp(): RawRoom[] {
  return readRawRoomsFromStorage() ?? defaultRawRooms;
}

function getLandlordsForApp(): Landlord[] {
  return readLandlordsFromStorage() ?? defaultLandlords;
}

function buildCurrentRooms(): Room[] {
  return buildRoomsFromRaw(getRawRoomsForApp());
}

export function invalidateRoomsCache() {
  cached = null;
  inflight = null;
}

export function loadRooms(): Promise<Room[]> {
  if (cached) return Promise.resolve(cached);
  if (inflight) return inflight;

  inflight = Promise.resolve(buildCurrentRooms())
    .then((data) => {
      cached = [...data];
      return cached;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

export function getRoomById(id: string): Promise<Room | undefined> {
  return loadRooms().then((rooms) => rooms.find((r) => r.id === id));
}

export function loadLandlords(): Promise<Landlord[]> {
  return Promise.resolve([...getLandlordsForApp()]);
}

export function getLandlordById(id: string): Promise<Landlord | undefined> {
  return loadLandlords().then((landlords) => landlords.find((l) => l.id === id));
}

export function getRoomsByLandlordId(landlordId: string): Promise<Room[]> {
  return loadRooms().then((rooms) => rooms.filter((room) => room.landlordId === landlordId));
}

export function getAdminRawRooms(): RawRoom[] {
  return getRawRoomsForApp();
}

export function saveAdminRawRoomsToLocal(raw: RawRoom[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_RAW_KEY, JSON.stringify(raw));
  invalidateRoomsCache();
}

export function clearAdminRawRoomsOverride() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_RAW_KEY);
  invalidateRoomsCache();
}

export function hasAdminRawRoomsOverride(): boolean {
  return readRawRoomsFromStorage() !== null;
}

export function getAdminLandlords(): Landlord[] {
  return getLandlordsForApp().map((l) => ({
    ...l,
    languages: [...l.languages],
  }));
}

export function saveAdminLandlordsToLocal(landlords: Landlord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_LANDLORDS_KEY, JSON.stringify(landlords));
}

export function clearAdminLandlordsOverride() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_LANDLORDS_KEY);
}

export function hasAdminLandlordsOverride(): boolean {
  return readLandlordsFromStorage() !== null;
}

export function clearAllAdminLocalOverrides() {
  clearAdminRawRoomsOverride();
  clearAdminLandlordsOverride();
}
