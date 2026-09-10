import { createClient } from '@supabase/supabase-js'
import conf from '../../conf/conf'   
export class AuthService {
    client;

    constructor(){
        this.client = createClient(conf.projectUrl, conf.publishableKey)
    }

    async signInWithGoogle(){
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
    
    async createUser(email, password, username){
        try{
            const {data , error} = await this.client.auth.signUp({
                email: email,
                password: password,
                options:{
                    emailRedirectTo: 'http://localhost:5173/'
                },
                data: {
                    username: username
                }
            });
            
            if(error){
                throw error;
            }

            if(!data.user.email_confirmed_at){
                await this.client.auth.signOut()
                throw new Error("Please confirm your email before signing in.")
            }


        }catch(error){
            console.log("Supabase service :: createUser :: ", error);
        }
    }

    async loginUser(email, password){
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

    async logoutUser(){
        try {
            if(this.client.auth.getSession().session.user){
                const { error } = await this.client.auth.signOut()
                if(error){
                    throw error;
                }
            }
        } catch (error) {
            console.log("Supabase service :: logoutUser :: ", error);
        }
    }

    async getCurrentUser(){
        try {
            const { data, error } = await this.client.auth.getSession()
            if(error){
                throw error;
            }
            return data.session.user;
        } catch (error) {
            console.log("Supabase service :: getCurrentUser :: ", error);
        }
    }
}