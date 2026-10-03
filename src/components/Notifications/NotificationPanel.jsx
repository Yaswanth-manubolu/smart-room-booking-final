import React, { useState } from "react";
import { Bell, CheckCircle2, XCircle, Clock, QrCode, FileText, Trash2, X } from "lucide-react";
import QRTicketModal from "./QRTicketModal";

// MySQL timestamps arrive as "YYYY-MM-DD HH:MM:SS"
const formatNotifTime = (raw) => {
  if (!raw) return "";
  const d = new Date(String(raw).replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
};

export default function NotificationPanel({
  isOpen,
  onClose,
  notifications,
  bookings,
  currentUser,
  onMarkRead,
  onClearNotifications
}) {
  const [selectedTicketBooking, setSelectedTicketBooking] = useState(null);

  if (!isOpen) return null;

  const userNotifs = notifications.filter((n) => n.user_id === currentUser.id);
  const userBookings = bookings.filter((b) => b.facultyId === currentUser.id);

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/20 backdrop-blur-sm animate-fade-in">
        <div className="w-full max-w-md bg-white border-l border-slate-200 h-full p-6 shadow-2xl space-y-6 flex flex-col justify-between text-slate-900 relative overflow-y-auto">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Bell size={20} className="text-cyan-600" />
                <h3 className="text-lg font-bold text-slate-900">Notifications & Tickets</h3>
              </div>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-slate-900 bg-slate-100 p-1.5 rounded-xl text-xs"
              >
                <X size={16} />
              </button>
            </div>

            {/* Tab 1: Live Status Notifications */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                  Recent Alerts ({userNotifs.length})
                </span>
                {userNotifs.length > 0 && (
                  <button
                    onClick={onClearNotifications}
                    className="text-[11px] text-slate-500 hover:text-rose-600 flex items-center gap-1"
                  >
                    <Trash2 size={12} /> Clear
                  </button>
                )}
              </div>

              {userNotifs.length === 0 ? (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                  No new notifications.
                </div>
              ) : (
                <div className="space-y-2">
                  {userNotifs.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => onMarkRead(n.id)}
                      className={`p-3 rounded-2xl border text-xs space-y-1 transition cursor-pointer ${
                        n.is_read
                          ? "bg-slate-50 border-slate-200 text-slate-500"
                          : "bg-white border-cyan-500/50 text-slate-800 shadow-md"
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-cyan-600">{n.title}</span>
                        <span className="text-[10px] text-slate-500">
                          {formatNotifTime(n.created_at)}
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: User Booking History & Digital Ticket Access */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">
                  Your Requested Events ({userBookings.length})
                </span>

                <div className="space-y-2">
                  {userBookings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2 text-xs"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <strong className="text-slate-900 block">{b.eventName}</strong>
                          <span className="text-slate-500 text-[10px]">{b.roomName} • {b.date} ({b.startTime})</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            b.status === "Approved"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                              : b.status === "Pending"
                              ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                              : "bg-rose-950 text-rose-300 border border-rose-500/40"
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>

                      {/* View Ticket Pass Button for Approved Bookings */}
                      {b.status === "Approved" && (
                        <button
                          onClick={() => setSelectedTicketBooking(b)}
                          className="w-full py-1.5 rounded-xl bg-cyan-950 border border-cyan-500/40 hover:bg-cyan-900 text-cyan-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition"
                        >
                          <QrCode size={14} /> Get QR Digital Event Pass
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs"
          >
            Close Panel
          </button>
        </div>
      </div>

      {/* QR Ticket Modal popup */}
      {selectedTicketBooking && (
        <QRTicketModal
          booking={selectedTicketBooking}
          onClose={() => setSelectedTicketBooking(null)}
        />
      )}
    </>
  );
}
