import React, { useEffect, useState } from 'react';
import { fetchConversations, sendTextMessage } from './../services/chatServices';
import { FaCommentDots } from 'react-icons/fa';

const Sidebar = () => {
    const {theme} = useTheme();
    const [chats, setChat] = useState([]);
    const [showAddFriendDialog, setShowAddFriendDialog] = useState(false);
    const [friendID, setFriendID] = useState('');
    const [userUID, setUserUID] = useState('');

    useEffect(() =>{
        const fetchChat = async () =>{
            try{
                const result = await fetchConversations();
                console.log(result);
                setChat(result);
            } catch(err){
                console.error('Failed to load conversations:', err);
            }
        };
        fetchChat();
    }, []);

    useEffect(() =>{
        if(auth.currentUser){
            setUserUID(auth.currentUser.uid);
        }
    },[] );

    const handleLogout = () =>{
        logout();
        window.location.href = '/login';
    };
    const handleAddFriend = () =>{
        try{
            const config = {
                wording: 'Hello',
                friendAlias:'',
                friendAttributes:{}
            };
            const res = await addFriendZIM(friendID, config);
            console.log('Friend added:', res.friendInfo);
            await sendTextMessage(friendID, 0, 'Hello')

            setShowAddFriendDialog(false);
            setFriendID('');

            const updated = await fetchConversations();
            setChat(updated);

            const newConv = updated.find(conv > conv.conversationID === friendID);
            if(newConv){
                onSelectChat(newConv);
            }else{
               console.log('Conversation not found yet. It may appear latter first message.'); 
            }
        } catch(err){
            console.log('Error adding friend:', err);
            alert('Faild to add friend. Please check the ID.');
        }
    };
        return (
        <div className='w-80 border-gray-200 dark:border-gray-700 flex flex-col h-full'>
            <div className='p-4 border-gray-200 dark:border-gray-700 flex justify-between items-center'>
            <div className='flex items-center'>
                <FaCommentDots className='size-7 text-purple-500 mr-2'/>
                <h1 className='text-xl font-bold'>Message</h1>
            </div>
            <ThemeToggle/>
            </div>

            <div className='p-3'>
                <button
                onClick={()=> setShowAddFriendDialog(true)}
                className='w-full flex items-center justify-center gap-2 p-2 text-white bg-purple-600 hover:bg-purple-500 dark:hover:bg-purple-600 rounded-lg transition-colors'
                >
                <span className='font-medium'>+ Add New Friend</span>
b           </button>
            </div>
            {showAddFriendDialog && (
                <div className='fixed inset-0 bg-black flex items-center justify-center z-[9999]'>
                <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm'>
                <h2 className='text-lg font-semibold mb-4 text-center'>Add New Friend</h2>
                <input
                 type="text" 
                 placeholder='Enter User ID'
                 value={friendID}
                 onChange={(e)=> satFriendID(e.target.value)}
                 className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-4 dark:bg-gray-700 dark:text-white'
                 />
                 <div className='flex justify-end gap-2'>
                 <button
                 onClick={()=> setShowAddFriendDialog(false)}
                 className='px-4 py-2 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded hover:bg-gray-400'
                 > Cancel</button>
                 <button
                 onClick={handleAddFriend}
                 className='px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700'
                 >Add</button>
                 </div>
                    
                </div>    

                </div>
            )}
<div className='flex-1 overflow-y-auto'>
{chats?.map((conversation) =>{
    const lastMessage = conversation.lastMessage?.message || 'No messages yet';
    const timestamp = new Date(conversation.lastMessage?.timestamp || Date.now());
    const timeString = timestamp.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    const avatar = conversation.conversationName?.charAt(0) || 'U';
    const unreadCount = conversation.unreadMessageCount || 0;

    return(
        <div 
         key={conversation.conversationID}
         onClick={() => onSelectChat(conversation)}
         className={`p-3 border-b border-gray-200 dark:border-gray-700 flex items-center hover:bg-gray-100 dark:hover:bg-gray-200 cursor-pointer transition-colors ${unreadCount > 0 ? 'bg-purple-100 dark:bg-purple-900/20' : '' } `}
         >
        <div className='relative'>
            <div className='size-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold'>
            {avatar}
        </div>
        {unreadCount > 0 && (
            <span className='absolute -top-1 bg-red-500 text-white text-xs font-semibold rounded-full size-5 flex items-center justify-center'>
            {unreadCount}
       </span>
        )}
        </div> 
        <div className='ml-3 flex-1'>
        <div className='flex justify-between items-center'>
        <h3 className='font-medium'>
        {conversation.conversationName || 'Unknow'}
        <span></span>

        </h3>

        </div>
        
        </div>   

        </div>
    )
})}

            </div>
            
            
        </div>
    );
};

export default Sidebar;