import React from 'react';
import { Phone } from 'lucide-react';

/**
 * Site-wide "talk to a real person" strip shown above the footer.
 * For people who aren't going to click through links — just phone numbers.
 */
export function HelpLineStrip() {
  const lines = [
    { label: "Housing help, 24/7", number: "2-1-1", tel: "211", note: "United Way 211 Virginia" },
    { label: "Housing Crisis Hotline", number: "(757) 587-4202", tel: "7575874202", note: "Virginia Peninsula" },
    { label: "City Housing Line", number: "(757) 933-2311", tel: "7579332311", note: "Newport News" },
    { label: "NNRHA", number: "(757) 928-2620", tel: "7579282620", note: "Housing Authority" },
  ];

  return (
    <div className="bg-secondary text-white print:hidden">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          {lines.map((l) => (
            <a
              key={l.tel}
              href={`tel:${l.tel}`}
              className="flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                <Phone className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-wide text-white/70 truncate">{l.label}</div>
                <div className="font-bold leading-tight group-hover:underline">{l.number}</div>
                <div className="text-[11px] text-white/60 truncate">{l.note}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
