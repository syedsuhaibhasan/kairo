import { getFirestore, collection, addDoc } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import app from '../../firebaseConfig'

export class Service{
    db;
    constructor() {
        this.db = getFirestore(app)
    }

    async newConversation(title, userId){
        try {
            const conversationsRef = collection(this.db, 'conversations');
            await addDoc(conversationsRef, {
                title: title,
                userId: userId,
                createdAt: new Date()
            })
        } catch (error) {
         console.log("Firebase Service :: newConversation :: error", error);
        }
    }

    async getPreviousConversations(userId){
        try{
            const conversationsRef = collection(this.db, 'conversations');
            const fetchConversations = await getDocs(query(conversationsRef, where(userId, '==', userId)));
            const conversations = [];
            fetchConversations.map((doc) => {
                conversations.push({
                    id: doc.id,
                    ...doc.data()
                })
            })
            return conversations;
        } catch (error) {
            console.log("Firebase Service :: getPreviousConversations :: error", error);
        }
    }

}