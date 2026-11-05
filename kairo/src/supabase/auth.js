import { supabase } from '../../supabaseConfig'

export class AuthService {
    client;

    constructor(client) {
        this.client = client
        this.signInWithGoogle = this.signInWithGoogle.bind(this);
    }

    async signInWithGoogle() {
        try {
            const { data, error } = await this.client.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    emailRedirectTo: 'http://localhost:5173/'
                }
            })
            return data;
        } catch (error) {
            console.log("Supabase service :: OAuth Failure :: signInWithGoogle :: ", error);
        }
    }

    async signInWithGoogleToken(token) {
        try {
            const { data, error } = await this.client.auth.signInWithIdToken({
                provider: 'google',
                token
            })

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.log("Supabase service :: Google ID Token Failure :: signInWithGoogleToken :: ", error);
            throw error;
        }
    }

    async createUser(email, password) {
        try {
            const { data, error } = await this.client.auth.signUp({
                email: email,
                password: password,
                options: {
                    emailRedirectTo: 'http://localhost:5173/'
                }
                //,
                // data: {
                //     username: username
                // }
            });

            if (error) {
                throw error;
            }

            if (!data.user.email_confirmed_at) {
                await this.client.auth.signOut()
                throw new Error("Please confirm your email before signing in.")
            }


        } catch (error) {
            console.log("Supabase service :: createUser :: ", error);
        }
    }

    async loginUser(email, password) {
        try {
            const { data, error } = await this.client.auth.signInWithPassword({
                email: email,
                password: password,
            })
            return data;
        } catch (error) {
            console.log("Supabase service :: loginUser :: ", error);
        }
    }

    async logoutUser() {
        try {
            const { error } = await this.client.auth.signOut()
            if (error) {
                throw error;
            }
        } catch (error) {
            console.log("Supabase service :: logoutUser :: ", error);
        }
    }

    async getCurrentUser() {
        try {
            const { data, error } = await this.client.auth.getSession()
            if (error) {
                throw error;
            }
            return data.session.user;
        } catch (error) {
            console.log("Supabase service :: getCurrentUser :: ", error);
        }
    }
}

const authService = new AuthService(supabase);
export default authService;