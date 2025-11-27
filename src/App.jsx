import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import ChatApp from './components/ChatApp';

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>

      <Routes>

        <Route 
          path="/login" 
          element={user ? <Navigate to="/chat" /> : <LogIn onLogin={setUser} />} 
        />

        <Route 
          path="/signup" 
          element={user ? <Navigate to="/chat" /> : <SignUp onLogin={setUser} />} 
        />

        <Route 
          path="/chat" 
          element={user ? <ChatApp user={user} /> : <Navigate to="/login" />} 
        />

        <Route 
          path="/" 
          element={<Navigate to={user ? "/chat" : "/login"} />} 
        />

      </Routes>

    </BrowserRouter>
  );
};

export default App;
