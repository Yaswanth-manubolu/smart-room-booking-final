import React from "react";
import { AlertTriangle, Clock, MapPin, ArrowRight, X } from "lucide-react";

export default function ConflictModal({
  isOpen,
  onClose,
  conflicts,
  suggestions,
  proposedBooking,
  onSelectAlternateRoom,
  onSelectAlternateSlot
}) {
  if (!isOpen) return null;

  const { alternateRooms, alternateTimeSlots } = suggestions || { alternateRooms: [], alternateTimeSlots: [] };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md animate-fade-in">
      <div className="bg-white border border-rose-500/50 w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-6 text-slate-900 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-500 hover:text-slate-900 bg-slate-100 p-1.5 rounded-xl transition"
        >
          <X size={18} />
        </button>

        {/* Warning Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-500/50 flex items-center justify-center text-rose-400 shrink-0 shadow-lg">
            <AlertTriangle size={26} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-rose-600">
              Booking Conflict Detected!
            </h3>
            <p className="text-xs text-slate-700 mt-1">
              The requested time slot overlaps with an existing booking in{" "}
              <strong className="text-slate-900">{proposedBooking?.roomName}</strong>.
            </p>
          </div>
        </div>

        {/* Conflicting Event Details */}
        <div className="bg-rose-950/30 border border-rose-500/30 rounded-2xl p-4 space-y-2">
          <span className="text-[11px] font-bold uppercase text-rose-600 tracking-wider">
            Conflicting Booking:
          </span>
          {conflicts.map((conf) => (
            <div key={conf.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-rose-500/20 text-xs">
              <div>
                <span className="font-bold text-slate-900 block">{conf.eventName}</span>
                <span className="text-slate-500">By {conf.facultyName} ({conf.department})</span>
              </div>
              <div className="text-right">
                <span className="font-mono text-rose-600 font-bold block">{conf.startTime} - {conf.endTime}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-900/60 text-rose-200 border border-rose-600/40">
                  {conf.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Smart Alternate Recommendations */}
        <div className="space-y-4 border-t border-slate-200 pt-4">
          <h4 className="text-sm font-bold text-cyan-600 flex items-center gap-2">
            🤖 AI Recommended Solutions:
          </h4>

          {/* Option A: Alternate Available Rooms */}
          {alternateRooms.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500 block">
                Option 1: Switch to an Available Hall (Same Date & Time)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {alternateRooms.map(({ room, reason }) => (
                  <div
                    key={room.id}
                    className="bg-slate-50 p-3 rounded-xl border border-cyan-500/30 hover:border-cyan-400 transition flex flex-col justify-between"
                  >
                    <div>
                      <span className="font-bold text-cyan-600 text-sm block">{room.name}</span>
                      <span className="text-[11px] text-slate-500 block">{reason}</span>
                    </div>
                    <button
                      onClick={() => onSelectAlternateRoom(room)}
                      className="mt-3 w-full py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 transition"
                    >
                      Book {room.name} Instead <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {alternateRooms.length === 0 && alternateTimeSlots.length === 0 && (
            <p className="text-xs text-slate-500">
              No other free slot was found for this day. Please try a different date.
            </p>
          )}

          {/* Option B: Alternate Available Time Slots */}
          {alternateTimeSlots.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500 block">
                Option 2: Shift Time Slot on {proposedBooking?.roomName}
              </span>
              <div className="flex flex-wrap gap-2">
                {alternateTimeSlots.map((slot, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectAlternateSlot(slot.startTime, slot.endTime)}
                    className="bg-white p-2.5 rounded-xl border border-slate-300 hover:border-amber-400 text-left transition flex items-center gap-3 text-xs"
                  >
                    <Clock size={16} className="text-amber-600" />
                    <div>
                      <span className="font-mono font-bold text-slate-900 block">
                        {slot.startTime} - {slot.endTime}
                      </span>
                      <span className="text-[10px] text-slate-500">{slot.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-300 text-slate-700 text-xs font-semibold"
          >
            Cancel & Revise Details
          </button>
        </div>
      </div>
    </div>
  );
}
