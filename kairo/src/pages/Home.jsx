import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Database, Layers, Smartphone, Bell, Palette } from 'lucide-react'

// Change these if your route paths are different.
const ROUTES = { chat: '/new-chat', login: '/login', signup: '/signup' }

const LINKS = {
  github: 'https://github.com/syedsuhaibhasan',
  linkedin: 'https://www.linkedin.com/in/syedmuhammadsuhaibhasan',
}

// How a message is handled: input -> (optional steps) -> model
const LANES = [
  { input: 'Text', steps: [], model: 'Text model' },
  { input: 'Text + image', steps: [], model: 'Vision model' },
  { input: 'PDF, DOC or TXT + text', steps: ['Extract text with a library'], model: 'Text model' },
]

const BACKEND = [
  { title: 'Storage buckets and the Data API', text: 'Managing storage buckets and who can access them, and reading and writing data through the Supabase Data API as well as directly in the database.' },
  { title: 'Edge Functions', text: 'How serverless Edge Functions work, and running the AI request on the server instead of in the browser.' },
  { title: 'Switching models by input', text: 'Choosing the model automatically from what the user sends: text only, text with an image, or a document with text.' },
  { title: 'Documents without a parser model', text: 'Cohere handles the language side. Instead of adding a separate parsing model, which would be slower, I extract text from PDF, DOC and TXT files with third-party libraries and send only the text to the LLM.' },
  { title: 'Logging every AI request', text: 'Saving each call to the database with the model, token counts, latency and status, for debugging and cost tracking.' },
]

const AUTH_STEPS = ['Sign up with your email', 'Check your inbox', 'Verify the email', 'Signed in']

const GUARD_RULES = [
  {
    who: 'Not signed in',
    rules: [
      { route: '/new-chat', allowed: false, result: 'Redirected to Login' },
      { route: '/chat/:id', allowed: false, result: 'Redirected to Login' },
      { route: '/login', allowed: true, result: 'Allowed' },
    ],
  },
  {
    who: 'Signed in',
    rules: [
      { route: '/login', allowed: false, result: 'Redirected to New chat' },
      { route: '/signup', allowed: false, result: 'Redirected to New chat' },
      { route: '/new-chat', allowed: true, result: 'Allowed' },
    ],
  },
]

const SECURITY = [
  { title: 'Email-verified sign-up', text: 'New accounts must confirm their email before they can sign in, so nobody gets in with a random address.' },
  { title: 'Redux in sync with Supabase Auth', text: 'Keeping the authSlice user state matched with the Supabase session on page load, login, logout and token refresh, so the UI never shows stale data.' },
  { title: 'Route guards', text: 'An AuthGuard sends signed-out visitors to Login, and signed-in users straight to New chat so they can never open Login or Sign up.' },
  { title: 'Secrets stay on the server', text: 'API keys and other secrets live in server-side Edge Functions and environment variables, never in the frontend code where anyone could read them.' },
  { title: 'Row Level Security and database design', text: 'Tables for users, conversations, messages and logs, with policies so each user can only see their own data.' },
]

const FRONTEND = [
  { icon: Layers, title: 'Structuring a real app', text: 'Nested routes, a shared layout and global state, so every page feels like one product.' },
  { icon: Smartphone, title: 'Responsive design', text: 'Building mobile-first with Tailwind and shadcn/ui so the app works from phones to wide screens.' },
  { icon: Bell, title: 'Friendly error handling', text: 'Turning technical failures into short, clear notifications instead of raw errors.' },
  { icon: Palette, title: 'Brand and design', text: 'Creating a logo, a colour palette and one consistent look across every screen.' },
]

const STACK = [
  { label: 'Frontend', items: ['React', 'Vite', 'Tailwind CSS v4', 'shadcn/ui', 'React Router', 'Redux', 'Lucide icons', 'Sonner toasts'] },
  { label: 'Backend and database', items: ['Supabase', 'PostgreSQL', 'Data API', 'Edge Functions', 'Row Level Security', 'Server-side secrets', 'Tables: users, conversations, messages, api_logs'] },
  { label: 'Authentication', items: ['Supabase Auth with email verification', 'Google Sign-In', 'Route guards', 'Redux authSlice synced with Supabase'] },
  { label: 'Storage', items: ['Supabase Storage buckets for file uploads'] },
  { label: 'AI', items: ['Cohere language model', 'Model chosen by input type', 'Text extraction libraries for PDF, DOC and TXT', 'API logs with tokens and latency'] },
  { label: 'Tooling and deployment', items: ['Bun', 'Git and GitHub', 'Vercel'] },
]

const PAGE_BG =
  'radial-gradient(1100px 560px at 50% -120px,#FF9A57 0%,rgba(255,154,87,0) 70%),' +
  'radial-gradient(640px 420px at 100% 10%,#FFC59B 0%,rgba(255,197,155,0) 70%),' +
  'radial-gradient(640px 420px at 0% 22%,rgba(255,197,155,0.7) 0%,rgba(255,197,155,0) 70%),#FFFAF6'

const btnBase =
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-transparent px-2.5 py-2 text-[13px] font-medium text-[#2B1810] transition-colors sm:px-4 sm:py-2.5 sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B0F] focus-visible:ring-offset-2'
const btnPrimary = `${btnBase} bg-[#FF6B0F] !text-white hover:bg-[#F2600A]`
const btnGhost = `${btnBase} hover:bg-white/90`
const btnOutline = `${btnBase} border-[#F0DCCB] bg-white hover:bg-[#FFF3EA]`

const socialBtn =
  'inline-flex items-center gap-2 rounded-full border border-[#F0DCCB] bg-white/90 px-[18px] py-[11px] text-sm font-medium text-[#2B1810] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B0F] focus-visible:ring-offset-2'

// Model routing chips (dark panel)
const chipInput = 'inline-block rounded-lg border border-white/20 bg-white/10 px-3 py-[7px] text-[13px] text-[#FFF4EA]'
const chipStep = 'inline-block rounded-lg border border-dashed border-[#FFB27A] px-3 py-[7px] text-[13px] text-[#FFB27A]'
const chipModel = 'inline-block rounded-lg bg-[#FF6B0F] px-3 py-[7px] text-[13px] font-medium text-[#1A0F0A]'

// Route guard chips (light panel)
const chipRoute = 'rounded-lg bg-[#1A0F0A] px-3 py-[7px] font-mono text-[13px] text-[#FFF4EA]'
const chipAllowed = 'inline-flex items-center gap-1.5 rounded-lg border border-[#F0DCCB] bg-white px-3 py-[7px] text-[13px] text-[#2B1810]'
const chipRedirect = 'inline-flex items-center gap-1.5 rounded-lg border border-[#A83A04]/25 bg-[#FDE0C8] px-3 py-[7px] text-[13px] text-[#7A2E05]'

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

// Arrow between items; the hidden text keeps the flow readable for screen readers.
function Arrow({ className = 'text-[#FFB27A]', label = 'then' }) {
  return (
    <>
      <ArrowRight className={`size-[18px] ${className}`} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </>
  )
}

function NumberedList({ items }) {
  return (
    <ol className="mt-7 grid gap-x-12 md:grid-cols-2">
      {items.map(({ title, text }, i) => (
        <li key={title} className="flex gap-[18px] border-t border-[#F0DCCB] py-[22px]">
          <span aria-hidden="true" className="w-11 shrink-0 font-serif text-[30px] leading-none text-[#A83A04]">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div>
            <h4 className="mb-1.5 font-serif text-[22px] font-normal leading-tight">{title}</h4>
            <p className="text-sm leading-relaxed text-[#6F4636]">{text}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

function Home() {
  return (
    <div className="min-h-dvh px-4 pt-4 text-[#2B1810]" style={{ background: PAGE_BG }}>
      {/* Top bar */}
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-[1120px] items-center justify-between gap-3 rounded-[18px] border border-white/90 bg-white/80 px-3 py-2 shadow-lg shadow-orange-950/10 backdrop-blur-md sm:px-4 sm:py-2.5"
      >
        <Link to="/" aria-label="Kairo home" className="shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B0F]">
          <img src="/svg/kairo-logo.svg" alt="" className="hidden h-[30px] w-auto sm:block" />
          <img src="/svg/kairo-mark.svg" alt="" className="size-[34px] sm:hidden" />
        </Link>
        <div className="flex items-center gap-1.5">
          <Link to={ROUTES.chat} className={btnPrimary}>Chat with Kairo</Link>
          <Link to={ROUTES.login} className={btnGhost}>Login</Link>
          <Link to={ROUTES.signup} className={btnOutline}>Sign up</Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="mx-auto max-w-[880px] px-2 pt-16 text-center sm:pt-[72px]">
        <span className="inline-block rounded-full bg-white/75 px-3.5 py-1.5 text-[13px] text-[#6F4636]">
          A portfolio project
        </span>
        <h1 className="mt-5 font-serif text-[clamp(42px,7vw,76px)] font-light leading-[1.05]">
          Welcome to <em className="font-normal text-[#A83A04]">Kairo</em>
        </h1>
        <p className="mx-auto mt-[18px] max-w-[620px] text-[17px] leading-relaxed text-[#6F4636]">
          A full-stack AI chat app, built from scratch with real authentication, a secure database and a clean, responsive interface.
        </p>

        <div className="mt-11 flex flex-col items-center">
          <img
            src="/profile.jpg"
            alt="Portrait of Syed Muhammad Suhaib Hasan"
            width={132}
            height={132}
            className="size-[132px] rounded-full border-4 border-white object-cover shadow-xl shadow-orange-950/20"
          />
          <p className="mt-4 text-[13px] text-[#6F4636]">Built by</p>
          <p className="mt-0.5 font-serif text-[28px] leading-tight">Syed Muhammad Suhaib Hasan</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className={socialBtn}>
              <GithubIcon />
              GitHub
            </a>
            <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className={socialBtn}>
              <LinkedinIcon />
              LinkedIn
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1120px] px-2 pt-20 sm:pt-[88px]">
        {/* What I learned */}
        <section aria-labelledby="learned-heading">
          <h2 id="learned-heading" className="font-serif text-[clamp(30px,4vw,40px)] font-normal leading-tight">
            What I learned
          </h2>
          <p className="mt-2.5 text-[15px] text-[#6F4636]">Lessons from building Kairo from scratch.</p>

          {/* Backend and AI */}
          <h3 className="mt-14 font-serif text-[28px] font-normal leading-tight">Backend and AI</h3>

          <div className="mt-7 rounded-[28px] bg-[#1A0F0A] p-5 text-[#FFF4EA] sm:p-9">
            <div className="grid items-center gap-x-12 gap-y-7 lg:grid-cols-2">
              <div>
                <p className="text-[13px] text-[#E8C9B2]">How a message is handled</p>
                <h4 className="mt-2.5 font-serif text-[clamp(26px,3.4vw,34px)] font-normal leading-[1.15] text-[#FFF4EA]">
                  Kairo picks the model from the input
                </h4>
                <p className="mt-3.5 text-[15px] leading-relaxed text-[#E8C9B2]">
                  Text, images and documents each take their own path. For files, the text is pulled out with third-party libraries and sent to the text model, so no extra parsing model slows the reply down.
                </p>
              </div>
              <ul>
                {LANES.map(({ input, steps, model }) => (
                  <li key={input} className="flex flex-wrap items-center gap-2.5 border-t border-white/15 py-4 first:border-t-0">
                    <span className={chipInput}>{input}</span>
                    {steps.map((step) => (
                      <Fragment key={step}>
                        <Arrow />
                        <span className={chipStep}>{step}</span>
                      </Fragment>
                    ))}
                    <Arrow />
                    <span className={chipModel}>{model}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 flex items-center gap-2.5 border-t border-white/15 pt-[18px] text-sm text-[#E8C9B2]">
              <Database className="size-[18px] shrink-0 text-[#FFB27A]" aria-hidden="true" />
              Every request is then logged: the model used, tokens and response time.
            </div>
          </div>

          <NumberedList items={BACKEND} />

          {/* Authentication and security */}
          <h3 className="mt-14 font-serif text-[28px] font-normal leading-tight">Authentication and security</h3>

          <div className="mt-7 rounded-[28px] border border-[#F0DCCB] bg-white/80 p-5 sm:p-9">
            <div className="grid items-center gap-x-12 gap-y-7 lg:grid-cols-2">
              <div>
                <p className="text-[13px] text-[#6F4636]">How access is controlled</p>
                <h4 className="mt-2.5 font-serif text-[clamp(26px,3.4vw,34px)] font-normal leading-[1.15]">
                  Verified, synced and guarded
                </h4>
                <p className="mt-3.5 text-[15px] leading-relaxed text-[#6F4636]">
                  New users must verify their email first. The Redux user state stays in sync with the Supabase session, and route guards decide which pages each visitor can open.
                </p>
              </div>
              <ol className="flex flex-col gap-3.5">
                {AUTH_STEPS.map((step, i) => (
                  <li key={step} className="flex items-center gap-3">
                    <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#FF6B0F] text-[13px] font-medium text-[#1A0F0A]">
                      {i + 1}
                    </span>
                    <span className="text-[15px]">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-7 grid gap-x-8 gap-y-6 border-t border-[#F0DCCB] pt-6 md:grid-cols-2">
              {GUARD_RULES.map(({ who, rules }) => (
                <div key={who}>
                  <h5 className="text-sm font-medium">{who}</h5>
                  <ul className="mt-3 flex flex-col gap-2.5">
                    {rules.map(({ route, allowed, result }) => (
                      <li key={route} className="flex flex-wrap items-center gap-2.5">
                        <code className={chipRoute}>{route}</code>
                        <Arrow className="text-[#A83A04]" label="leads to" />
                        {allowed ? (
                          <span className={chipAllowed}>
                            <Check className="size-3.5" aria-hidden="true" />
                            {result}
                          </span>
                        ) : (
                          <span className={chipRedirect}>
                            <ArrowRight className="size-3.5" aria-hidden="true" />
                            {result}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <NumberedList items={SECURITY} />

          {/* Frontend and product */}
          <h3 className="mt-14 font-serif text-[28px] font-normal leading-tight">Frontend and product</h3>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {FRONTEND.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-4 rounded-[18px] border border-[#F0DCCB] bg-white/80 p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FDE0C8] text-[#8A3405]">
                  <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div>
                  <h4 className="mb-1 font-serif text-[21px] font-normal leading-tight">{title}</h4>
                  <p className="text-sm leading-relaxed text-[#6F4636]">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* What it is built with */}
        <section aria-labelledby="stack-heading" className="mt-[72px]">
          <h2 id="stack-heading" className="font-serif text-[clamp(30px,4vw,40px)] font-normal leading-tight">
            What it is built with
          </h2>
          <p className="mt-2.5 text-[15px] text-[#6F4636]">The tools behind every part of the app.</p>
          <div className="mt-7 rounded-3xl border border-[#F0DCCB] bg-white/80 px-6 py-1.5">
            {STACK.map(({ label, items }) => (
              <div key={label} className="flex flex-wrap gap-x-6 gap-y-3 border-t border-[#F0DCCB] py-[18px] first:border-t-0">
                <h3 className="shrink-0 basis-[170px] text-sm font-medium">{label}</h3>
                <ul className="flex min-w-[240px] flex-1 flex-wrap gap-2">
                  {items.map((item) => (
                    <li key={item} className="rounded-full border border-[#F0DCCB] bg-white px-3 py-1.5 text-[13px]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="mx-auto mt-[72px] max-w-[1120px] border-t border-[#F0DCCB] px-2 pb-9 pt-7 text-center text-[13px] text-[#6F4636]">
        Kairo is a portfolio project by Syed Muhammad Suhaib Hasan, 2026.
      </footer>
    </div>
  )
}

export default Home