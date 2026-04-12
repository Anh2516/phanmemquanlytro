import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import type { RawRoom } from "../types/room";
import type { Landlord } from "../types/landlord";
import {
  clearAllAdminLocalOverrides,
  getAdminLandlords,
  getAdminRawRooms,
  hasAdminLandlordsOverride,
  hasAdminRawRoomsOverride,
  invalidateRoomsCache,
  saveAdminLandlordsToLocal,
  saveAdminRawRoomsToLocal,
} from "../data/roomsApi";
import { rawRooms as bundledRawRooms } from "../data/roomsRaw.data";
import { landlordsData as bundledLandlords } from "../data/landlordsRaw.data";
import {
  saveLandlordsTsFile,
  saveRawRoomsTsFile,
  serializeLandlordsDataFile,
  serializeRawRoomsDataFile,
} from "../utils/rawRoomsFile";
import { fillRawRoomForAdmin } from "../utils/fillRawRoomForAdmin";

type AdminTab = "rooms" | "landlords";

function nextRoomId(rooms: RawRoom[]): string {
  let max = 0;
  for (const r of rooms) {
    const m = /^pt-(\d+)$/.exec(r.id);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return `pt-${String(max + 1).padStart(3, "0")}`;
}

function nextLandlordId(landlords: Landlord[]): string {
  let max = 0;
  for (const l of landlords) {
    const m = /^ld-(\d+)$/.exec(l.id);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return `ld-${String(max + 1).padStart(3, "0")}`;
}

function emptyRoom(): RawRoom {
  return {
    id: "",
    title: "",
    district: "",
    address: "",
    price: 0,
    area: 20,
    floor: 1,
    available: true,
    images: [],
    amenities: [],
    description: "",
    contact: { phone: "", zalo: "" },
    landlordId: "ld-001",
  };
}

function emptyLandlord(): Landlord {
  return {
    id: "",
    name: "",
    avatar: "",
    phone: "",
    zalo: "",
    email: "",
    bio: "",
    experienceYears: 1,
    verified: true,
    languages: ["Tiếng Việt"],
  };
}

function cloneLandlord(l: Landlord): Landlord {
  return { ...l, languages: [...l.languages] };
}

export function AdminRoomsPage() {
  const [tab, setTab] = useState<AdminTab>("rooms");
  const [rooms, setRooms] = useState<RawRoom[]>(() =>
    getAdminRawRooms().map((r) => fillRawRoomForAdmin({ ...r, contact: { ...r.contact } }))
  );
  const [landlords, setLandlords] = useState<Landlord[]>(() => getAdminLandlords().map(cloneLandlord));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [landlordIndex, setLandlordIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [savingRoomsFile, setSavingRoomsFile] = useState(false);
  const [savingLandlordsFile, setSavingLandlordsFile] = useState(false);

  const selected = rooms[selectedIndex];
  const selectedLl = landlords[landlordIndex];
  const usingOverride = hasAdminRawRoomsOverride() || hasAdminLandlordsOverride();

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 4500);
  }, []);

  const updateSelected = useCallback(
    (patch: Partial<RawRoom>) => {
      setRooms((prev) => {
        const next = [...prev];
        const cur = next[selectedIndex];
        if (!cur) return prev;
        next[selectedIndex] = { ...cur, ...patch };
        return next;
      });
    },
    [selectedIndex]
  );

  const updateContact = useCallback(
    (patch: Partial<RawRoom["contact"]>) => {
      setRooms((prev) => {
        const next = [...prev];
        const cur = next[selectedIndex];
        if (!cur) return prev;
        next[selectedIndex] = { ...cur, contact: { ...cur.contact, ...patch } };
        return next;
      });
    },
    [selectedIndex]
  );

  const updateCostBreakdown = useCallback(
    (patch: Partial<NonNullable<RawRoom["costBreakdown"]>>) => {
      setRooms((prev) => {
        const next = [...prev];
        const cur = next[selectedIndex];
        if (!cur?.costBreakdown) return prev;
        next[selectedIndex] = {
          ...cur,
          costBreakdown: { ...cur.costBreakdown, ...patch },
        };
        return next;
      });
    },
    [selectedIndex]
  );

  const updateLandlord = useCallback(
    (patch: Partial<Landlord>) => {
      setLandlords((prev) => {
        const next = [...prev];
        const cur = next[landlordIndex];
        if (!cur) return prev;
        next[landlordIndex] = { ...cur, ...patch };
        return next;
      });
    },
    [landlordIndex]
  );

  const imagesText = useMemo(
    () => (selected ? selected.images.join("\n") : ""),
    [selected]
  );

  const amenitiesText = useMemo(
    () => (selected ? selected.amenities.join("\n") : ""),
    [selected]
  );

  const languagesText = useMemo(
    () => (selectedLl ? selectedLl.languages.join("\n") : ""),
    [selectedLl]
  );

  const rentalConditionsText = useMemo(
    () => (selected?.rentalConditions ? selected.rentalConditions.join("\n") : ""),
    [selected]
  );

  const handleImagesBlur = (text: string) => {
    const images = text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    updateSelected({ images });
  };

  const handleAmenitiesBlur = (text: string) => {
    const amenities = text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    updateSelected({ amenities });
  };

  const handleLanguagesBlur = (text: string) => {
    const languages = text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    updateLandlord({ languages: languages.length > 0 ? languages : ["Tiếng Việt"] });
  };

  const handleRentalConditionsBlur = (text: string) => {
    const lines = text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    updateSelected({ rentalConditions: lines });
  };

  const addReview = () => {
    setRooms((prev) => {
      const next = [...prev];
      const cur = next[selectedIndex];
      if (!cur) return prev;
      const revs = [...(cur.reviews ?? []), { author: "", rating: 5, comment: "" }];
      next[selectedIndex] = { ...cur, reviews: revs };
      return next;
    });
  };

  const removeReview = (ri: number) => {
    setRooms((prev) => {
      const next = [...prev];
      const cur = next[selectedIndex];
      if (!cur?.reviews) return prev;
      next[selectedIndex] = {
        ...cur,
        reviews: cur.reviews.filter((_, i) => i !== ri),
      };
      return next;
    });
  };

  const updateReview = (
    ri: number,
    patch: Partial<{ author: string; rating: number; comment: string }>
  ) => {
    setRooms((prev) => {
      const next = [...prev];
      const cur = next[selectedIndex];
      if (!cur?.reviews?.[ri]) return prev;
      const revs = [...cur.reviews];
      revs[ri] = { ...revs[ri], ...patch };
      next[selectedIndex] = { ...cur, reviews: revs };
      return next;
    });
  };

  const persistLocal = () => {
    saveAdminRawRoomsToLocal(rooms);
    saveAdminLandlordsToLocal(landlords);
    invalidateRoomsCache();
    showToast("Đã lưu phòng + chủ trọ vào trình duyệt (localStorage).");
  };

  const handleResetLocal = () => {
    clearAllAdminLocalOverrides();
    setRooms(bundledRawRooms.map((r) => fillRawRoomForAdmin({ ...r, contact: { ...r.contact } })));
    setLandlords(bundledLandlords.map(cloneLandlord));
    setSelectedIndex(0);
    setLandlordIndex(0);
    invalidateRoomsCache();
    showToast("Đã xóa ghi đè local — dùng lại file roomsRaw.data.ts & landlordsRaw.data.ts.");
  };

  const handleAddRoom = () => {
    const id = nextRoomId(rooms);
    const defaultLl = landlords[0]?.id ?? "ld-001";
    setRooms((prev) => [
      ...prev,
      fillRawRoomForAdmin({ ...emptyRoom(), id, landlordId: defaultLl }),
    ]);
    setSelectedIndex(rooms.length);
    setTab("rooms");
    showToast(`Đã thêm phòng (${id}).`);
  };

  const handleDeleteRoom = () => {
    if (rooms.length <= 1) {
      showToast("Cần ít nhất một phòng.");
      return;
    }
    const next = rooms.filter((_, i) => i !== selectedIndex);
    const nextIndex = Math.min(selectedIndex, next.length - 1);
    setRooms(next);
    setSelectedIndex(nextIndex);
    showToast("Đã xóa phòng (nhớ Lưu hoặc Ghi file).");
  };

  const handleAddLandlord = () => {
    const id = nextLandlordId(landlords);
    setLandlords((prev) => [...prev, { ...emptyLandlord(), id }]);
    setLandlordIndex(landlords.length);
    setTab("landlords");
    showToast(`Đã thêm chủ trọ (${id}).`);
  };

  const handleDeleteLandlord = () => {
    if (landlords.length <= 1) {
      showToast("Cần ít nhất một chủ trọ.");
      return;
    }
    const removed = landlords[landlordIndex];
    if (!removed) return;
    const remaining = landlords.filter((_, i) => i !== landlordIndex);
    const fallbackId = remaining[0]!.id;
    setRooms((prev) =>
      prev.map((r) =>
        r.landlordId === removed.id ? { ...r, landlordId: fallbackId } : r
      )
    );
    const nextIndex = Math.min(landlordIndex, remaining.length - 1);
    setLandlords(remaining);
    setLandlordIndex(nextIndex);
    showToast(
      `Đã xóa ${removed.id}. Các phòng đang trỏ tới chủ này đã chuyển sang ${fallbackId}.`
    );
  };

  const handleWriteRoomsFile = async () => {
    const content = serializeRawRoomsDataFile(rooms);
    setSavingRoomsFile(true);
    try {
      const result = await saveRawRoomsTsFile(content);
      if (result === "aborted") showToast("Đã hủy lưu file phòng.");
      else if (result === "picker_saved")
        showToast("Đã ghi roomsRaw.data.ts (đúng src/data/).");
      else showToast("Đã tải roomsRaw.data.ts — chép vào src/data/ nếu cần.");
    } finally {
      setSavingRoomsFile(false);
    }
  };

  const handleWriteLandlordsFile = async () => {
    const content = serializeLandlordsDataFile(landlords);
    setSavingLandlordsFile(true);
    try {
      const result = await saveLandlordsTsFile(content);
      if (result === "aborted") showToast("Đã hủy lưu file chủ trọ.");
      else if (result === "picker_saved")
        showToast("Đã ghi landlordsRaw.data.ts (đúng src/data/).");
      else showToast("Đã tải landlordsRaw.data.ts — chép vào src/data/ nếu cần.");
    } finally {
      setSavingLandlordsFile(false);
    }
  };

  const tabClass = (t: AdminTab) =>
    `rounded-lg px-4 py-2 text-sm font-semibold transition ${
      tab === t ? "bg-accent text-white shadow-glow" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
    }`;

  if (tab === "rooms" && !selected) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-slate-600">Không có phòng nào.</p>
        <button type="button" onClick={handleAddRoom} className="mt-4 text-accent-dark">
          Thêm phòng
        </button>
      </div>
    );
  }

  if (tab === "landlords" && !selectedLl) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-slate-600">Không có chủ trọ nào.</p>
        <button type="button" onClick={handleAddLandlord} className="mt-4 text-accent-dark">
          Thêm chủ trọ
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-20 pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-accent-dark"
            >
              <ArrowLeft className="h-4 w-4" />
              Về trang chủ
            </Link>
            <h1 className="mt-2 font-display text-2xl font-bold text-slate-900">
              Admin — phòng & chủ trọ
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Tab <strong>Phòng</strong>: <code className="rounded bg-slate-200 px-1">roomsRaw.data.ts</code> · Tab{" "}
              <strong>Chủ trọ</strong>:{" "}
              <code className="rounded bg-slate-200 px-1">landlordsRaw.data.ts</code>
            </p>
            {usingOverride && (
              <p className="mt-2 text-xs font-medium text-amber-800">
                Đang có dữ liệu lưu trong localStorage (khác file trong repo).
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-2 rounded-xl bg-slate-200/80 p-1">
              <button type="button" className={tabClass("rooms")} onClick={() => setTab("rooms")}>
                Phòng
              </button>
              <button type="button" className={tabClass("landlords")} onClick={() => setTab("landlords")}>
                Chủ trọ
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {tab === "rooms" ? (
            <button
              type="button"
              onClick={handleAddRoom}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
            >
              <Plus className="h-4 w-4" />
              Thêm phòng
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAddLandlord}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
            >
              <Plus className="h-4 w-4" />
              Thêm chủ trọ
            </button>
          )}
          <button
            type="button"
            onClick={persistLocal}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white shadow-glow hover:brightness-110"
          >
            <Save className="h-4 w-4" />
            Lưu (trình duyệt)
          </button>
          <button
            type="button"
            onClick={handleResetLocal}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" />
            Bỏ local
          </button>
          <button
            type="button"
            disabled={savingRoomsFile}
            onClick={handleWriteRoomsFile}
            className="inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-white px-4 py-2 text-sm font-semibold text-accent-dark shadow-sm hover:bg-accent/5 disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            {savingRoomsFile ? "…" : "Ghi roomsRaw.data.ts"}
          </button>
          <button
            type="button"
            disabled={savingLandlordsFile}
            onClick={handleWriteLandlordsFile}
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-300 bg-white px-4 py-2 text-sm font-semibold text-indigo-800 shadow-sm hover:bg-indigo-50 disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            {savingLandlordsFile ? "…" : "Ghi landlordsRaw.data.ts"}
          </button>
        </div>

        {toast && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {toast}
          </div>
        )}

        {tab === "rooms" && selected && (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,280px)_1fr]">
            <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {rooms.length} phòng
              </p>
              <ul className="max-h-[70vh] space-y-1 overflow-y-auto">
                {rooms.map((r, i) => (
                  <li key={r.id + i}>
                    <button
                      type="button"
                      onClick={() => setSelectedIndex(i)}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                        i === selectedIndex
                          ? "bg-accent/15 font-semibold text-accent-dark"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="block truncate text-xs text-slate-500">{r.id}</span>
                      <span className="block truncate">{r.title || "(Chưa có tiêu đề)"}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-lg font-semibold text-slate-900">Chi tiết phòng</h2>
                <button
                  type="button"
                  onClick={handleDeleteRoom}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa phòng
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-medium text-slate-700">ID</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    value={selected.id}
                    onChange={(e) => updateSelected({ id: e.target.value })}
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Chủ trọ</span>
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    value={selected.landlordId ?? ""}
                    onChange={(e) =>
                      updateSelected({ landlordId: e.target.value || undefined })
                    }
                  >
                    <option value="">— Theo thứ tự mặc định —</option>
                    {landlords.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name || l.id} ({l.id})
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block text-sm">
                <span className="font-medium text-slate-700">Tiêu đề</span>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  value={selected.title}
                  onChange={(e) => updateSelected({ title: e.target.value })}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Quận / khu</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    value={selected.district}
                    onChange={(e) => updateSelected({ district: e.target.value })}
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Địa chỉ</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    value={selected.address}
                    onChange={(e) => updateSelected({ address: e.target.value })}
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Giá (VNĐ/tháng)</span>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    value={selected.price || ""}
                    onChange={(e) => updateSelected({ price: Number(e.target.value) || 0 })}
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Diện tích (m²)</span>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    value={selected.area || ""}
                    onChange={(e) => updateSelected({ area: Number(e.target.value) || 0 })}
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Tầng</span>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    value={selected.floor}
                    onChange={(e) => updateSelected({ floor: Number(e.target.value) || 0 })}
                  />
                </label>
                <label className="flex flex-col text-sm">
                  <span className="font-medium text-slate-700">Còn trống</span>
                  <input
                    type="checkbox"
                    className="mt-3 h-4 w-4 accent-accent"
                    checked={selected.available}
                    onChange={(e) => updateSelected({ available: e.target.checked })}
                  />
                </label>
              </div>

              <label className="block text-sm">
                <span className="font-medium text-slate-700">Ảnh (mỗi dòng một URL)</span>
                <textarea
                  key={selectedIndex + selected.id}
                  className="mt-1 min-h-[100px] w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs"
                  defaultValue={imagesText}
                  onBlur={(e) => handleImagesBlur(e.target.value)}
                />
              </label>

              <label className="block text-sm">
                <span className="font-medium text-slate-700">Tiện ích (mỗi dòng một mục)</span>
                <textarea
                  key={`a-${selectedIndex}-${selected.id}`}
                  className="mt-1 min-h-[100px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  defaultValue={amenitiesText}
                  onBlur={(e) => handleAmenitiesBlur(e.target.value)}
                />
              </label>

              <label className="block text-sm">
                <span className="font-medium text-slate-700">Mô tả</span>
                <textarea
                  className="mt-1 min-h-[120px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  value={selected.description}
                  onChange={(e) => updateSelected({ description: e.target.value })}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-medium text-slate-700">SĐT liên hệ (tin đăng)</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    value={selected.contact.phone}
                    onChange={(e) => updateContact({ phone: e.target.value })}
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Zalo (tuỳ chọn)</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    value={selected.contact.zalo ?? ""}
                    onChange={(e) => updateContact({ zalo: e.target.value || undefined })}
                  />
                </label>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-display text-base font-semibold text-slate-900">
                  Chi phí chi tiết &amp; điều kiện thuê
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="font-medium text-slate-700">Điện</span>
                    <input
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      value={selected.costBreakdown?.electricity ?? ""}
                      onChange={(e) => updateCostBreakdown({ electricity: e.target.value })}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="font-medium text-slate-700">Nước</span>
                    <input
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      value={selected.costBreakdown?.water ?? ""}
                      onChange={(e) => updateCostBreakdown({ water: e.target.value })}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="font-medium text-slate-700">Internet</span>
                    <input
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      value={selected.costBreakdown?.internet ?? ""}
                      onChange={(e) => updateCostBreakdown({ internet: e.target.value })}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="font-medium text-slate-700">Gửi xe</span>
                    <input
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      value={selected.costBreakdown?.parking ?? ""}
                      onChange={(e) => updateCostBreakdown({ parking: e.target.value })}
                    />
                  </label>
                  <label className="block text-sm sm:col-span-2">
                    <span className="font-medium text-slate-700">Khác</span>
                    <input
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      value={selected.costBreakdown?.other ?? ""}
                      onChange={(e) => updateCostBreakdown({ other: e.target.value })}
                    />
                  </label>
                  <label className="block text-sm sm:col-span-2">
                    <span className="font-medium text-slate-700">Tiền cọc (số tháng)</span>
                    <input
                      type="number"
                      min={0}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      value={selected.costBreakdown?.depositMonths ?? 1}
                      onChange={(e) =>
                        updateCostBreakdown({
                          depositMonths: Math.max(0, Number(e.target.value) || 0),
                        })
                      }
                    />
                  </label>
                </div>
                <label className="mt-4 block text-sm">
                  <span className="font-medium text-slate-700">Điều kiện thuê (mỗi dòng một ý)</span>
                  <textarea
                    key={`rental-${selectedIndex}-${selected.id}`}
                    className="mt-1 min-h-[100px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    defaultValue={rentalConditionsText}
                    onBlur={(e) => handleRentalConditionsBlur(e.target.value)}
                  />
                </label>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-base font-semibold text-slate-900">
                    Đánh giá từ người thuê trước
                  </h3>
                  <button
                    type="button"
                    onClick={addReview}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
                  >
                    <Plus className="h-4 w-4" />
                    Thêm đánh giá
                  </button>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Xóa hết các dòng đánh giá và lưu = không còn đánh giá trên trang chi tiết.
                </p>
                <div className="mt-4 space-y-4">
                  {(selected.reviews ?? []).map((rv, ri) => (
                    <div
                      key={`${selected.id}-rv-${ri}`}
                      className="rounded-xl border border-slate-200 bg-slate-50/80 p-4"
                    >
                      <div className="mb-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeReview(ri)}
                          className="text-xs font-medium text-red-600 hover:underline"
                        >
                          Xóa
                        </button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block text-sm">
                          <span className="font-medium text-slate-700">Nhãn / tên hiển thị</span>
                          <input
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                            value={rv.author}
                            onChange={(e) => updateReview(ri, { author: e.target.value })}
                          />
                        </label>
                        <label className="block text-sm">
                          <span className="font-medium text-slate-700">Điểm (1–5)</span>
                          <input
                            type="number"
                            min={1}
                            max={5}
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                            value={rv.rating}
                            onChange={(e) =>
                              updateReview(ri, {
                                rating: Math.min(5, Math.max(1, Number(e.target.value) || 1)),
                              })
                            }
                          />
                        </label>
                      </div>
                      <label className="mt-3 block text-sm">
                        <span className="font-medium text-slate-700">Nội dung</span>
                        <textarea
                          className="mt-1 min-h-[72px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                          value={rv.comment}
                          onChange={(e) => updateReview(ri, { comment: e.target.value })}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-display text-base font-semibold text-slate-900">Vị trí trên bản đồ</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Địa chỉ phòng vẫn hiển thị như trên. Ô bên dưới dùng để ghim Google Maps (ví dụ tên đường +
                  quận chính xác hơn). Để trống = dùng đúng địa chỉ phòng.
                </p>
                <label className="mt-3 block text-sm">
                  <span className="font-medium text-slate-700">Từ khóa tìm Maps (tuỳ chọn)</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs"
                    value={selected.mapSearchQuery ?? ""}
                    onChange={(e) => updateSelected({ mapSearchQuery: e.target.value })}
                    placeholder="Ví dụ: Đường Tô Hiến Thành, Quận 10, TP.HCM"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {tab === "landlords" && selectedLl && (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,280px)_1fr]">
            <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {landlords.length} chủ trọ
              </p>
              <ul className="max-h-[70vh] space-y-1 overflow-y-auto">
                {landlords.map((l, i) => (
                  <li key={l.id + i}>
                    <button
                      type="button"
                      onClick={() => setLandlordIndex(i)}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                        i === landlordIndex
                          ? "bg-indigo-100 font-semibold text-indigo-900"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="block truncate text-xs text-slate-500">{l.id}</span>
                      <span className="block truncate">{l.name || "(Chưa có tên)"}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-lg font-semibold text-slate-900">Hồ sơ chủ trọ</h2>
                <button
                  type="button"
                  onClick={handleDeleteLandlord}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa chủ trọ
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-medium text-slate-700">ID</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    value={selectedLl.id}
                    onChange={(e) => updateLandlord({ id: e.target.value })}
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Tên hiển thị</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    value={selectedLl.name}
                    onChange={(e) => updateLandlord({ name: e.target.value })}
                  />
                </label>
              </div>

              <label className="block text-sm">
                <span className="font-medium text-slate-700">URL ảnh đại diện</span>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs"
                  value={selectedLl.avatar}
                  onChange={(e) => updateLandlord({ avatar: e.target.value })}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Số điện thoại</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    value={selectedLl.phone}
                    onChange={(e) => updateLandlord({ phone: e.target.value })}
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Zalo</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    value={selectedLl.zalo ?? ""}
                    onChange={(e) => updateLandlord({ zalo: e.target.value || undefined })}
                  />
                </label>
              </div>

              <label className="block text-sm">
                <span className="font-medium text-slate-700">Email</span>
                <input
                  type="email"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  value={selectedLl.email}
                  onChange={(e) => updateLandlord({ email: e.target.value })}
                />
              </label>

              <label className="block text-sm">
                <span className="font-medium text-slate-700">Giới thiệu</span>
                <textarea
                  className="mt-1 min-h-[100px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  value={selectedLl.bio}
                  onChange={(e) => updateLandlord({ bio: e.target.value })}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Số năm kinh nghiệm</span>
                  <input
                    type="number"
                    min={0}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    value={selectedLl.experienceYears}
                    onChange={(e) =>
                      updateLandlord({ experienceYears: Number(e.target.value) || 0 })
                    }
                  />
                </label>
                <label className="flex flex-col text-sm">
                  <span className="font-medium text-slate-700">Đã xác minh</span>
                  <input
                    type="checkbox"
                    className="mt-3 h-4 w-4 accent-indigo-600"
                    checked={selectedLl.verified}
                    onChange={(e) => updateLandlord({ verified: e.target.checked })}
                  />
                </label>
              </div>

              <label className="block text-sm">
                <span className="font-medium text-slate-700">Ngôn ngữ (mỗi dòng một mục)</span>
                <textarea
                  key={`lang-${landlordIndex}-${selectedLl.id}`}
                  className="mt-1 min-h-[80px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  defaultValue={languagesText}
                  onBlur={(e) => handleLanguagesBlur(e.target.value)}
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
