// UI only, no business logic
import { useState } from "react"
import { Link } from "react-router-dom"
import { Eye, EyeOff, LoaderCircle } from "lucide-react"
import AuthBackground from "./AuthBackground"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"

function SignupView({
  register,
  handleSubmit,
  signup,
  error,
  GoogleButton,
  onGoogleCredential,
  isLoading = false,
}) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <AuthBackground variant="signup">
      <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">
            <header className="mb-7 text-center text-white drop-shadow-sm">
              <h1 className="font-serif text-5xl font-light tracking-tight sm:text-6xl">
                Create your account
              </h1>
              <p className="mt-3 text-sm text-white/90 sm:text-base">
                Start making your next step feel simpler.
              </p>
            </header>

            <Card className="border-white/45 bg-white/65 p-1 shadow-2xl shadow-orange-950/15 backdrop-blur-xl">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit(signup)} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-slate-700">
                      Name:
                    </Label>
                    <Input
                      id="signup-name"
                      placeholder="Enter your name"
                      autoFocus
                      className="h-12 rounded-xl border-white/70 bg-white/85 px-4 shadow-sm focus-visible:border-orange-400 focus-visible:ring-orange-400/35"
                      {...register("name", {
                        required: true,
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-slate-700">
                      Email:
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      className="h-12 rounded-xl border-white/70 bg-white/85 px-4 shadow-sm focus-visible:border-orange-400 focus-visible:ring-orange-400/35"
                      {...register("email", {
                        required: true,
                        validate: {
                          matchPattern: (value) => {
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                            return emailRegex.test(value)
                          },
                        },
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-slate-700">
                      Password:
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="h-12 rounded-xl border-white/70 bg-white/85 px-4 pr-12 shadow-sm focus-visible:border-orange-400 focus-visible:ring-orange-400/35"
                        {...register("password", {
                          required: true,
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-500 transition-colors hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <p role="alert" className="text-sm font-medium text-red-600">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 w-full rounded-xl bg-[#ff6b0f] text-base text-white shadow-lg shadow-orange-500/20 hover:bg-[#e95d08]"
                  >
                    {isLoading && <LoaderCircle className="animate-spin" />}
                    {isLoading ? "Creating account..." : "Sign up"}
                  </Button>

                  <div className="flex w-full items-center gap-3 py-1">
                    <Separator className="flex-1 bg-slate-200" />
                    <span className="text-xs text-slate-400">or</span>
                    <Separator className="flex-1 bg-slate-200" />
                  </div>

                  <div className="flex min-h-11 w-full items-center justify-center overflow-hidden">
                    <GoogleButton onCredential={onGoogleCredential} />
                  </div>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-orange-600 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                  >
                    Sign in
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </AuthBackground>
  )
}

export default SignupView
