import React, { useMemo, useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Clock,
  PlusCircle,
  Lock,
  X
} from "lucide-react";
import DayTimeline from "../common/DayTimeline";
import {
  COLLEGE_TIMINGS,
  formatTime12,
  getLocalDateStr,
  toDateStr,
  isWorkingDay,
  isPastDate,
  prettyDate,
  timeToMin
} from "../../config/collegeTimings";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const pillStyle = (status) =>
  status === "Approved"
    ? "bg-rose-950/80 border border-rose-500/40 text-rose-200"
    : status === "Pending"
    ? "bg-amber-950/80 border border-amber-500/40 text-amber-300"
    : "bg-slate-100 border border-slate-300/60 text-slate-500 line-through";

const statusBadge = (status) =>
  status === "Approved"
    ? "bg-rose-950 text-rose-300 border border-rose-500/40"
    : status === "Pending"
    ? "bg-amber-950 text-amber-300 border border-amber-500/40"
    : "bg-slate-100 text-slate-500 border border-slate-300/60";

export default function CalendarView({ bookings = [], rooms = [], currentUser, onBookSlot }) {
  const todayStr = getLocalDateStr();
  const [viewDate, setViewDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedRoomFilter, setSelectedRoomFilter] = useState("ALL");
  const [showInactive, setShowInactive] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const goPrev = () => setViewDate(new Date(year, month - 1, 1));
  const goNext = () => setViewDate(new Date(year, month + 1, 1));
  const goToday = () => {
    setViewDate(new Date());
    setSelectedDate(getLocalDateStr());
  };

  // bookings after room filter / status filter, grouped by YYYY-MM-DD
  const bookingsByDate = useMemo(() => {
    const map = {};
    (bookings || []).forEach((b) => {
      if (!b || !b.date) return;
      if (selectedRoomFilter !== "ALL" && b.roomId !== selectedRoomFilter) return;
      const active = b.status === "Approved" || b.status === "Pending";
      if (!active && !showInactive) return;
      const key = String(b.date).slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push(b);
    });
    Object.values(map).forEach((list) =>
      list.sort((a, b) => timeToMin(a.startTime) - timeToMin(b.startTime))
    );
    return map;
  }, [bookings, selectedRoomFilter, showInactive]);

  // ----- day detail panel data -----
  const selectedBookings = bookingsByDate[selectedDate] || [];
  const dayOpen = isWorkingDay(selectedDate);
  const dayPast = isPastDate(selectedDate);
  const canBookDay = dayOpen && !dayPast;
  const roomsToShow = selectedRoomFilter === "ALL" ? rooms : rooms.filter((r) => r.id === selectedRoomFilter);

  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthBookingCount = Object.entries(bookingsByDate)
    .filter(([d]) => d.startsWith(monthPrefix))
    .reduce(
      (n, [, list]) => n + list.filter((b) => b.status === "Approved" || b.status === "Pending").length,
      0
    );

  const handleBook = (room) => {
    if (onBookSlot && canBookDay) onBookSlot(room, selectedDate);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-50 via-white to-indigo-50 p-6 rounded-3xl border border-slate-200 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <CalendarIcon className="text-cyan-600" size={26} /> Institutional Schedule Calendar
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Click any day to see every room's schedule and book a free slot. College hours:{" "}
            <strong className="text-slate-800">
              {formatTime12(COLLEGE_TIMINGS.open)} – {formatTime12(COLLEGE_TIMINGS.close)}
            </strong>{" "}
            (Mon–Sat).
          </p>
        </div>

        {/* Month Navigation & Room Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-white border border-slate-300 p-1 rounded-xl">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous month"
              className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-200 transition"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-bold text-slate-900 px-3 font-mono min-w-[140px] text-center">
              {MONTH_NAMES[month]} {year}
            </span>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next month"
              className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-200 transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <button
            type="button"
            onClick={goToday}
            className="px-3 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-600 hover:bg-cyan-500/25 text-xs font-bold transition"
          >
            Today
          </button>

          <div className="flex items-center gap-2 bg-white border border-slate-300 px-3 py-2 rounded-xl text-slate-800 text-xs">
            <Filter size={15} className="text-cyan-600" />
            <select
              value={selectedRoomFilter}
              onChange={(e) => setSelectedRoomFilter(e.target.value)}
              className="bg-transparent border-none text-slate-900 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-white">All Halls</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id} className="bg-white">
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Legend + toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700 px-1">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-500/80" /> Booked (approved)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-400/80" /> Pending approval</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-200" /> College closed</span>
          <span className="text-slate-500">
            {monthBookingCount} active booking{monthBookingCount === 1 ? "" : "s"} this month
          </span>
        </div>
        <label className="flex items-center gap-2 cursor-pointer text-slate-500">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="accent-cyan-500"
          />
          Show rejected / cancelled
        </label>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* ------------ Month grid ------------ */}
        <div className="xl:col-span-2 bg-white/90 border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-3">
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-3">
            {DAY_NAMES.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="min-h-[84px] sm:min-h-[104px] rounded-2xl bg-slate-50 border border-slate-200 opacity-30"
              />
            ))}

            {Array.from({ length: daysInMonth }).map((_, dayIdx) => {
              const dayNum = dayIdx + 1;
              const dateStr = toDateStr(year, month, dayNum);
              const dayEvents = bookingsByDate[dateStr] || [];
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;
              const closed = !isWorkingDay(dateStr);
              const past = isPastDate(dateStr);

              return (
                <button
                  type="button"
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`min-h-[84px] sm:min-h-[104px] rounded-2xl border p-1.5 sm:p-2 flex flex-col gap-1 text-left overflow-hidden transition focus:outline-none ${
                    isSelected
                      ? "border-cyan-400 ring-2 ring-cyan-500/40 bg-white"
                      : isToday
                      ? "bg-white border-cyan-600/70"
                      : closed
                      ? "bg-slate-50 border-slate-200 hover:border-slate-400"
                      : "bg-slate-50 border-slate-200 hover:border-slate-400"
                  } ${past && !isSelected ? "opacity-60" : ""}`}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded-md ${
                        isToday ? "bg-cyan-500 text-slate-950" : closed ? "text-slate-600" : "text-slate-700"
                      }`}
                    >
                      {dayNum}
                    </span>
                    {closed ? (
                      <span className="text-[9px] text-slate-600 font-semibold">Closed</span>
                    ) : dayEvents.length > 0 ? (
                      <span className="text-[10px] text-cyan-600 font-bold">{dayEvents.length}</span>
                    ) : null}
                  </div>

                  <div className="space-y-0.5 w-full">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className={`w-full px-1 py-0.5 rounded-md text-[9px] sm:text-[10px] font-medium truncate ${pillStyle(ev.status)}`}
                        title={`${ev.eventName} • ${ev.roomName}`}
                      >
                        <span className="font-mono opacity-80">{ev.startTime}</span> {ev.eventName}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[9px] text-cyan-600 font-bold pl-1">+{dayEvents.length - 2} more</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ------------ Selected day panel ------------ */}
        <div className="bg-white/90 border border-slate-200 rounded-3xl p-5 shadow-2xl space-y-4 xl:sticky xl:top-24">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-600">Selected day</span>
            <h3 className="text-lg font-black text-slate-900 leading-tight">{prettyDate(selectedDate)}</h3>
            {!dayOpen && (
              <p className="mt-2 text-xs text-slate-700 bg-white border border-slate-300 rounded-xl p-2.5 flex items-center gap-2">
                <Lock size={14} className="text-slate-500 shrink-0" /> The college is closed – no bookings possible.
              </p>
            )}
            {dayOpen && dayPast && (
              <p className="mt-2 text-xs text-slate-700 bg-white border border-slate-300 rounded-xl p-2.5 flex items-center gap-2">
                <Clock size={14} className="text-slate-500 shrink-0" /> This date is in the past (view only).
              </p>
            )}
          </div>

          {/* Per-room timelines */}
          {dayOpen && (
            <div className="space-y-4 max-h-[520px] overflow-y-auto custom-scrollbar pr-1">
              {roomsToShow.length === 0 && <p className="text-xs text-slate-500">No rooms found.</p>}
              {roomsToShow.map((room) => {
                const roomBookings = selectedBookings.filter((b) => b.roomId === room.id);
                const maintenance = room.status === "Maintenance";
                return (
                  <div key={room.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-cyan-600 truncate">{room.name}</div>
                        <div className="text-[10px] text-slate-500">Cap: {room.capacity}</div>
                      </div>
                      {maintenance ? (
                        <span className="text-[10px] px-2 py-1 rounded-lg bg-slate-100 text-slate-500 border border-slate-300">
                          Maintenance
                        </span>
                      ) : (
                        canBookDay && (
                          <button
                            type="button"
                            onClick={() => handleBook(room)}
                            className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[11px] font-black transition"
                          >
                            <PlusCircle size={13} /> Book
                          </button>
                        )
                      )}
                    </div>

                    <DayTimeline bookings={roomBookings} compact />

                    {roomBookings.length === 0 ? (
                      <p className="text-[11px] text-emerald-600">Free all day</p>
                    ) : (
                      <div className="space-y-1">
                        {roomBookings.map((b) => (
                          <button
                            type="button"
                            key={b.id}
                            onClick={() => setSelectedEvent(b)}
                            className="w-full flex items-center justify-between gap-2 text-left bg-white hover:bg-slate-200 rounded-lg px-2 py-1.5 text-[11px] transition"
                          >
                            <span className="truncate text-slate-800">
                              <span className="font-mono text-slate-500">
                                {formatTime12(b.startTime)}–{formatTime12(b.endTime)}
                              </span>{" "}
                              {b.eventName}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${statusBadge(b.status)}`}>
                              {b.status}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {canBookDay && !currentUser && <p className="text-[11px] text-slate-500">Sign in to book a room.</p>}
        </div>
      </div>

      {/* Selected Event Details Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white border border-slate-300 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-600 font-bold">{selectedEvent.id}</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedEvent.eventName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="text-slate-500 hover:text-slate-900 bg-slate-100 p-1.5 rounded-lg"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex justify-between p-2 rounded-xl bg-white">
                <span className="text-slate-500">Venue:</span>
                <strong className="text-cyan-600">{selectedEvent.roomName}</strong>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-white">
                <span className="text-slate-500">Date & Slot:</span>
                <strong className="text-slate-900 font-mono">
                  {String(selectedEvent.date).slice(0, 10)} ({formatTime12(selectedEvent.startTime)} - {formatTime12(selectedEvent.endTime)})
                </strong>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-white">
                <span className="text-slate-500">Organizer:</span>
                <strong className="text-slate-900">
                  {selectedEvent.facultyName} ({selectedEvent.department})
                </strong>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-white">
                <span className="text-slate-500">Status:</span>
                <span
                  className={`font-bold ${
                    selectedEvent.status === "Approved"
                      ? "text-emerald-600"
                      : selectedEvent.status === "Pending"
                      ? "text-amber-600"
                      : "text-rose-600"
                  }`}
                >
                  {selectedEvent.status}
                </span>
              </div>
            </div>

            {selectedEvent.adminRemarks && (
              <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                <strong className="text-slate-500 block mb-1">Admin Remarks:</strong>
                <p className="text-slate-700">{selectedEvent.adminRemarks}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
