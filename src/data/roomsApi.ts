import type { Room } from "../types/room";
import type { Landlord } from "../types/landlord";
import { landlordsMock, roomsMock } from "./mockData";

let cached: Room[] | null = null;
let inflight: Promise<Room[]> | null = null;

export function loadRooms(): Promise<Room[]> {
  if (cached) return Promise.resolve(cached);
  if (inflight) return inflight;

  inflight = Promise.resolve(roomsMock)
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
  return Promise.resolve(landlordsMock);
}

export function getLandlordById(id: string): Promise<Landlord | undefined> {
  return loadLandlords().then((landlords) => landlords.find((l) => l.id === id));
}

export function getRoomsByLandlordId(landlordId: string): Promise<Room[]> {
  return loadRooms().then((rooms) => rooms.filter((room) => room.landlordId === landlordId));
}
