import { ZIM } from 'zego-zim-web';

let zimInstance = null;

export const initZIM = (appID) => {
  if (!zimInstance) {
    zimInstance = ZIM.create({ appID });
  }
  return zimInstance;
};

export const loginZIM = async ({ appID, userID, userName, token }) => {
  const zim = initZIM(appID);

  try {
    await zim.login(
      {
        userID,
        userName
      },
      token
    );
    console.log('ZEGOCLOUD login success');
    return zim;
  } catch (err) {
    console.error('ZEGOCLOUD login failed:', err);
    throw err;
  }
};


export const fetchConversations = async () => {
  if (!zimInstance) {
    throw new Error('ZIM instance not initialized. Please login first.');
  }

  try {
    const result = await zimInstance.queryConversationList({
      count: 20,
      nextConversation: null,
    });
    return result.conversationList || [];
  } catch (err) {
    console.error('Failed to fetch conversation list:', err);
    throw err;
  }
};

export const queryMessages = async (messageSeqs, conversationID, conversationType) => {
  if (!zimInstance) {
    throw new Error('ZIM instance not initialized');
  }

  try {
    const result = await zimInstance.queryMessages(
      messageSeqs,
      conversationID,
      conversationType
    );
    return result.messageList || [];
  } catch (error) {
    console.error('Failed to query messages:', error);
    throw error;
  }
};

export const watchTokenExpiry = (getToken, userID) => {
  if (!zimInstance) return;

  zimInstance.on('tokenWillExpire', async (zim, seconds) => {
    console.log(`Token will expire in ${seconds} seconds, renewing...`);
    try {
      const newToken = await getToken(userID);
      await zim.renewToken(newToken);
      console.log('Token renewed successfully');
    } catch (err) {
      console.error('Token renewal failed:', err);
    }
  });
};

export const addFriendZIM = async (userID, config = {}) => {
  if (!zimInstance) {
    throw new Error('ZIM instance is not initialized or user is not logged in');
  }

  try {
    const result = await zimInstance.addFriend(userID, {
      type: 1,
      ...config,
    });

    console.log('Friend added successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to add friend:', error);
    throw error;
  }
};

export const queryHistoryMessage = async ({
  conversationID,
  conversationType,
  count = 100,
  nextMessage = null,
  reverse = 1
}) => {
  if (!zimInstance) {
    throw new Error('ZIM instance not initialized. Please login first.');
  }

  try {
    const result = await zimInstance.queryHistoryMessage(
      String(conversationID).trim(),
      Number(conversationType),
      {
        count: Math.min(Math.max(count, 1), 100),
        reverse,
        nextMessage
      }
    );

    return {
      messageList: result.messageList || [],
      nextMessage: result.nextMessage || null,
      hasMore: !!result.nextMessage
    };
  } catch (error) {
    console.error('Query failed for:', {
      conversationID,
      conversationType,
      error: error.message
    });
    throw error;
  }
};

export const sendTextMessage = async (toConversationID, conversationType, messageText) => {
  if (!zimInstance) {
    throw new Error('ZIM instance not initialized.');
  }

  const config = { priority: 1 };
  const notification = {
    onMessageAttached: function (message) {
      console.log('Message attached:', message);
    }
  };

  const messageObj = {
    type: 1,
    message: messageText,
  };

  try {
    const { message } = await zimInstance.sendMessage(
      messageObj,
      toConversationID,
      conversationType,
      config,
      notification
    );

    return message;
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
};

export const onReceiveMessage = (callback) => {
  if (!zimInstance) {
    console.warn('ZIM instance not initialized. Cannot listen to messages.');
    return () => {};
  }

  const listener = (zim, { messageList, info, fromConversationID }) => {
    console.log('peerMessageReceived:', messageList, info, fromConversationID);
    callback(messageList);
  };

  zimInstance.on('peerMessageReceived', listener);

  return () => {
    zimInstance.off('peerMessageReceived', listener);
  };
};

