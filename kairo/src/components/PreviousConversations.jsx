import DBService from '../supabase/config';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import authService from '@/supabase/auth';

function PreviousConversations() {
    const [conversations, setConversations] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState('');
    const reduxUser = useSelector((state) => state.auth?.userData);
    const [currentUser, setCurrentUser] = useState(reduxUser || null);

    const navigate = useNavigate();
    const { conversation_id } = useParams();

    useEffect(() => {
        if (reduxUser) {
            setCurrentUser(reduxUser);
        }
    }, [reduxUser]);

    useEffect(() => {
        let isMounted = true;
        const fetchUser = async () => {
            try {
                const user = await authService.getCurrentUser();
                if (isMounted && user) {
                    setCurrentUser(user);
                }
            } catch (error) {
                console.log("PreviousConversations :: fetchUser error :: ", error);
            }
        };
        fetchUser();
        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        let isMounted = true;
        const fetchConversations = async () => {
            try {
                const fetchedConversations = await DBService.getPreviousConversations();
                if (isMounted && fetchedConversations) {
                    setConversations(fetchedConversations);
                }
            } catch (error) {
                console.log("PreviousConversations :: useEffect :: error :: ", error);
            }
        };
        fetchConversations();
        return () => { isMounted = false; };
    }, []);

    const cancelCreate = () => {
        setIsCreating(false);
        setNewTitle('');
        setCreateError('');
    };

    const handleCreateNewChat = async (e) => {
        e.preventDefault();
        const title = newTitle.trim();

        if (!title || isSubmitting) return;

        setIsSubmitting(true);
        try {
            setCreateError('');
            const data = await DBService.newChat(title);
            const created = data?.[0];

            if (!created?.conversation_id) {
                setCreateError("Failed to create new chat. Please try again.");
                return;
            }

            setConversations(prev => [created, ...prev]);
            cancelCreate();
            navigate(`/chat/${created.conversation_id}`);
        } catch (err) {
            console.log("PreviousConversations :: handleCreateNewChat error :: ", err);
            setCreateError("Failed to create new chat. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const userObj = currentUser?.userData || currentUser;
    const userName =
        userObj?.user_metadata?.full_name ||
        userObj?.user_metadata?.name ||
        (userObj?.email ? userObj.email.split('@')[0] : '') ||
        'User';
    const userInitial = userName ? userName.charAt(0).toUpperCase() : 'U';

    return (
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
                        autoFocus
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Escape') cancelCreate(); }}
                        maxLength={255}
                        disabled={isSubmitting}
                        placeholder="Name your chat"
                        className="w-full rounded-[14px] border border-[#F0DCCB] bg-white/90 px-3 py-3 text-sm text-[#2B1810] placeholder:text-[#7D5F4E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b0f]"
                    />
                    {createError && (
                        <p role="alert" className="text-xs text-[#A83A04]">{createError}</p>
                    )}
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={!newTitle.trim() || isSubmitting}
                            className="flex-1 rounded-xl bg-[#ff6b0f] py-2 text-sm font-medium text-white disabled:opacity-60 cursor-pointer"
                        >
                            {isSubmitting ? 'Creating...' : 'Create'}
                        </button>
                        <button
                            type="button"
                            onClick={cancelCreate}
                            disabled={isSubmitting}
                            className="rounded-xl px-3 py-2 text-sm text-[#2B1810] hover:bg-white/85 cursor-pointer disabled:opacity-60"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <button
                    type="button"
                    className="w-full rounded-[14px] bg-[#ff6b0f] py-3 text-sm font-medium text-white hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
                    onClick={() => {
                        setIsCreating(true);
                        setIsSubmitting(false);
                    }}
                >
                    New chat
                </button>
            )}

            <nav aria-label="Previous chats" className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                    <p className="py-3 text-sm text-[#6F4636]">No conversations yet</p>
                ) : (
                    <div className="space-y-1">
                        {conversations.map((conversation) => {
                            const isActive = conversation.conversation_id === conversation_id;
                            return (
                                <button
                                    key={conversation.conversation_id}
                                    type="button"
                                    aria-current={isActive ? 'page' : undefined}
                                    className={`w-full truncate rounded-xl px-2.5 py-2 text-left text-sm text-[#2B1810] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b0f] cursor-pointer ${isActive ? 'bg-white font-medium shadow-sm' : 'hover:bg-white/85'
                                        }`}
                                    onClick={() => navigate(`/chat/${conversation.conversation_id}`)}
                                >
                                    {conversation.title || 'New chat'}
                                </button>
                            );
                        })}
                    </div>
                )}
            </nav>

            <div className="flex items-center gap-2.5 border-t border-[#F0DCCB] pt-3.5 px-1 min-w-0">
                {
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FDE0C8] font-serif text-sm font-medium text-[#7A2E05]">
                        {userInitial}
                    </div>
                }
                <span className="truncate text-sm font-medium text-[#2B1810]" title={userName}>
                    {userName}
                </span>
            </div>
        </aside>
    );
}

export default PreviousConversations;