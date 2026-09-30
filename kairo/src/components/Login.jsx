import {useDispatch} from 'react-redux';
import {useCallback, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form'
import authService from '../firebase/auth'
import {login as setUser} from '../store/authSlice'
import SignInWithGoogleButton from '../firebase/signWithGoogleBtnConfig'
import LoginView from './LoginView'

function Login(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {register, handleSubmit} = useForm();
    const [error, setError] = useState('');

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
            console.error('Error signing in with Google:', error);
        }
    }, [dispatch, navigate]);

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
      <LoginView
        register={register}
        handleSubmit={handleSubmit}
        login={login}
        GoogleButton={SignInWithGoogleButton}
        onGoogleCredential={handleSignInWithGoogle}
        error={error}
      />
    )
}   

export default Login;