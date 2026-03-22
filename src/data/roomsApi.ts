import type { Room } from "../types/room";

let cached: Room[] | null = null;
let inflight: Promise<Room[]> | null = null;

export function loadRooms(): Promise<Room[]> {
  if (cached) return Promise.resolve(cached);
  if (inflight) return inflight;

  inflight = fetch(`${process.env.PUBLIC_URL || ""}/data/rooms.json`)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<Room[]>;
    })
    .then((data) => {
      cached = data;
      return data;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

export function getRoomById(id: string): Promise<Room | undefined> {
  return loadRooms().then((rooms) => rooms.find((r) => r.id === id));
}
