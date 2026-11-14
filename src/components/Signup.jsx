import {useNavigate} from 'react-router-dom';
import {useCallback, useState} from 'react';
import { Link } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import authService from '../supabase/auth';
import {login as setUser} from  '../store/authSlice';
import {useDispatch} from 'react-redux';
import {useForm} from 'react-hook-form';
import SignInWithGoogleButton from '../supabase/signWithGoogleBtnConfig'
import AuthBackground from "./AuthBackground"
import { notify } from '@/lib/notify'
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"

function Signup(){
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {register, handleSubmit} = useForm();
    const [showPassword, setShowPassword] = useState(false)

    const handleSignInWithGoogle = useCallback(async (response) => {
        try {
            if (!response?.credential) {
                throw new Error('Google did not return an ID token.');
            }

            const data = await authService.signInWithGoogleToken(response.credential);
            if (data?.user) {
                dispatch(setUser({userData: data.user}));
                navigate('/new-chat');
            }
        } catch (error) {
            setError(error.message);
            // console.error("Error signing in with Google:", error);
            notify.warning("Sign-in cancelled", "You can try again whenever you're ready.", "google-signin-failed");
        }
    }, [dispatch, navigate]);

    const signup = async (data) => {
        setError('')
        try{
            const session = await authService.createUser(data.email, data.password);
            if(session){
                dispatch(setUser(session.user));
                notify.success("Account created", "Welcome to Kairo.", "auth-signup-success");
                navigate('/dashboard');
            } else {
                setError('Signup failed');
                notify.error("Couldn't create your account", "Please check your details and try again.", "auth-signup-failed");
            }
        }catch(error){
            setError(error.message);
            notify.error("Couldn't create your account", "Please check your details and try again.", "auth-signup-failed");
        }
    }

    return (
      <AuthBackground variant="signup">
        <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-1 items-start sm:items-center justify-center py-4 sm:py-10">
            <div className="w-full max-w-md">
              <header className="mb-6 sm:mb-7 text-center text-white drop-shadow-sm px-2">
                <h1 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-balance">
                  Welcome to Kairo
                </h1>
                <p className="mt-2.5 sm:mt-3 text-sm text-white/90 sm:text-base">
                  Create your account to get started.
                </p>
              </header>

              <Card className="border-white/45 bg-white/65 p-1 shadow-2xl shadow-orange-950/15 backdrop-blur-xl">
                <CardContent className="p-5 sm:p-8">
                  <img
                    src="/svg/kairo-logo.svg"
                    alt="Kairo"
                    className="h-8 sm:h-9 w-auto mx-auto mb-5 sm:mb-6"
                    draggable={false}
                  />
                  <form onSubmit={handleSubmit(signup)} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-slate-700">
                        Name:
                      </Label>
                      <Input
                        id="signup-name"
                        placeholder="Enter your name"
                        autoFocus
                        className="h-12 min-h-11 rounded-xl border-white/70 bg-white/85 px-4 text-base shadow-sm focus-visible:border-orange-400 focus-visible:ring-orange-400/35"
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
                        className="h-12 min-h-11 rounded-xl border-white/70 bg-white/85 px-4 text-base shadow-sm focus-visible:border-orange-400 focus-visible:ring-orange-400/35"
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
                          className="h-12 min-h-11 rounded-xl border-white/70 bg-white/85 px-4 pr-12 text-base shadow-sm focus-visible:border-orange-400 focus-visible:ring-orange-400/35"
                          {...register("password", {
                            required: true,
                          })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((visible) => !visible)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-500 transition-colors hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 cursor-pointer"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <p role="alert" className="text-sm font-medium text-red-600">
                        Please check your details and try again.
                      </p>
                    )}

                    <Button
                      type="submit"
                      className="h-12 min-h-11 w-full rounded-xl bg-[#ff6b0f] text-base text-white shadow-lg shadow-orange-500/20 hover:bg-[#e95d08] cursor-pointer"
                    >
                      Sign up
                    </Button>

                    <div className="flex w-full items-center gap-3 py-1">
                      <Separator className="flex-1 bg-slate-200" />
                      <span className="text-xs text-slate-400">or</span>
                      <Separator className="flex-1 bg-slate-200" />
                    </div>

                    <div className="w-full flex justify-center overflow-hidden">
                      <div className="flex min-h-11 w-full items-center justify-center overflow-hidden">
                        <SignInWithGoogleButton onCredential={handleSignInWithGoogle} />
                      </div>
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
    );
}

export default Signup;
