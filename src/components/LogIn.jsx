import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginZIM, watchTokenExpiry } from "../services/chatServices";
import InputField from './ruesable/InputField';
import FormButton from './ruesable/FormButton';
import { generateZegoToken } from "../utils/chatToken";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase_config"; // make sure this path is correct



const appID = Number(import.meta.env.VITE_ZEGOCLOUD_APP_ID);
const LogIn = ({onLogin}) => { 


    const [email, setEmail] = useState("");
    const[password, setPassword]= useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async(e) =>{
        e.preventDefault();

        if(!email || !password){
            return setError("Please enter both email and password.");
        }
        setLoading(true);
        setError("");

        try{
            const {user} = await signInWithEmailAndPassword(auth, email, password);
            const token = generateZegoToken(user.uid, 7200);

            await loginZIM({
                appID,
                userID: user.uid,
                userName: user.displayName,
                token
            });
            watchTokenExpiry(
                async(userID) => generateZegoToken(userID, 7200)
            );
            const userData = {
                email: user.email,
                uid: user.uid,
                userID: user.uid,
                userName: user.email
            };
            localStorage.setItem("user",JSON.stringify(userData));
            onLogin?.(userData);
            navigate("/chat");
        } catch(err){
            setError(err.message);
        } finally{
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 to-indigo-100">
        <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
         <InputField
         id="email"
         label="Email"
         type="email"
         value={email}
         onChange={(e) => setEmail(e.target.value)}
         placeholder='example@email.com'
         />
         <InputField
         id="password"
         label="Password"
         type="password"
         value={password}
         onChange={(e) => setPassword(e.target.value)}
         placeholder='************'
         />
         <FormButton
         loading={loading}
         text='Sign In'
         loadingText='Singing In...'
         />
        </form>
           <p className="text-center text-gray-600 mt-4">
            Don't have an account?{""}
            <button
                onClick={() => navigate("/signup")}
                className="text-purple-600 hover:underLine bg-transparent border-none cursor-pointer ">
                    Sign Up
            </button>

           </p>
        </div>
            
        </div>
    );
};

export default LogIn;