"use server";

import { z } from "zod";

const bookingSchema = z.object({
  locationId: z.string().min(1, "Identyfikator lokalizacji jest wymagany"),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Niepoprawna data rozpoczęcia",
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Niepoprawna data zakończenia",
  }),
  guestsCount: z.number().min(1, "Minimalna liczba gości to 1").max(10, "Maksymalna liczba gości to 10"),
  fullName: z.string().min(3, "Imię i nazwisko musi mieć co najmniej 3 znaki"),
  email: z.string().email("Niepoprawny adres e-mail"),
  phone: z.string().min(9, "Numer telefonu musi mieć co najmniej 9 cyfr"),
  addons: z.array(z.string()),
  totalPrice: z.number().min(0, "Cena nie może być ujemna"),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export async function createBooking(data: BookingInput) {
  // Walidacja danych po stronie serwera
  const validationResult = bookingSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const validatedData = validationResult.data;

  try {
    // Symulacja zapisu do bazy danych serwera (np. logowanie na serwerze lub zapis do zewnętrznego API)
    console.log("Rezerwacja zapisana na serwerze:", validatedData);

    // Zwracamy sukces
    return {
      success: true,
      bookingId: `res_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      data: validatedData,
    };
  } catch (error) {
    console.error("Błąd zapisu rezerwacji:", error);
    return {
      success: false,
      message: "Wystąpił nieoczekiwany błąd podczas zapisywania rezerwacji.",
    };
  }
}
