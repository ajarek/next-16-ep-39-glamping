import Link from "next/link"
import {
  ArrowRight,
  Compass,
  Leaf,
  Sparkles,
  Trees,
  ShieldCheck,
} from "lucide-react"

const values = [
  {
    title: "Bliskość z naturą",
    text: "Każda lokalizacja została wybrana tak, by dać Ci poczucie oddechu, ciszy i prawdziwego resetu.",
    icon: Trees,
  },
  {
    title: "Luksus bez kompromisów",
    text: "Łączymy wygodę, design i funkcjonalność, by wypoczynek był zarówno wyjątkowy, jak i bezproblemowy.",
    icon: Sparkles,
  },
  {
    title: "Odpowiedzialny styl podróżowania",
    text: "Wspieramy rozwiązania przyjazne środowisku, z szacunkiem do krajobrazu i lokalnej społeczności.",
    icon: Leaf,
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(45,62,44,0.16),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(200,149,98,0.18),_transparent_28%)]">
      <section className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12 md:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-accent/30 bg-brand-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-brand-accent">
              <Compass className="h-3.5 w-3.5" />
              O nas
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-fg-custom sm:text-5xl lg:text-6xl">
                Tworzymy miejsca, które przywracają kontakt z sobą i światem.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-fg-custom/70 sm:text-lg">
                Wild Haven to przestrzeń dla osób, które szukają chwili wytchnienia
                bez rezygnacji z komfortu. Łączymy dziką naturę, estetykę i ciepło
                domowego wypoczynku w jedno niezapomniane doświadczenie.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/locations"
                className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-5 py-3 text-sm font-semibold text-brand-primary-fg transition hover:bg-brand-accent hover:text-brand-accent-fg"
              >
                Odkryj nasze miejsca
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border-custom bg-card-custom/70 px-5 py-3 text-sm font-semibold text-fg-custom transition hover:border-brand-accent hover:text-brand-accent"
              >
                Skontaktuj się z nami
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border-custom bg-card-custom/80 p-8 shadow-[0_25px_80px_-35px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-brand-primary/10 p-3 text-brand-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-accent">
                  Nasza filozofia
                </p>
                <h2 className="text-xl font-semibold text-fg-custom">
                  Wypoczynek, który zostawia ślad dobra
                </h2>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-sm leading-7 text-fg-custom/70">
              <p>
                Każde miejsce w naszej ofercie zostało stworzone z myślą o osobach,
                które cenią spokój, piękno i autentyczność. Nie szukamy tylko
                luksusu – szukamy głębi i harmonii.
              </p>
              <p>
                Dlatego w Wild Haven łączymy naturalne materiały, świadome
                rozwiązania i starannie dobrane dodatki, by pobyt był przyjemny,
                komfortowy i pełen magii.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {values.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="rounded-[1.6rem] border border-border-custom bg-card-custom/80 p-6 shadow-[0_20px_70px_-40px_rgba(0,0,0,0.3)] backdrop-blur-xl"
              >
                <div className="rounded-2xl bg-brand-accent/10 p-3 text-brand-accent inline-flex">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-fg-custom">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-fg-custom/70">
                  {item.text}
                </p>
              </div>
            )
          })}
        </div>

        <div className="rounded-[2rem] border border-border-custom bg-card-custom/80 p-8 shadow-[0_25px_80px_-40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-accent">
                Dlaczego my
              </p>
              <h3 className="mt-2 text-3xl font-semibold text-fg-custom">
                Wierzymy, że najlepszy wypoczynek zaczyna się od dobrej energii miejsca.
              </h3>
            </div>
            <div className="rounded-[1.5rem] border border-border-custom bg-background/70 p-6 text-sm leading-8 text-fg-custom/70">
              <p>
                Każdy pobyt jest dla nas okazją do stworzenia czegoś wyjątkowego —
                od szczegółów w pokoju po sposób, w jaki witamy gości. Chcemy,
                aby Twoja podróż była spokojna, inspirująca i pełna pięknych
                wspomnień.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
