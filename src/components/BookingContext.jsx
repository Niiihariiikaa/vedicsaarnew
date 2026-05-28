import { createContext, useContext, useState, useCallback } from "react";
import BookingModal from "./BookingModal";
import VaastuBookingModal from "./VaastuBookingModal";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState("");
  const [isVaastuOpen, setIsVaastuOpen] = useState(false);

  const openBooking = useCallback((service = "") => {
    setPreselectedService(service);
    setIsOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setIsOpen(false);
    setPreselectedService("");
  }, []);

  const openVaastuBooking = useCallback(() => {
    setIsVaastuOpen(true);
  }, []);

  const closeVaastuBooking = useCallback(() => {
    setIsVaastuOpen(false);
  }, []);

  return (
    <BookingContext.Provider value={{ openBooking, openVaastuBooking }}>
      {children}
      <BookingModal
        isOpen={isOpen}
        onClose={closeBooking}
        preselectedService={preselectedService}
      />
      <VaastuBookingModal
        isOpen={isVaastuOpen}
        onClose={closeVaastuBooking}
      />
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}