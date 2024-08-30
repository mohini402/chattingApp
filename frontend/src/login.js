import React, { useState } from 'react';
 import { useNavigate } from 'react-router-dom';
 import './login.css';
 
 const Login = () => {
   const [username, setUsername] = useState('');
   const navigate = useNavigate();
 
   const handleLogin = () => {
     if (username.trim()) {
        const userToJoin = username || 'someone';
        navigate(`/chat/yourRoomId?username=${encodeURIComponent(userToJoin)}`);
     }
   };
 
   return (
     <div className="login-container">
       <h2>Login</h2>
       <input
         type="text"
         value={username}
         onChange={(e) => setUsername(e.target.value)}
         placeholder="Enter your name"
       />
       <button onClick={handleLogin}>Join Chat</button>
     </div>
   );
 };
 
 export default Login;
 
