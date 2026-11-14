import DBService from '../supabase/config';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import authService from '@/supabase/auth';
import { LogOut, MessageSquare, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';

function PreviousConversations({ mobileOpen = false, onClose }) {
    const [conversations, setConversations] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState('');
    const [showLogout, setShowLogout] = useState(false);
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

    const handleLogout = async () => {
        try {
            await authService.logoutUser();
        } catch (error) {
            console.log("PreviousConversations :: logout error :: ", error);
        }
        navigate('/login');
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
            onClose?.();
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
        <aside
            id="sidebar-drawer"
            className={`fixed inset-y-0 left-0 z-50 flex w-[min(86vw,320px)] flex-col gap-4 border-r border-[#F0DCCB]/80 bg-white/95 p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl backdrop-blur transition-transform duration-200 motion-reduce:transition-none lg:fixed lg:inset-y-4 lg:left-4 lg:z-auto lg:w-[264px] lg:flex lg:flex-col lg:rounded-3xl lg:border lg:border-white/80 lg:bg-white/60 lg:p-[18px] lg:shadow-xl lg:shadow-orange-950/10 lg:transition-none lg:translate-x-0 lg:visible ${
                mobileOpen ? 'translate-x-0' : '-translate-x-full max-lg:invisible'
            }`}
        >
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    <img
                        src="/svg/kairo-logo.svg"
                        alt="Kairo"
                        className="h-7 w-auto shrink-0"
                        draggable={false}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="warm" className="text-[10px] tracking-wider uppercase font-semibold px-2 py-0.5 border-[#F0DCCB] shrink-0">
                        v2.0
                    </Badge>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close chat history"
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-[#6F4636] hover:bg-white/80 lg:hidden cursor-pointer transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {isCreating ? (
                <form onSubmit={handleCreateNewChat} className="flex flex-col gap-2">
                    <label htmlFor="new-chat-title" className="sr-only">Chat name</label>
                    <Input
                        id="new-chat-title"
                        type="text"
                        autoFocus
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Escape') cancelCreate(); }}
                        maxLength={255}
                        disabled={isSubmitting}
                        placeholder="Name your chat"
                        className="w-full min-h-11 lg:min-h-0 rounded-[14px] border border-[#F0DCCB] bg-white/90 px-3 py-3 h-auto text-sm text-[#2B1810] placeholder:text-[#7D5F4E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b0f]"
                    />
                    {createError && (
                        <p role="alert" className="text-xs text-[#A83A04]">{createError}</p>
                    )}
                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            disabled={!newTitle.trim() || isSubmitting}
                            className="flex-1 min-h-11 lg:min-h-0 rounded-xl bg-[#ff6b0f] py-2 h-auto text-sm font-medium text-white disabled:opacity-60 cursor-pointer flex items-center justify-center"
                        >
                            {isSubmitting ? 'Creating...' : 'Create'}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={cancelCreate}
                            disabled={isSubmitting}
                            className="min-h-11 lg:min-h-0 rounded-xl px-3 py-2 h-auto text-sm text-[#2B1810] hover:bg-white/85 cursor-pointer disabled:opacity-60 flex items-center justify-center"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            ) : (
                <Button
                    type="button"
                    className="w-full min-h-11 lg:min-h-0 rounded-[14px] bg-[#ff6b0f] py-3 h-auto text-sm font-medium text-white hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer shadow-md shadow-orange-800/15 flex items-center justify-center"
                    onClick={() => {
                        setIsCreating(true);
                        setIsSubmitting(false);
                    }}
                >
                    New chat
                </Button>
            )}

            <nav aria-label="Previous chats" className="flex-1 overflow-y-auto">
                <div className="flex items-center justify-between px-1 mb-2">
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-[#7D5F4E]/80">
                        Conversations
                    </span>
                    {conversations.length > 0 && (
                        <Badge variant="subtle" className="text-[10px] px-1.5 py-0 text-[#7D5F4E]">
                            {conversations.length}
                        </Badge>
                    )}
                </div>

                {conversations.length === 0 ? (
                    <p className="py-3 text-sm text-[#6F4636] px-1">No conversations yet</p>
                ) : (
                    <div className="space-y-1">
                        {conversations.map((conversation) => {
                            const isActive = conversation.conversation_id === conversation_id;
                            return (
                                <button
                                    key={conversation.conversation_id}
                                    type="button"
                                    aria-current={isActive ? 'page' : undefined}
                                    className={`w-full min-h-11 lg:min-h-0 flex items-center gap-2 truncate rounded-xl px-2.5 py-2 text-left text-sm text-[#2B1810] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b0f] cursor-pointer ${
                                        isActive
                                            ? 'bg-white font-medium shadow-sm border border-[#F0DCCB]/60'
                                            : 'hover:bg-white/85'
                                    }`}
                                    onClick={() => {
                                        navigate(`/chat/${conversation.conversation_id}`);
                                        onClose?.();
                                    }}
                                >
                                    <MessageSquare
                                        size={13}
                                        className={`shrink-0 ${isActive ? 'text-[#ff6b0f]' : 'text-[#7D5F4E]/60'}`}
                                    />
                                    <span className="truncate">
                                        {conversation.title || 'New chat'}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </nav>

            <div className="relative border-t border-[#F0DCCB] pt-3.5 px-1">
                {showLogout && (
                    <div className="absolute bottom-full left-1 right-1 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleLogout}
                            className="w-full min-h-11 lg:min-h-0 flex items-center justify-center gap-2 rounded-xl bg-white border border-[#F0DCCB] py-2 h-auto text-sm font-medium text-[#A83A04] shadow-md shadow-orange-950/5 hover:bg-[#FFF4EC] hover:text-[#A83A04] transition-colors cursor-pointer"
                        >
                            <LogOut size={16} />
                            Log out
                        </Button>
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => setShowLogout((prev) => !prev)}
                    className="flex w-full min-h-11 lg:min-h-0 items-center gap-2.5 min-w-0 text-left hover:bg-white/60 rounded-xl p-1 transition-colors cursor-pointer"
                >
                    <Avatar className="h-8 w-8 shrink-0 rounded-full bg-[#FDE0C8] font-serif text-sm font-medium text-[#7A2E05] after:border-0 border-0">
                        <AvatarFallback className="bg-[#FDE0C8] font-serif text-sm font-medium text-[#7A2E05]">
                            {userInitial}
                        </AvatarFallback>
                    </Avatar>
                    <span className="truncate text-sm font-medium text-[#2B1810]" title={userName}>
                        {userName}
                    </span>
                </button>
            </div>
        </aside>
    );
}

export default PreviousConversations;
