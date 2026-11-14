import { supabase } from '../../supabaseConfig'


export class StorageAndDBService {
    client;

    constructor(client){
        this.client = client
    }

    
async uploadDocument(user, file, conversationId) {
    const filePath = `${user.id}/conversations/${conversationId}/documents/${crypto.randomUUID()}-${file.name}`;

    try {
        const { data, error } = await this.client.storage
            .from('kairo-private')
            .upload(filePath, file, {
                contentType: file.type,
                upsert: false,
            });

        if (error) {
            throw error;
        }
 
        return data;

    } catch (error) {
        console.error(
            "Supabase service :: uploadDocument :: Error ::",
            error
        );

        return null;
    }
}


    async deleteDocument(user, conversationId, filePath) {
    // Use the original storage path returned during upload.
    
    try {
        if (!filePath) {
            throw new Error("File storage path is missing.");
        }

        // Ensure the file belongs to this user's conversation.
        const expectedPath = `${user.id}/conversations/${conversationId}/documents/`;

        if (!filePath.startsWith(expectedPath)) {
            throw new Error("Unauthorized file deletion.");
        }

        const { data, error } = await this.client.storage
            .from('kairo-private')
            .remove([filePath]);

        if (error) {
            throw error;
        }

        console.log(
            "Supabase service :: deleteDocument :: Successfully deleted :: ",
            filePath
        );

        return data;

    } catch (error) {
        console.log("Supabase service :: deleteDocument :: error :: ", error);
        return null;
    }
}

    async uplaodProfilePicture(user, file){
        const filePath = `/profile-pictures/${user.id}/${crypto.randomUUID()}-${file.name}`;
        try{
            const {data, error} = await this.client.storage
                                            .from('kairo-public')
                                            .upload(filePath, file, {
                                                    contentType: file.type,
                                                    upsert: true,     
                                            });
            console.log("Supabase service :: uploadProfilePicture :: Successfully uploaded :: ", data.path);
            return data;
        }catch(error){
            console.log("Supabase service :: uploadProfilePicture :: error :: ", error);
            return null;
        }
    }

    async getPreviousConversations() {
    try {
        const { data, error } = await this.client
            .from('conversations')
            .select('conversation_id, title')
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return data ?? [];
    } catch (error) {
        console.log("Supabase service :: getPreviousConversations :: error :: ", error);
        return [];
        }
    }
    
    async getConversationTitle(conversationId){
        try {
            const {data, error} = await this.client
                                        .from('conversations')
                                        .select('title')
                                        .eq('conversation_id', conversationId)
            if(!data) return "New Chat";
            return data ?? []
        } catch (error) {
            console.log("Supabase service :: getConversationTitle :: error :: ", error);    
        }
    }

    async newChat(title) {
    try {
        const { data, error } = await this.client
            .from('conversations')
            .insert({ title })
            .select('conversation_id, title');   // returns an array of the inserted rows
        if (error) throw error;
        return data ?? [];
    } catch (error) {
        console.log("Supabase service :: newChat :: error :: ", error);
        }
    }

    async getChatHistory(conversationId){
        try{
            const {data, error} = await this.client.from('messages')
                                                    .select('message_id, role, content')
                                                    .eq('conversation_id', conversationId)
                                                    .order('created_at', { ascending: false })
                                                    .limit(50);

            if(!data){
                throw new Error("No chat history found for this conversation");
            }else{
                return data.reverse(); // Reverse the order to get the latest messages first
            }
        }catch(error){
            console.log("Supabase service :: getChatHistory :: error :: ", error);
        }
    }

}

const config = new StorageAndDBService(supabase);
export default config;