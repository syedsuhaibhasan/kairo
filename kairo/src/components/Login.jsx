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
    const [, setError] = useState('');

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
      />
    )
}   

export default Login;