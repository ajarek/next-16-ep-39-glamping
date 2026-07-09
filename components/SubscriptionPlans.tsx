"use client"

import { useState } from "react"
import { Check, HelpCircle, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function SubscriptionPlans() {
  const [isYearly, setIsYearly] = useState(true)

  const plans = [
    {
      name: "Starter",
      description: "Dla niezależnych właścicieli jednego luksusowego kempingu.",
      monthlyPrice: 29,
      yearlyPrice: 23,
      features: [
        "1 dedykowana subdomena obiektu",
        "Wieloetapowy formularz rezerwacji",
        "Podstawowy panel administracyjny",
        "Zapisywanie rezerwacji w Firebase/Local",
        "Wsparcie mailowe (do 48h)",
      ],
      cta: "Rozpocznij okres próbny",
      isPopular: false,
    },
    {
      name: "Pro",
      description:
        "Dla rosnących ośrodków posiadających kilka unikalnych obiektów.",
      monthlyPrice: 79,
      yearlyPrice: 63,
      features: [
        "Do 5 subdomen dla różnych obiektów",
        "Integracja z systemami płatności Stripe/PayU",
        "Synchronizacja kalendarza iCal (Airbnb, Booking)",
        "Zaawansowane statystyki i raporty",
        "Własna konfiguracja bazy danych Firebase",
        "Wsparcie priorytetowe 24/7",
      ],
      cta: "Wybierz pakiet Pro",
      isPopular: true,
    },
    {
      name: "Enterprise",
      description: "Dla agencji turystycznych i rozbudowanych sieci kempingów.",
      monthlyPrice: 199,
      yearlyPrice: 159,
      features: [
        "Nielimitowana liczba obiektów i subdomen",
        "Podpięcie własnej domeny (custom domain)",
        "Integracje z zewnętrznymi systemami PMS i API",
        "Indywidualny layout i branding strony",
        "Dedykowany opiekun konta",
        "Brak opłat prowizyjnych od rezerwacji",
      ],
      cta: "Skontaktuj się z nami",
      isPopular: false,
    },
  ]

  return (
    <section
      id='pricing'
      className='py-24 px-6 bg-background transition-colors border-t border-border-custom relative overflow-hidden'
    >
      {/* Ozdobny rozbłysk w tle */}
      <div className='absolute bottom-0 right-0 w-125 h-125 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none' />

      <div className='max-w-7xl mx-auto relative z-10'>
        {/* Nagłówek Sekcji */}
        <div className='text-center max-w-2xl mx-auto mb-16'>
          <span className='text-xs font-bold tracking-[0.2em] text-brand-accent uppercase'>
            PLANY SUBISRYPCYJNE
          </span>
          <h2 className='mt-3 text-3xl font-light text-fg-custom tracking-tight'>
            Dołącz do Wild Haven jako Partner
          </h2>
          <p className='mt-4 text-sm text-fg-custom/60 font-light leading-relaxed'>
            Oferuj pobyty butikowe w profesjonalnej oprawie wizualnej i
            technologicznej. Nasze witryny konwertują odwiedzających na
            rezerwacje od pierwszego dnia.
          </p>

          {/* Przełącznik Miesięczny / Roczny */}
          <div className='flex items-center justify-center gap-3 mt-10'>
            <span
              className={`text-xs font-semibold ${!isYearly ? "text-fg-custom" : "text-fg-custom/40"}`}
            >
              Rozliczenie miesięczne
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className='relative w-12 h-6 rounded-full bg-brand-primary p-1 focus:outline-none transition-colors duration-300 cursor-pointer'
              aria-label='Przełącz okres rozliczeniowy'
            >
              <motion.div
                animate={{ x: isYearly ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className='w-4 h-4 rounded-full bg-brand-primary-fg'
              />
            </button>
            <div className='flex items-center gap-1.5'>
              <span
                className={`text-xs font-semibold ${isYearly ? "text-fg-custom" : "text-fg-custom/40"}`}
              >
                Rozliczenie roczne
              </span>
              <span className='bg-brand-accent/10 text-brand-accent text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider'>
                OSZCZĘDZASZ 20%
              </span>
            </div>
          </div>
        </div>

        {/* Karty Planów */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto'>
          {plans.map((plan) => {
            const currentPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice

            return (
              <div
                key={plan.name}
                className={`relative rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 ${
                  plan.isPopular
                    ? "border-brand-accent bg-card-custom shadow-xl scale-105 z-10 md:-translate-y-2 ring-1 ring-brand-accent/20"
                    : "border-border-custom bg-card-custom/50 hover:bg-card-custom hover:shadow-lg"
                }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className='absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-accent text-brand-accent-fg text-[9px] font-black tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1 shadow-md'>
                    <Sparkles className='w-3 h-3 fill-current' />
                    NAJCZĘŚCIEJ WYBIERANY
                  </div>
                )}

                <div>
                  {/* Nazwa i opis */}
                  <h3 className='text-xl font-bold text-fg-custom'>
                    {plan.name}
                  </h3>
                  <p className='text-xs text-fg-custom/60 mt-2 font-light leading-relaxed'>
                    {plan.description}
                  </p>

                  {/* Cena */}
                  <div className='mt-6 pb-6 border-b border-border-custom flex items-baseline'>
                    <span className='text-4xl font-black text-fg-custom tracking-tight'>
                      ${currentPrice}
                    </span>
                    <span className='text-xs text-fg-custom/60 ml-2 font-medium'>
                      / miesiąc
                    </span>
                  </div>

                  {/* Cechy */}
                  <ul className='mt-8 space-y-4'>
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className='flex items-start gap-3 text-xs text-fg-custom/80 font-light'
                      >
                        <Check className='w-4 h-4 text-brand-accent shrink-0 mt-0.5' />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Przycisk CTA */}
                <button
                  className={`mt-10 w-full py-3.5 rounded-full text-xs font-bold tracking-widest transition-all duration-300 cursor-pointer ${
                    plan.isPopular
                      ? "bg-brand-accent text-brand-accent-fg hover:bg-brand-primary hover:text-brand-primary-fg shadow-md hover:shadow-lg"
                      : "border border-border-custom text-fg-custom hover:bg-brand-muted/10"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            )
          })}
        </div>

        {/* Stopka cennika */}
        <div className='text-center mt-12 flex justify-center items-center gap-2 text-xs text-fg-custom/40 font-medium'>
          <HelpCircle className='w-4 h-4' />
          <span>
            Masz pytania odnośnie wdrożenia? Skonsultuj się z naszym zespołem
            technicznym.
          </span>
        </div>
      </div>
    </section>
  )
}
