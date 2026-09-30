import {useNavigate} from 'react-router-dom';
import {useCallback, useState} from 'react';
import authService from '../firebase/auth';
import {login as setUser} from  '../store/authSlice';
import {useDispatch} from 'react-redux';
import {useForm} from 'react-hook-form';
import SignInWithGoogleButton from '../firebase/signWithGoogleBtnConfig'
import SignupView from './SignupView';

function Signup(){
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {register, handleSubmit} = useForm();

    const handleSignInWithGoogle = useCallback(async (response) => {
        try {
            if (!response?.credential) {
                throw new Error('Google did not return an ID token.');
            }

            const data = await authService.signInWithGoogleToken(response.credential);
            if (data?.user) {
                dispatch(setUser({userData: data.user}));
                navigate('/');
            }
        } catch (error) {
            setError(error.message);
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
        <SignupView
            register={register}
            handleSubmit={handleSubmit}
            signup={signup}
            error={error}
            GoogleButton={SignInWithGoogleButton}
            onGoogleCredential={handleSignInWithGoogle}
        />
    );
}

export default Signup;