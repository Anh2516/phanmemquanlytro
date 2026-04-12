import type { Landlord } from "../types/landlord";
import type { RawRoom } from "../types/room";

/** Nội dung file `src/data/roomsRaw.data.ts` để ghi đè trong project. */
export function serializeRawRoomsDataFile(raw: RawRoom[]): string {
  const json = JSON.stringify(raw, null, 2);
  return `import type { RawRoom } from "../types/room";\n\nexport const rawRooms: RawRoom[] = ${json};\n`;
}

/** Nội dung file `src/data/landlordsRaw.data.ts`. */
export function serializeLandlordsDataFile(landlords: Landlord[]): string {
  const json = JSON.stringify(landlords, null, 2);
  return `import type { Landlord } from "../types/landlord";\n\nexport const landlordsData: Landlord[] = ${json};\n`;
}

export type SaveDataFileResult = "picker_saved" | "downloaded" | "aborted";

type WritableStreamLike = { write: (data: string) => Promise<void>; close: () => Promise<void> };

type SaveFilePickerFn = (options?: {
  suggestedName?: string;
  types?: Array<{ description: string; accept: Record<string, string[]> }>;
}) => Promise<{ createWritable: () => Promise<WritableStreamLike> }>;

export async function saveTsDataFile(content: string, suggestedName: string): Promise<SaveDataFileResult> {
  try {
    const picker = (window as Window & { showSaveFilePicker?: SaveFilePickerFn }).showSaveFilePicker;
    if (typeof picker === "function") {
      const handle = await picker({
        suggestedName,
        types: [{ description: "TypeScript", accept: { "text/plain": [".ts"] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(content);
      await writable.close();
      return "picker_saved";
    }
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") return "aborted";
  }

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = suggestedName;
  a.click();
  URL.revokeObjectURL(a.href);
  return "downloaded";
}

export function saveRawRoomsTsFile(content: string): Promise<SaveDataFileResult> {
  return saveTsDataFile(content, "roomsRaw.data.ts");
}

export function saveLandlordsTsFile(content: string): Promise<SaveDataFileResult> {
  return saveTsDataFile(content, "landlordsRaw.data.ts");
}
