"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Check,
  HelpCircle,
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CreditCard,
  ChevronRight,
  Building2,
  MapPin,
  DollarSign,
  Tag,
  Star,
  Upload,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react"
import { addLocation, loginUser, registerUser } from "@/app/lib/firebase"

// --- Typy ---
interface Plan {
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  features: string[]
  cta: string
  isPopular: boolean
}

type Step = "pricing" | "login" | "payment" | "form" | "success"

// --- Dane planów ---
const plans: Plan[] = [
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
    cta: "Wybierz Starter",
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
    cta: "Wybierz Enterprise",
    isPopular: false,
  },
]

// --- Pasek postępu ---
const stepLabels: Record<Step, string> = {
  pricing: "Wybierz plan",
  login: "Logowanie",
  payment: "Płatność",
  form: "Twoja oferta",
  success: "Gotowe!",
}

const stepOrder: Step[] = ["pricing", "login", "payment", "form", "success"]

function ProgressBar({ currentStep }: { currentStep: Step }) {
  const currentIndex = stepOrder.indexOf(currentStep)

  return (
    <div className='w-full max-w-2xl mx-auto mb-12'>
      <div className='flex items-center justify-between relative'>
        {/* Linia łącząca */}
        <div className='absolute top-4 left-0 right-0 h-0.5 bg-border-custom z-0' />
        <motion.div
          className='absolute top-4 left-0 h-0.5 bg-brand-accent z-0'
          initial={{ width: "0%" }}
          animate={{
            width: `${(currentIndex / (stepOrder.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {stepOrder.map((step, index) => {
          const isDone = index < currentIndex
          const isActive = index === currentIndex

          return (
            <div key={step} className='flex flex-col items-center gap-2 z-10'>
              <motion.div
                animate={{
                  backgroundColor: isDone
                    ? "var(--accent)"
                    : isActive
                      ? "var(--primary)"
                      : "var(--background)",
                  borderColor:
                    isDone || isActive ? "var(--accent)" : "var(--border)",
                  scale: isActive ? 1.15 : 1,
                }}
                transition={{ duration: 0.3 }}
                className='w-8 h-8 rounded-full border-2 flex items-center justify-center'
              >
                {isDone ? (
                  <Check className='w-4 h-4 text-white' />
                ) : (
                  <span
                    className={`text-[10px] font-bold ${isActive ? "text-brand-primary-fg" : "text-fg-custom/40"}`}
                  >
                    {index + 1}
                  </span>
                )}
              </motion.div>
              <span
                className={`text-[9px] font-bold tracking-wider uppercase hidden sm:block ${
                  isActive
                    ? "text-brand-accent"
                    : isDone
                      ? "text-fg-custom/60"
                      : "text-fg-custom/30"
                }`}
              >
                {stepLabels[step]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// --- Krok 1: Cennik ---
function PricingStep({
  onSelect,
}: {
  onSelect: (plan: Plan, isYearly: boolean) => void
}) {
  const [isYearly, setIsYearly] = useState(true)

  return (
    <motion.div
      key='pricing'
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4 }}
    >
      <div className='text-center max-w-2xl mx-auto mb-12'>
        <span className='text-xs font-bold tracking-[0.2em] text-brand-accent uppercase'>
          KROK 1 — PLANY SUBSKRYPCYJNE
        </span>
        <h2 className='mt-3 text-3xl font-light text-fg-custom tracking-tight'>
          Wybierz plan i dołącz do Wild Haven
        </h2>
        <p className='mt-4 text-sm text-fg-custom/60 font-light leading-relaxed'>
          Oferuj pobyty butikowe w profesjonalnej oprawie wizualnej i
          technologicznej. Nasze witryny konwertują odwiedzających na rezerwacje
          od pierwszego dnia.
        </p>

        {/* Przełącznik rozliczenia */}
        <div className='flex items-center justify-center gap-3 mt-8'>
          <span
            className={`text-xs font-semibold ${!isYearly ? "text-fg-custom" : "text-fg-custom/40"}`}
          >
            Miesięczne
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
              Roczne
            </span>
            <span className='bg-brand-accent/10 text-brand-accent text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider'>
              -20%
            </span>
          </div>
        </div>
      </div>

      {/* Karty planów */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto'>
        {plans.map((plan) => {
          const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice

          return (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 ${
                plan.isPopular
                  ? "border-brand-accent bg-card-custom shadow-xl scale-105 z-10 md:-translate-y-2 ring-1 ring-brand-accent/20"
                  : "border-border-custom bg-card-custom/50 hover:bg-card-custom hover:shadow-lg"
              }`}
            >
              {plan.isPopular && (
                <div className='absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-accent text-brand-accent-fg text-[9px] font-black tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1 shadow-md'>
                  <Sparkles className='w-3 h-3 fill-current' />
                  NAJCZĘŚCIEJ WYBIERANY
                </div>
              )}

              <div>
                <h3 className='text-xl font-bold text-fg-custom'>
                  {plan.name}
                </h3>
                <p className='text-xs text-fg-custom/60 mt-2 font-light leading-relaxed'>
                  {plan.description}
                </p>

                <div className='mt-6 pb-6 border-b border-border-custom flex items-baseline gap-2'>
                  <span className='text-4xl font-black text-fg-custom tracking-tight'>
                    {price}
                  </span>
                  <span className='text-xs text-fg-custom/60 ml-1 font-medium'>
                    PLN
                  </span>
                  <span className='text-xs text-fg-custom/60 ml-2 font-medium'>
                    / miesiąc
                  </span>
                </div>

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

              <button
                onClick={() => onSelect(plan, isYearly)}
                className={`mt-10 w-full py-3.5 rounded-full text-xs font-bold tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  plan.isPopular
                    ? "bg-brand-accent text-brand-accent-fg hover:bg-brand-primary hover:text-brand-primary-fg shadow-md hover:shadow-lg"
                    : "border border-border-custom text-fg-custom hover:bg-brand-muted/10"
                }`}
              >
                {plan.cta}
                <ChevronRight className='w-3.5 h-3.5' />
              </button>
            </div>
          )
        })}
      </div>

      <div className='text-center mt-12 flex justify-center items-center gap-2 text-xs text-fg-custom/40 font-medium'>
        <HelpCircle className='w-4 h-4' />
        <span>
          Masz pytania odnośnie wdrożenia? Skonsultuj się z naszym zespołem
          technicznym.
        </span>
      </div>
    </motion.div>
  )
}

// --- Krok 2: Logowanie ---
function LoginStep({
  onNext,
  onBack,
}: {
  onNext: () => void
  onBack: () => void
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [mode, setMode] = useState<"login" | "register">("login")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setAuthError(null)

    try {
      if (mode === "login") {
        await loginUser(email, password)
      } else {
        await registerUser(email, password)
      }
      onNext()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Nieznany błąd"
      console.error("Błąd autoryzacji:", errorMessage)

      if (errorMessage.includes("auth/user-not-found")) {
        setAuthError("Nie znaleziono użytkownika o podanym adresie e-mail.")
      } else if (errorMessage.includes("auth/wrong-password")) {
        setAuthError("Nieprawidłowe hasło.")
      } else if (errorMessage.includes("auth/email-already-in-use")) {
        setAuthError("Konto o tym adresie e-mail już istnieje.")
      } else if (errorMessage.includes("auth/weak-password")) {
        setAuthError("Hasło jest zbyt słabe — minimum 6 znaków.")
      } else if (errorMessage.includes("auth/invalid-email")) {
        setAuthError("Nieprawidłowy format adresu e-mail.")
      } else {
        setAuthError("Wystąpił błąd logowania. Spróbuj ponownie.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      key='login'
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4 }}
      className='max-w-md mx-auto'
    >
      <div className='text-center mb-10'>
        <span className='text-xs font-bold tracking-[0.2em] text-brand-accent uppercase'>
          KROK 2 — KONTO
        </span>
        <h2 className='mt-3 text-3xl font-light text-fg-custom tracking-tight'>
          {mode === "login" ? "Zaloguj się" : "Utwórz konto"}
        </h2>
        <p className='mt-3 text-sm text-fg-custom/60 font-light'>
          {mode === "login"
            ? "Zaloguj się, aby kontynuować dodawanie oferty."
            : "Zarejestruj się, aby zarządzać swoją ofertą."}
        </p>
      </div>

      <div className='bg-card-custom border border-border-custom rounded-3xl p-8 shadow-xl'>
        {authError && (
          <div className='mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-medium text-center'>
            {authError}
          </div>
        )}
        {/* Przełącznik trybu */}
        <div className='flex rounded-2xl bg-bg-custom border border-border-custom p-1 mb-8'>
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer ${
                mode === m
                  ? "bg-brand-primary text-brand-primary-fg shadow-sm"
                  : "text-fg-custom/50 hover:text-fg-custom"
              }`}
            >
              {m === "login" ? "LOGOWANIE" : "REJESTRACJA"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className='space-y-5'>
          {/* Email */}
          <div>
            <label className='block text-xs font-semibold text-fg-custom/70 mb-2 tracking-wider'>
              ADRES E-MAIL
            </label>
            <div className='relative'>
              <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-custom/40' />
              <input
                type='email'
                id='offer-email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='twoj@email.com'
                className='w-full pl-11 pr-4 py-3.5 rounded-2xl bg-bg-custom border border-border-custom text-sm text-fg-custom placeholder:text-fg-custom/30 focus:outline-none focus:border-brand-accent transition-colors'
              />
            </div>
          </div>

          {/* Hasło */}
          <div>
            <label className='block text-xs font-semibold text-fg-custom/70 mb-2 tracking-wider'>
              HASŁO
            </label>
            <div className='relative'>
              <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-custom/40' />
              <input
                type={showPassword ? "text" : "password"}
                id='offer-password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Minimum 8 znaków'
                className='w-full pl-11 pr-12 py-3.5 rounded-2xl bg-bg-custom border border-border-custom text-sm text-fg-custom placeholder:text-fg-custom/30 focus:outline-none focus:border-brand-accent transition-colors'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-fg-custom/40 hover:text-fg-custom transition-colors cursor-pointer'
                aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
              >
                {showPassword ? (
                  <EyeOff className='w-4 h-4' />
                ) : (
                  <Eye className='w-4 h-4' />
                )}
              </button>
            </div>
          </div>

          {mode === "register" && (
            <div>
              <label className='block text-xs font-semibold text-fg-custom/70 mb-2 tracking-wider'>
                POTWIERDŹ HASŁO
              </label>
              <div className='relative'>
                <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-custom/40' />
                <input
                  type={showPassword ? "text" : "password"}
                  id='offer-password-confirm'
                  required
                  placeholder='Powtórz hasło'
                  className='w-full pl-11 pr-4 py-3.5 rounded-2xl bg-bg-custom border border-border-custom text-sm text-fg-custom placeholder:text-fg-custom/30 focus:outline-none focus:border-brand-accent transition-colors'
                />
              </div>
            </div>
          )}

          <button
            type='submit'
            disabled={isLoading}
            className='w-full py-3.5 rounded-full text-xs font-bold tracking-widest bg-brand-primary text-brand-primary-fg hover:bg-brand-accent hover:text-brand-accent-fg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed mt-2 cursor-pointer'
          >
            {isLoading ? (
              <span className='flex items-center justify-center gap-2'>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className='w-4 h-4 border-2 border-current border-t-transparent rounded-full'
                />
                Weryfikacja…
              </span>
            ) : mode === "login" ? (
              "ZALOGUJ SIĘ"
            ) : (
              "UTWÓRZ KONTO"
            )}
          </button>
        </form>
      </div>

      <button
        onClick={onBack}
        className='mt-6 flex items-center gap-2 text-xs text-fg-custom/50 hover:text-fg-custom transition-colors mx-auto cursor-pointer'
      >
        <ArrowLeft className='w-3.5 h-3.5' />
        Wróć do wyboru planu
      </button>
    </motion.div>
  )
}

// --- Krok 3: Płatność ---
function PaymentStep({
  selectedPlan,
  isYearly,
  onNext,
  onBack,
}: {
  selectedPlan: Plan
  isYearly: boolean
  onNext: () => void
  onBack: () => void
}) {
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")
  const [cardName, setCardName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const price = isYearly ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice

  const formatCardNumber = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16)
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ")
  }

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4)
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2)
    return digits
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Symulacja płatności
    setTimeout(() => {
      setIsLoading(false)
      onNext()
    }, 1800)
  }

  return (
    <motion.div
      key='payment'
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4 }}
      className='max-w-lg mx-auto'
    >
      <div className='text-center mb-10'>
        <span className='text-xs font-bold tracking-[0.2em] text-brand-accent uppercase'>
          KROK 3 — PŁATNOŚĆ
        </span>
        <h2 className='mt-3 text-3xl font-light text-fg-custom tracking-tight'>
          Finalizuj zamówienie
        </h2>
      </div>

      {/* Podsumowanie zamówienia */}
      <div className='bg-brand-accent/5 border border-brand-accent/20 rounded-2xl p-5 mb-6 flex items-center justify-between'>
        <div>
          <p className='text-xs text-fg-custom/60 font-light'>Wybrany plan</p>
          <p className='font-bold text-fg-custom mt-0.5'>
            Wild Haven {selectedPlan.name}
          </p>
          <p className='text-xs text-fg-custom/50 mt-0.5'>
            Rozliczenie {isYearly ? "roczne" : "miesięczne"}
          </p>
        </div>
        <div className='text-right'>
          <span className='text-3xl font-black text-brand-accent'>{price}</span>
          <span className='text-xs text-fg-custom/60 ml-1 font-medium'>
            PLN
          </span>
          <span className='text-xs text-fg-custom/50 ml-1'>/ mies.</span>
        </div>
      </div>

      <div className='bg-card-custom border border-border-custom rounded-3xl p-8 shadow-xl'>
        <div className='flex items-center gap-2 mb-6'>
          <CreditCard className='w-5 h-5 text-brand-accent' />
          <span className='text-sm font-semibold text-fg-custom'>
            Dane karty płatniczej
          </span>
          <span className='ml-auto text-[10px] text-fg-custom/40 tracking-wider'>
            BEZPIECZNA PŁATNOŚĆ SSL
          </span>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Numer karty */}
          <div>
            <label className='block text-xs font-semibold text-fg-custom/70 mb-2 tracking-wider'>
              NUMER KARTY
            </label>
            <input
              type='text'
              id='card-number'
              required
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder='0000 0000 0000 0000'
              className='w-full px-4 py-3.5 rounded-2xl bg-bg-custom border border-border-custom text-sm text-fg-custom placeholder:text-fg-custom/30 focus:outline-none focus:border-brand-accent transition-colors font-mono'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            {/* Data ważności */}
            <div>
              <label className='block text-xs font-semibold text-fg-custom/70 mb-2 tracking-wider'>
                DATA WAŻNOŚCI
              </label>
              <input
                type='text'
                id='card-expiry'
                required
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder='MM/RR'
                className='w-full px-4 py-3.5 rounded-2xl bg-bg-custom border border-border-custom text-sm text-fg-custom placeholder:text-fg-custom/30 focus:outline-none focus:border-brand-accent transition-colors font-mono'
              />
            </div>

            {/* CVC */}
            <div>
              <label className='block text-xs font-semibold text-fg-custom/70 mb-2 tracking-wider'>
                KOD CVC
              </label>
              <input
                type='text'
                id='card-cvc'
                required
                value={cvc}
                onChange={(e) =>
                  setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))
                }
                placeholder='000'
                className='w-full px-4 py-3.5 rounded-2xl bg-bg-custom border border-border-custom text-sm text-fg-custom placeholder:text-fg-custom/30 focus:outline-none focus:border-brand-accent transition-colors font-mono'
              />
            </div>
          </div>

          {/* Imię na karcie */}
          <div>
            <label className='block text-xs font-semibold text-fg-custom/70 mb-2 tracking-wider'>
              IMIĘ I NAZWISKO (NA KARCIE)
            </label>
            <input
              type='text'
              id='card-name'
              required
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder='JAN KOWALSKI'
              className='w-full px-4 py-3.5 rounded-2xl bg-bg-custom border border-border-custom text-sm text-fg-custom placeholder:text-fg-custom/30 focus:outline-none focus:border-brand-accent transition-colors uppercase'
            />
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full py-4 rounded-full text-sm font-bold tracking-widest bg-brand-accent text-brand-accent-fg hover:bg-brand-primary hover:text-brand-primary-fg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed mt-4 cursor-pointer'
          >
            {isLoading ? (
              <span className='flex items-center justify-center gap-2'>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className='w-4 h-4 border-2 border-current border-t-transparent rounded-full'
                />
                Przetwarzanie płatności…
              </span>
            ) : (
              `ZAPŁAĆ PLN ${isYearly ? selectedPlan.yearlyPrice * 12 : selectedPlan.monthlyPrice} ${isYearly ? "ROCZNIE" : "MIESIĘCZNIE"}`
            )}
          </button>
        </form>
      </div>

      <button
        onClick={onBack}
        className='mt-6 flex items-center gap-2 text-xs text-fg-custom/50 hover:text-fg-custom transition-colors mx-auto cursor-pointer'
      >
        <ArrowLeft className='w-3.5 h-3.5' />
        Wróć do logowania
      </button>
    </motion.div>
  )
}

// --- Krok 4: Formularz oferty ---
function OfferFormStep({
  selectedPlan,
  onNext,
  onBack,
}: {
  selectedPlan: Plan
  onNext: () => void
  onBack: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    locationName: "",
    description: "",
    price: "",
    rating: "5",
    tags: "",
    details: "",
    features: "",
    image: "/images/forest-haven.png",
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSaveError(null)

    try {
      const newLocation = {
        name: formData.name,
        locationName: formData.locationName,
        description: formData.description,
        price: Number(formData.price) || 0,
        rating: Number(formData.rating) || 5,
        image: formData.image.trim() || "/images/forest-haven.png",
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        coords: { x: 51.1 + Math.random() * 2, y: 17.0 + Math.random() * 2 },
        details: formData.details,
        features: formData.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
      }

      await addLocation(newLocation)
      onNext()
    } catch (err) {
      console.error("Błąd zapisu oferty:", err)
      setSaveError(
        "Nie udało się zapisać oferty w bazie danych. Spróbuj ponownie.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      key='form'
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4 }}
      className='max-w-2xl mx-auto'
    >
      <div className='text-center mb-10'>
        <span className='text-xs font-bold tracking-[0.2em] text-brand-accent uppercase'>
          KROK 4 — TWOJA OFERTA
        </span>
        <h2 className='mt-3 text-3xl font-light text-fg-custom tracking-tight'>
          Opublikuj swój obiekt
        </h2>
        <p className='mt-3 text-sm text-fg-custom/60 font-light'>
          Uzupełnij dane swojego obiektu glampingowego — plan:{" "}
          <span className='text-brand-accent font-semibold'>
            {selectedPlan.name}
          </span>
        </p>
      </div>

      <div className='bg-card-custom border border-border-custom rounded-3xl p-8 shadow-xl'>
        {saveError && (
          <div className='mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-medium text-center'>
            {saveError}
          </div>
        )}
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Nazwa obiektu */}
          <div>
            <label className='block text-xs font-semibold text-fg-custom/70 mb-2 tracking-wider'>
              NAZWA OBIEKTU
            </label>
            <div className='relative'>
              <Building2 className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-custom/40' />
              <input
                type='text'
                name='name'
                id='offer-name'
                required
                value={formData.name}
                onChange={handleChange}
                placeholder='np. Dolina Sosen — Jurta Safari'
                className='w-full pl-11 pr-4 py-3.5 rounded-2xl bg-bg-custom border border-border-custom text-sm text-fg-custom placeholder:text-fg-custom/30 focus:outline-none focus:border-brand-accent transition-colors'
              />
            </div>
          </div>

          {/* Lokalizacja */}
          <div>
            <label className='block text-xs font-semibold text-fg-custom/70 mb-2 tracking-wider'>
              LOKALIZACJA
            </label>
            <div className='relative'>
              <MapPin className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-custom/40' />
              <input
                type='text'
                name='locationName'
                id='offer-location'
                required
                value={formData.locationName}
                onChange={handleChange}
                placeholder='np. Dolny Śląsk, Polska'
                className='w-full pl-11 pr-4 py-3.5 rounded-2xl bg-bg-custom border border-border-custom text-sm text-fg-custom placeholder:text-fg-custom/30 focus:outline-none focus:border-brand-accent transition-colors'
              />
            </div>
          </div>

          {/* Cena i ocena */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-xs font-semibold text-fg-custom/70 mb-2 tracking-wider'>
                CENA ZA NOC (PLN)
              </label>
              <div className='relative'>
                <DollarSign className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-custom/40' />
                <input
                  type='number'
                  name='price'
                  id='offer-price'
                  required
                  min='1'
                  value={formData.price}
                  onChange={handleChange}
                  placeholder='350'
                  className='w-full pl-11 pr-4 py-3.5 rounded-2xl bg-bg-custom border border-border-custom text-sm text-fg-custom placeholder:text-fg-custom/30 focus:outline-none focus:border-brand-accent transition-colors'
                />
              </div>
            </div>

            <div>
              <label className='block text-xs font-semibold text-fg-custom/70 mb-2 tracking-wider'>
                OCENA (1–5)
              </label>
              <div className='relative'>
                <Star className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-custom/40' />
                <select
                  name='rating'
                  id='offer-rating'
                  value={formData.rating}
                  onChange={handleChange}
                  className='w-full pl-11 pr-4 py-3.5 rounded-2xl bg-bg-custom border border-border-custom text-sm text-fg-custom focus:outline-none focus:border-brand-accent transition-colors appearance-none'
                >
                  {[5, 4.9, 4.8, 4.7, 4.5, 4.0].map((v) => (
                    <option key={v} value={v}>
                      ⭐ {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tagi */}
          <div>
            <label className='block text-xs font-semibold text-fg-custom/70 mb-2 tracking-wider'>
              TAGI (oddzielone przecinkiem)
            </label>
            <div className='relative'>
              <Tag className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-custom/40' />
              <input
                type='text'
                name='tags'
                id='offer-tags'
                value={formData.tags}
                onChange={handleChange}
                placeholder='np. Jurta, Widok na las, Sauna, Pet-friendly'
                className='w-full pl-11 pr-4 py-3.5 rounded-2xl bg-bg-custom border border-border-custom text-sm text-fg-custom placeholder:text-fg-custom/30 focus:outline-none focus:border-brand-accent transition-colors'
              />
            </div>
          </div>

          {/* Opis */}
          <div>
            <label className='block text-xs font-semibold text-fg-custom/70 mb-2 tracking-wider'>
              KRÓTKI OPIS
            </label>
            <textarea
              name='description'
              id='offer-description'
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder='Opisz w kilku zdaniach wyjątkowość swojego obiektu…'
              className='w-full px-4 py-3.5 rounded-2xl bg-bg-custom border border-border-custom text-sm text-fg-custom placeholder:text-fg-custom/30 focus:outline-none focus:border-brand-accent transition-colors resize-none'
            />
          </div>

          {/* Szczegóły */}
          <div>
            <label className='block text-xs font-semibold text-fg-custom/70 mb-2 tracking-wider'>
              SZCZEGÓŁOWY OPIS OFERTY
            </label>
            <textarea
              name='details'
              id='offer-details'
              rows={4}
              value={formData.details}
              onChange={handleChange}
              placeholder='Więcej informacji dla gości — co oferujesz, jak dojechać, regulamin…'
              className='w-full px-4 py-3.5 rounded-2xl bg-bg-custom border border-border-custom text-sm text-fg-custom placeholder:text-fg-custom/30 focus:outline-none focus:border-brand-accent transition-colors resize-none'
            />
          </div>

          {/* Udogodnienia */}
          <div>
            <label className='block text-xs font-semibold text-fg-custom/70 mb-2 tracking-wider'>
              UDOGODNIENIA (oddzielone przecinkiem)
            </label>
            <input
              type='text'
              name='features'
              id='offer-features'
              value={formData.features}
              onChange={handleChange}
              placeholder='np. Prywatna sauna, Wi-Fi, Aneks kuchenny, Łazienka en-suite'
              className='w-full px-4 py-3.5 rounded-2xl bg-bg-custom border border-border-custom text-sm text-fg-custom placeholder:text-fg-custom/30 focus:outline-none focus:border-brand-accent transition-colors'
            />
          </div>

          {/* Ścieżka do obrazu */}
          <div>
            <label className='block text-xs font-semibold text-fg-custom/70 mb-2 tracking-wider'>
              ŚCIEŻKA DO ZDJĘCIA GŁÓWNEGO
            </label>
            <div className='relative'>
              <Upload className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-custom/40' />
              <input
                type='text'
                name='image'
                id='offer-image'
                value={formData.image}
                onChange={handleChange}
                placeholder='/images/forest-haven.png'
                className='w-full pl-11 pr-4 py-3.5 rounded-2xl bg-bg-custom border border-border-custom text-sm text-fg-custom placeholder:text-fg-custom/30 focus:outline-none focus:border-brand-accent transition-colors'
              />
            </div>
            <p className='mt-2 text-xs text-fg-custom/50'>
              Podaj ścieżkę do obrazu, np. /images/forest-haven.png lub
              /public/images/nazwa.jpg.
            </p>
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full py-4 rounded-full text-sm font-bold tracking-widest bg-brand-primary text-brand-primary-fg hover:bg-brand-accent hover:text-brand-accent-fg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer'
          >
            {isLoading ? (
              <span className='flex items-center justify-center gap-2'>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className='w-4 h-4 border-2 border-current border-t-transparent rounded-full'
                />
                Publikowanie oferty…
              </span>
            ) : (
              "OPUBLIKUJ OFERTĘ"
            )}
          </button>
        </form>
      </div>

      <button
        onClick={onBack}
        className='mt-6 flex items-center gap-2 text-xs text-fg-custom/50 hover:text-fg-custom transition-colors mx-auto cursor-pointer'
      >
        <ArrowLeft className='w-3.5 h-3.5' />
        Wróć do płatności
      </button>
    </motion.div>
  )
}

// --- Krok 5: Sukces ---
function SuccessStep({ selectedPlan }: { selectedPlan: Plan }) {
  return (
    <motion.div
      key='success'
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className='max-w-lg mx-auto text-center'
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
        className='w-24 h-24 rounded-full bg-brand-accent/10 border-2 border-brand-accent flex items-center justify-center mx-auto mb-8'
      >
        <CheckCircle2 className='w-12 h-12 text-brand-accent' />
      </motion.div>

      <h2 className='text-4xl font-light text-fg-custom tracking-tight'>
        Oferta opublikowana!
      </h2>
      <p className='mt-4 text-sm text-fg-custom/60 font-light leading-relaxed'>
        Twój obiekt glampingowy został pomyślnie dodany do platformy Wild Haven
        w planie{" "}
        <span className='text-brand-accent font-semibold'>
          {selectedPlan.name}
        </span>
        . Wkrótce pojawi się w wynikach wyszukiwania.
      </p>

      <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <Link
          href='/'
          className='flex items-center justify-center gap-2 py-3.5 rounded-full border border-border-custom text-xs font-bold tracking-widest text-fg-custom hover:bg-brand-muted/10 transition-all duration-300'
        >
          WRÓĆ DO STRONY GŁÓWNEJ
        </Link>
        <Link
          href='/'
          className='flex items-center justify-center gap-2 py-3.5 rounded-full bg-brand-accent text-brand-accent-fg text-xs font-bold tracking-widest hover:bg-brand-primary hover:text-brand-primary-fg transition-all duration-300 shadow-md'
        >
          ZARZĄDZAJ OFERTĄ
        </Link>
      </div>

      <div className='mt-12 text-xs text-fg-custom/30 tracking-wider'>
        Potwierdzenie i dane dostępowe zostały wysłane na Twój adres e-mail.
      </div>
    </motion.div>
  )
}

// --- Główna strona ---
export default function DodajOfertePage() {
  const [step, setStep] = useState<Step>("pricing")
  const [selectedPlan, setSelectedPlan] = useState<Plan>(plans[1])
  const [isYearly, setIsYearly] = useState(true)

  const handleSelectPlan = (plan: Plan, yearly: boolean) => {
    setSelectedPlan(plan)
    setIsYearly(yearly)
    setStep("login")
  }

  return (
    <div className='min-h-screen bg-bg-custom'>
      {/* Dekoracyjne tło */}
      <div className='fixed inset-0 pointer-events-none overflow-hidden'>
        <div className='absolute top-0 right-0 w-150 h-150 bg-brand-accent/3 rounded-full blur-3xl' />
        <div className='absolute bottom-0 left-0 w-125 h-125 bg-brand-primary/5 rounded-full blur-3xl' />
      </div>

      <div className='relative z-10 max-w-7xl mx-auto px-6 py-16'>
        {/* Nagłówek strony */}
        <div className='text-center mb-14'>
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className='text-xs font-bold tracking-[0.25em] text-brand-accent uppercase'>
              WILD HAVEN — PARTNER
            </span>
            <h1 className='mt-3 text-4xl md:text-5xl font-light text-fg-custom tracking-tight'>
              Dodaj swoją ofertę
            </h1>
            <p className='mt-4 text-sm text-fg-custom/60 font-light max-w-xl mx-auto leading-relaxed'>
              Cztery proste kroki dzielą Cię od publikacji luksusowego obiektu
              glampingowego na platformie Wild Haven.
            </p>
          </motion.div>
        </div>

        {/* Pasek postępu */}
        {step !== "success" && <ProgressBar currentStep={step} />}

        {/* Treść kroku */}
        <AnimatePresence mode='wait'>
          {step === "pricing" && (
            <PricingStep key='pricing' onSelect={handleSelectPlan} />
          )}
          {step === "login" && (
            <LoginStep
              key='login'
              onNext={() => setStep("payment")}
              onBack={() => setStep("pricing")}
            />
          )}
          {step === "payment" && (
            <PaymentStep
              key='payment'
              selectedPlan={selectedPlan}
              isYearly={isYearly}
              onNext={() => setStep("form")}
              onBack={() => setStep("login")}
            />
          )}
          {step === "form" && (
            <OfferFormStep
              key='form'
              selectedPlan={selectedPlan}
              onNext={() => setStep("success")}
              onBack={() => setStep("payment")}
            />
          )}
          {step === "success" && (
            <SuccessStep key='success' selectedPlan={selectedPlan} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
