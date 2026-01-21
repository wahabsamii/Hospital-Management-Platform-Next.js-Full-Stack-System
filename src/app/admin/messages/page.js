"use client";
import { socket } from '@/app/socket';
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { TailSpin } from 'react-loader-spinner';
import { useSelector } from 'react-redux';

function page() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const audioRef = useRef(null);

    const token = localStorage.getItem('token');
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
  audioRef.current = new Audio("/tune.mp3");
  audioRef.current.volume = 1;
}, []);

useEffect(() => {
  const unlock = () => {
    if (!audioRef.current) return;

    audioRef.current.play()
      .then(() => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      })
      .catch(() => {});

    document.removeEventListener("click", unlock);
    document.removeEventListener("keydown", unlock);
  };

  document.addEventListener("click", unlock);
  document.addEventListener("keydown", unlock);

  return () => {
    document.removeEventListener("click", unlock);
    document.removeEventListener("keydown", unlock);
  };
}, []);



    useEffect(() => {
        socket.auth = { token };
        socket.connect();

        socket.on("receivePrivateMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
            // 🔔 Play sound ONLY if message is from another user
            // play sound
  audioRef.current?.play().catch(() => {});
        });

        return () => {
            socket.off('receivePrivateMessage');
            socket.disconnect();
        }
    }, [token]);

    // users 
    useEffect(() => {
      setLoading(true);
        axios.get('https://jhc-backend-main.vercel.app/api/user/', {
            headers: {Authorization: `Bearer ${token}`}
        }).then((res) => setUsers(res.data))
        .catch(console.error);
        setLoading(false);
    }, [token]);


    const selectUser = async(user)=>{
        setSelectedUser(user);

        const res = await axios.get(
      `https://jhc-backend-main.vercel.app/api/messages/${user._id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setMessages(res.data);
    }

    const sendMessage = () => {
        if(!message.trim() || !selectUser) return;

        socket.emit("privateMessage", {
            receiverId: selectedUser._id,
            text: message
        });

        setMessage("");
    }

    if (loading) {
    return(
      <div className="min-h-[80vh] flex justify-center items-center">
        <TailSpin color="blue"/>
      </div>
    )
    }
    
  return (
    <div className=" bg-blue-100 min-h-screen">
           
    <div className="h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-1/4 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Chats</h2>
          <p className="text-sm text-gray-500">Logged in as {currentUser.name}</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {users.map((u) => (
            <div key={u._id} onClick={() => selectUser(u)}
              className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${
                selectedUser?._id === u._id ? "bg-gray-200" : ""
              }`}
            >
              <div className='flex items-center gap-2'>
              <div className='relative'>
                <img width={30} src={u.image} className='rounded-full'/>
                {u.isOnline ? <div className='bg-green-600 w-[8px] h-[8px] rounded-full absolute bottom-0 right-0'></div> : ''}
              </div>
              <p className="font-medium">{u.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* HEADER */}
            <div className="p-4 border-b bg-white flex items-center gap-2">
              {/* <h3 className="font-semibold text-lg">
                {selectedUser.name}
              </h3> */}
               <img width={30} src={selectedUser.image} className='rounded-full'/>
              <p className="font-medium">{selectedUser.name}</p>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map((m) => (
                <div
                  key={m._id}
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                    m.sender === currentUser.id
                      ? "ml-auto bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            {/* INPUT */}
            <div className="p-4 border-t bg-white flex gap-2">
              <input
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
            </div>
  )
}

export default page