"use client";

import { trackVehicleEvent } from "@/lib/events";

type Props = {
  href: string;
  vehicleId: string;
};

export default function WhatsAppButton({ href, vehicleId }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackVehicleEvent(vehicleId, "whatsapp")}
      className="block w-full rounded-2xl border border-black/10 bg-black px-6 py-4 text-center text-base font-semibold text-white transition hover:bg-[#171717]"
    >
      Falar no WhatsApp
    </a>
  );
}