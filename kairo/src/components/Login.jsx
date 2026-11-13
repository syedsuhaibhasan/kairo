import { useDispatch } from 'react-redux';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'
import { Link } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import authService from '../supabase/auth'
import { login as setUser } from '../store/authSlice'
import SignInWithGoogleButton from '../supabase/signWithGoogleBtnConfig'
import { supabase } from '../../supabaseConfig'
import AuthBackground from "./AuthBackground"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false)
  
  const handleSignInWithGoogle = useCallback(async (response) => {
    try {
      if (!response?.credential) {
        throw new Error('Google did not return an ID token.');
      }

      const data = await authService.signInWithGoogleToken(response.credential);
      if (data?.user) {
        dispatch(setUser({ userData: data.user }));
        navigate('/new-chat');
      }
    } catch (error) {
      setError(error.message);
      console.error('Error signing in with Google:', error);
    }
  }, [dispatch, navigate]);

  const login = async (data) => {
    setError('')
    try {
      const session = await authService.loginUser(data.email, data.password);
      if (session && session.user) {
        const userData = await authService.getCurrentUser();
        dispatch(setUser({ userData }));
        navigate('/new-chat');
      }
    } catch (error) {
      setError(error.message);
      console.log("Login :: login :: ", error);
    }
  }

  return (
    <AuthBackground>
      <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">
            <header className="mb-7 text-center text-white drop-shadow-sm">
              <h1 className="font-serif text-5xl font-light tracking-tight sm:text-6xl">
                Welcome back
              </h1>
              <p className="mt-3 text-sm text-white/85 sm:text-base">
                What do you need help with today?
              </p>
            </header>

            <Card className="border-white/45 bg-white/65 p-1 shadow-2xl shadow-orange-950/15 backdrop-blur-xl">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit(login)} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-slate-700">
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="johndoe@example.com"
                      autoFocus
                      className="h-12 rounded-xl border-white/70 bg-white/85 px-4 shadow-sm focus-visible:border-orange-400 focus-visible:ring-orange-400/35"
                      {...register("email", {
                        required: true,
                        validate: (value) =>
                          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
                          "Please enter a valid email address",
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-slate-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="h-12 rounded-xl border-white/70 bg-white/85 px-4 pr-12 shadow-sm focus-visible:border-orange-400 focus-visible:ring-orange-400/35"
                        {...register("password", {
                          required: true,
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
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
                    className="h-12 w-full rounded-xl bg-[#ff6b0f] text-base text-white shadow-lg shadow-orange-500/20 hover:bg-[#e95d08]"
                  >
                    Sign in
                  </Button>

                  <div className="flex w-full items-center gap-3 py-1">
                    <Separator className="flex-1 bg-slate-200" />
                    <span className="text-xs text-slate-400">or</span>
                    <Separator className="flex-1 bg-slate-200" />
                  </div>

                  <div className="flex min-h-11 w-full items-center justify-center overflow-hidden">
                    <SignInWithGoogleButton onCredential={handleSignInWithGoogle} />
                  </div>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-semibold text-orange-600 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                  >
                    Sign up
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

export default Login;