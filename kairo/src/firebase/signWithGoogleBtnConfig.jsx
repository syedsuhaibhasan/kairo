import {forwardRef, useEffect, useRef} from 'react';
import conf from '../../conf/conf';

const SignInWithGoogleButton = forwardRef(({onCredential}, forwardedRef) => {
    const buttonRef = useRef(null);

    useEffect(() => {
        const googleClientId = conf.googleClientId;

        if (!googleClientId || googleClientId === 'undefined') {
            console.error('Google sign-in is not configured.');
            return;
        }

        let retryTimeout;

        const renderGoogleButton = () => {
            if (!window.google?.accounts?.id || !buttonRef.current) {
                retryTimeout = window.setTimeout(renderGoogleButton, 100);
                return;
            }

            window.google.accounts.id.initialize({
                client_id: googleClientId,
                callback: onCredential,
            });
            window.google.accounts.id.renderButton(buttonRef.current, {
                type: 'standard',
                shape: 'pill',
                theme: 'outline',
                text: 'signin_with',
                size: 'large',
                logo_alignment: 'center',
                width: Math.min(buttonRef.current.clientWidth, 400),
            });
        };

        renderGoogleButton();

        return () => {
            window.clearTimeout(retryTimeout);
        };
    }, [onCredential]);

    const setButtonRef = (element) => {
        buttonRef.current = element;

        if (typeof forwardedRef === 'function') {
            forwardedRef(element);
        } else if (forwardedRef) {
            forwardedRef.current = element;
        }
    };

    return <div ref={setButtonRef}></div>;
});

SignInWithGoogleButton.displayName = 'SignInWithGoogleButton';

export default SignInWithGoogleButton;
