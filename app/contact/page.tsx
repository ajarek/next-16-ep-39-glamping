"use client"
import Link from "next/link"
import {
  ArrowRight,
  CalendarDays,
  Mail,
  MapPin,
  MessageCircleMore,
  Phone,
  Sparkles,
} from "lucide-react"

export default function ContactPage() {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }
  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(200,149,98,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(45,62,44,0.16),transparent_30%)]'>
      <section className='mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12 md:px-8 lg:px-10 lg:py-16'>
        <div className='grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center'>
          <div className='space-y-6'>
            <div className='inline-flex items-center gap-2 rounded-full border border-brand-accent/30 bg-brand-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-brand-accent'>
              <Sparkles className='h-3.5 w-3.5' />
              Kontakt i rezerwacje
            </div>

            <div className='space-y-4'>
              <h1 className='text-4xl font-semibold tracking-tight text-fg-custom sm:text-5xl lg:text-6xl'>
                Zadbamy o Twoje chwile pod gwiazdami.
              </h1>
              <p className='max-w-2xl text-base leading-8 text-fg-custom/70 sm:text-lg'>
                Niezależnie od tego, czy planujesz romantyczny weekend, rodzinny
                wypoczynek czy wyjątkową celebrację, nasz zespół przygotuje dla
                Ciebie idealne miejsce wśród natury.
              </p>
            </div>

            <div className='flex flex-wrap gap-3'>
              <Link
                href='/locations'
                className='inline-flex items-center gap-2 rounded-full bg-brand-primary px-5 py-3 text-sm font-semibold text-brand-primary-fg transition hover:bg-brand-accent hover:text-brand-accent-fg'
              >
                Odkryj lokalizacje
                <ArrowRight className='h-4 w-4' />
              </Link>
              <a
                href='mailto:kontakt@wildhaven.pl'
                className='inline-flex items-center gap-2 rounded-full border border-border-custom bg-card-custom/70 px-5 py-3 text-sm font-semibold text-fg-custom transition hover:border-brand-accent hover:text-brand-accent'
              >
                <Mail className='h-4 w-4' />
                Napisz wiadomość
              </a>
            </div>
          </div>

          <div className='rounded-4xl border border-border-custom bg-card-custom/80 p-6 shadow-[0_25px_80px_-35px_rgba(0,0,0,0.35)] backdrop-blur-xl'>
            <div className='flex items-center gap-3'>
              <div className='rounded-2xl bg-brand-accent/15 p-3 text-brand-accent'>
                <MessageCircleMore className='h-6 w-6' />
              </div>
              <div>
                <p className='text-sm font-semibold uppercase tracking-[0.3em] text-brand-accent'>
                  Szybki kontakt
                </p>
                <h2 className='text-xl font-semibold text-fg-custom'>
                  Odpowiadamy w ciągu 24 godzin
                </h2>
              </div>
            </div>

            <div className='mt-6 space-y-4'>
              {[
                {
                  icon: Phone,
                  title: "Telefon",
                  value: "+48 500 600 700",
                  href: "tel:+48500600700",
                },
                {
                  icon: Mail,
                  title: "E-mail",
                  value: "kontakt@wildhaven.pl",
                  href: "mailto:kontakt@wildhaven.pl",
                },
                {
                  icon: MapPin,
                  title: "Lokalizacja",
                  value: "Dolina Sosen, Dolny Śląsk",
                  href: "https://maps.google.com/?q=Dolina+Sosen+Dolny+%C5%9Al%C4%85sk",
                },
              ].map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  className='flex items-center gap-3 rounded-2xl border border-border-custom/70 bg-background/70 p-4 transition hover:border-brand-accent/40 hover:bg-brand-accent/10'
                >
                  <div className='rounded-xl bg-brand-primary/10 p-2 text-brand-primary'>
                    <item.icon className='h-5 w-5' />
                  </div>
                  <div>
                    <p className='text-xs font-semibold uppercase tracking-[0.25em] text-fg-custom/50'>
                      {item.title}
                    </p>
                    <p className='text-sm font-medium text-fg-custom'>
                      {item.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className='grid gap-6 lg:grid-cols-[0.95fr_1.05fr]'>
          <div className='rounded-4xl border border-border-custom bg-card-custom/80 p-6 shadow-[0_25px_70px_-40px_rgba(0,0,0,0.35)] backdrop-blur-xl'>
            <div className='flex items-center gap-3'>
              <div className='rounded-2xl bg-brand-primary/10 p-3 text-brand-primary'>
                <CalendarDays className='h-6 w-6' />
              </div>
              <div>
                <p className='text-sm font-semibold uppercase tracking-[0.3em] text-brand-accent'>
                  Planowanie pobytu
                </p>
                <h3 className='text-xl font-semibold text-fg-custom'>
                  Pozwól nam zaprojektować idealny weekend
                </h3>
              </div>
            </div>

            <ul className='mt-6 space-y-4 text-sm leading-7 text-fg-custom/70'>
              <li className='rounded-2xl border border-border-custom/70 bg-background/60 p-4'>
                <span className='font-semibold text-fg-custom'>
                  Rezerwacje grupowe:
                </span>{" "}
                ślubów, urodzin i spotkań firmowych.
              </li>
              <li className='rounded-2xl border border-border-custom/70 bg-background/60 p-4'>
                <span className='font-semibold text-fg-custom'>
                  Dodatkowe usługi:
                </span>{" "}
                śniadania, transfery i aranżacja przestrzeni.
              </li>
              <li className='rounded-2xl border border-border-custom/70 bg-background/60 p-4'>
                <span className='font-semibold text-fg-custom'>
                  Elastyczne terminy:
                </span>{" "}
                dostosujemy ofertę do Twojego rytmu i oczekiwań.
              </li>
            </ul>
          </div>

          <div className='rounded-4xl border border-border-custom bg-card-custom/80 p-6 shadow-[0_25px_70px_-40px_rgba(0,0,0,0.35)] backdrop-blur-xl'>
            <p className='text-sm font-semibold uppercase tracking-[0.3em] text-brand-accent'>
              Formularz kontaktowy
            </p>
            <h3 className='mt-2 text-2xl font-semibold text-fg-custom'>
              Opowiedz nam o swoim planie
            </h3>
            <p className='mt-3 text-sm leading-7 text-fg-custom/70'>
              Wystarczy kilka linijek, a my przygotujemy dla Ciebie propozycję
              najlepiej dopasowaną do daty, liczby gości i klimatu podróży.
            </p>

            <form className='mt-6 space-y-4' onSubmit={handleSubmit}>
              <div className='grid gap-4 sm:grid-cols-2'>
                <label className='block text-sm text-fg-custom/70'>
                  <span className='mb-2 block font-medium'>Imię</span>
                  <input
                    type='text'
                    placeholder='Twoje imię'
                    className='w-full rounded-2xl border border-border-custom bg-background/70 px-4 py-3 text-sm outline-none transition focus:border-brand-accent'
                    required
                  />
                </label>
                <label className='block text-sm text-fg-custom/70'>
                  <span className='mb-2 block font-medium'>E-mail</span>
                  <input
                    type='email'
                    placeholder='twój@email.com'
                    className='w-full rounded-2xl border border-border-custom bg-background/70 px-4 py-3 text-sm outline-none transition focus:border-brand-accent'
                    required
                  />
                </label>
              </div>

              <label className='block text-sm text-fg-custom/70'>
                <span className='mb-2 block font-medium'>Temat</span>
                <input
                  type='text'
                  placeholder='Np. weekend w lesie'
                  className='w-full rounded-2xl border border-border-custom bg-background/70 px-4 py-3 text-sm outline-none transition focus:border-brand-accent'
                  required
                />
              </label>

              <label className='block text-sm text-fg-custom/70'>
                <span className='mb-2 block font-medium'>Wiadomość</span>
                <textarea
                  rows={4}
                  placeholder='Opowiedz nam o swoich oczekiwaniach...'
                  className='w-full rounded-2xl border border-border-custom bg-background/70 px-4 py-3 text-sm outline-none transition focus:border-brand-accent'
                  required
                />
              </label>

              <button
                type='submit'
                className='inline-flex items-center gap-2 rounded-full bg-brand-primary px-5 py-3 text-sm font-semibold text-brand-primary-fg transition hover:bg-brand-accent hover:text-brand-accent-fg'
              >
                Wyślij wiadomość
                <ArrowRight className='h-4 w-4' />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
