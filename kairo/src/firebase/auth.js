import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendSignInLinkToEmail, sendEmailVerification, signOut } from "firebase/auth"

export class AuthService{
    auth;
    constructor() {
        this.auth = getAuth()
    }

    actionCodeSettings = {
        url: 'http://localhost:5173/',
        handleCodeInApp: false,
    };


    async signUp (email, password)  {
        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password)
            await sendEmailVerification(userCredential.user, this.actionCodeSettings)
            await this.signOut(this.auth)
        } catch (error) {
            console.log("Firebase Service :: signUp :: error", error)
            
        }
    }

    async login(email, password){
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password)
            const user = userCredential.user;

            if (!user.emailVerified) {
                await this.signOut(this.auth);
                throw new Error("Please verify your email address before logging in.");
            }

            return user;
        } catch (error) {
            console.log("Firebase Service :: login :: error", error);
            
        }
    }
}

const authService = new AuthService();

export default authService;