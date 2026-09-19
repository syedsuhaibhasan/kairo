import {useDispatch} from 'react-redux';
import {useState, useEffect} from 'react';
import {Input} from './index';
import {useNavigate, Link} from 'react-router-dom';
import {useForm} from 'react-hook-form'
import authService from '../firebase/auth'
import {login as setUser} from '../store/authSlice'

function Login(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {register, handleSubmit} = useForm();
    const [error, setError] = useState('');

    const login = async (data) => {
        setError('')
        try{
            const session = await authService.loginUser(data.email, data.password);
            if(session && session.user){
                const userData = await authService.getCurrentUser();
                dispatch(setUser(userData));
                navigate('/');
            }
        }catch(error){
            setError(error.message);
            console.log("Login :: login :: ", error);
        }
    }

    return(
    <div className='flex items-center justify-center w-full'>
      <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
        <div className="mb-2 flex justify-center">
          
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
        <p className="mt-2 text-center text-base text-black/60">
          Don&apos;t have any account?&nbsp;
          <Link
              to="/signup"
              className="font-medium text-primary transition-all duration-200 hover:underline"
          >
              Sign Up
          </Link>
        </p>

        <form onSubmit={handleSubmit(login)} className="mt-8">
            <div className="space-y-5">
                <Input
                    Label="Email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", {
                        required: true,
                        validate: (value) => {
                            const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Please enter a valid email address";
                        }})
                    }
                />

                <Input 
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    {...register("password", {
                        required: true,
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters"
                        }
                    })}
                />

                <button type="submit" className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
                    Login
                </button>
            </div>
        </form>    
      </div>
    </div>
    )
}   

export default Login;