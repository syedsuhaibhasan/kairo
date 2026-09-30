import {Input} from './index';
import {useNavigate, Link} from 'react-router-dom';
import {useCallback, useState} from 'react';
import authService from '../firebase/auth';
import {login as setUser} from  '../store/authSlice';
import {useDispatch} from 'react-redux';
import {useForm} from 'react-hook-form';
import SignInWithGoogleButton from '../firebase/signWithGoogleBtnConfig'
import { Button as btnShadcn } from '../components/ui/button';

function Signup(){
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {register, handleSubmit} = useForm();

    const handleSignInWithGoogle = useCallback(async (response) => {
        try {
            const { data, error } = await authService.signInWithGoogleToken(response.credential);
            if (error) {
                throw error;
            }
            if (data) {
                dispatch(setUser(data.user));
                navigate('/');
            }
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    }, [dispatch, navigate]);

    const signup = async (data) => {
        setError('')
        try{
            const session = await authService.createUser(data.email, data.password);
            if(session){
                dispatch(setUser(session.user));
                navigate('/dashboard');
            }
        }catch(error){
            setError(error.message);
        }
    }

    return (
        <div className="flex items-center justify-center"> 
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <div className="mb-2 flex justify-center">
                    {/* <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span> */}
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                <form onSubmit={handleSubmit(signup)}>
                    <div className='space-y-5'>

                        <Input
                        label="Name: "
                        placeholder="Enter your name"
                        {...register("name", {
                            required: true
                        })} />

                        <Input
                        label="Email: "
                        placeholder="Enter your email"
                        type="email"
                        {...register("email", {
                            required: true,
                            validate: {
                                matchPattern: (value) => {
                                    // regex to validate email address
                                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                    return emailRegex.test(value);
                                }
                            }
                        })} />

                        <Input
                        label="Password: "
                        placeholder="Enter your password"
                        type = "password"
                        {...register("password", {
                            required: true,
                        })} />

                        {/* <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 ">Sign Up</button> */}
                        <btnShadcn variant="default">Sign Up</btnShadcn>
                        {/* <button
                            type="button"
                            onClick={authService.signInWithGoogle}
                            className="w-full bg-red-500 hover:bg-red-700"
                        >
                            Continue with Google
                        </button> */}

                        <SignInWithGoogleButton onCredential={handleSignInWithGoogle} />
                    </div>
                </form>
            </div>
        </div>
        
    );
}

export default Signup;