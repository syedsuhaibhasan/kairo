import {config as DBService} from '../supabase/config';
import { useNavigate } from 'react-router-dom';
import {useState, useEffect} from 'react';


function PreviousConversations(){
    const [conversations, setConversations] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConversations = async () => {
             try{
            const fetchedConversations = await DBService.getPreviousConversations();
            if(fetchedConversations){ // Check if fetchedConversations is not null or undefined
                setConversations(fetchedConversations);
            }
        }catch(error){
            console.log("PreviousConversations :: useEffect :: error :: ", error);
        }
    };
    fetchConversations();
    }, [conversations])

    const cancelCreate = () => {
        setIsCreating(false);
        setNewTitle('');
        setCreateError('');
    }

    const handleCreateNewChat = async(e) => {
        e.preventDefault(); 
        const title = newTitle.trim();

        if(!title || isSubmittting) return;

        setIsSubmittting(true);
        try{
            setCreateError('');
            const data = await DBService.newChat(title);
            const created = data?.[0];

            if(!created?.conversation_id){
                setError("Failed to create new chat. Please try again.");
                return;
            }

            setConversations(prev => [...prev, created]);
            cancelCreate();
            navigate(`/chat/${created.conversation_id}`);
        }finally{
            setIsSubmittting(false);
        }
    }

    return(
        <aside className="fixed inset-y-4 left-4 hidden w-[264px] flex-col gap-4 rounded-3xl border border-white/80 bg-white/60 p-[18px] shadow-xl shadow-orange-950/10 backdrop-blur md:flex">
            <div className="flex items-center gap-2">
                <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#ff6b0f] font-serif text-lg text-white">
                    k
                </div>
                <span className="font-serif text-2xl text-[#2B1810]">Kairo</span>
            </div>

            {isCreating ? (
                <form onSubmit={handleCreateNewChat} className="flex flex-col gap-2">
                    <label htmlFor="new-chat-title" className="sr-only">Chat name</label>
                    <input
                        id="new-chat-title"
                        type="text"
                        autoFocus                                   // cursor goes straight into the input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Escape') cancelCreate(); }} 
                        maxLength={255}                             
                        disabled={isSubmitting}
                        placeholder="Name your chat"
                        className="w-full rounded-[14px] border border-[#F0DCCB] bg-white/90 px-3 py-3 text-sm text-[#2B1810] placeholder:text-[#7D5F4E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b0f]"
                    />
                    {/* role="alert" makes screen readers announce the error immediately */}
                    {createError && (
                        <p role="alert" className="text-xs text-[#A83A04]">{createError}</p>
                    )}
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={!newTitle.trim() || isSubmitting}  // can't submit an empty name or submit twice
                            className="flex-1 rounded-xl bg-[#ff6b0f] py-2 text-sm font-medium text-white disabled:opacity-60"
                        >
                            {isSubmitting ? 'Creating...' : 'Create'}
                        </button>
                        <button
                            type="button"                            // type="button" so it doesn't submit the form
                            onClick={cancelCreate}
                            disabled={isSubmitting}
                            className="rounded-xl px-3 py-2 text-sm text-[#2B1810] hover:bg-white/85"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <button
                    type="button"
                    className="w-full rounded-[14px] bg-[#ff6b0f] py-3 text-sm font-medium text-white"
                    onClick={() => setIsCreating(true)}              // opens the name input
                >
                    New chat
                </button>
            )}

            <nav aria-label="Previous chats" className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                    <p className="py-3 text-sm text-[#6F4636]">No conversations yet</p>
                ) : (
                    <div className="space-y-1">
                        {conversations.map((conversation) => (
                            <button
                                key={conversation.conversation_id}
                                type="button"
                                className="w-full truncate rounded-xl px-2.5 py-2 text-left text-sm text-[#2B1810] hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b0f]"
                                onClick={() => navigate(`/chat/${conversation.conversation_id}`)}
                            >
                                {conversation.title || 'New chat'}
                            </button>
                        ))}
                    </div>
                )}
            </nav>

            <div className="flex items-center gap-2 border-t border-[#F0DCCB] pt-3.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FDE0C8] text-sm text-[#7A2E05]">
                    U
                </div>
            </div>
        </aside>
    )
}