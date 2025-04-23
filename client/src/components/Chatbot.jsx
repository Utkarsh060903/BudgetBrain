import React, { useState, useRef, useEffect, useContext } from 'react';
 import axios from 'axios';
import { Typewriter } from 'react-simple-typewriter';
import { FaCommentAlt, FaPaperPlane } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

import '../styles/ChatbotStyles.css';
import { UserContext } from '@/context/userContext';

const Chatbot = () => {
  const initialMessages = [
    { sender: "bot", text: "Hello! I'm your Financial Insights Assistant. How can I help you today?" }
  ];

  const {dashboardData, user} = useContext(UserContext)

  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const chatContentRef = useRef(null);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;  

    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput(""); 
    setApiError(false);
    setIsLoading(true); 

    
    const userContext = {
      name: user.fullName,
      Income: dashboardData?.totalIncome,
      Expense: dashboardData?.totalExpense,
      Balance: dashboardData?.totalBalance
    };


     try {
       const res = await axios.post('http://localhost:5000/api/chatbot', { prompt: input, 
         context: userContext  });
       if (res.data && res.data.answer) {
         const botMsg = { sender: "bot", text: res.data.answer };
         setMessages(prev => [...prev, botMsg]); 
       } else {
         throw new Error("Invalid response format");
       }
     } catch (error) {
       console.error('Chatbot API error:', error);
       setApiError(true);

       let errorMessage = "I'm having trouble connecting to the server. Please try again later.";

       if (error.response) {
         if (error.response.status === 500) {
           errorMessage = "There was a server error. The team has been notified.";
         } else if (error.response.status === 404) {
           errorMessage = "The chatbot service endpoint wasn't found. Please check your API configuration.";
         }
       } else if (error.request) {
         errorMessage = "No response from server. Please check your network connection.";
       }

       setMessages(prev => [...prev, { sender: "bot", text: errorMessage }]);
     } finally {
       setIsLoading(false);  
     }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };


  const toggleChatbot = () => {
    if (isOpen) {
      setMessages(initialMessages);
    }
    setIsOpen(!isOpen);
  };

  const handleRetry = () => {
     setApiError(false);
     setMessages(prev => [...prev, { sender: "bot", text: "I'm reconnecting to the service..." }]);

     axios.get('http:localhost:5000/')
       .then(() => {
         setMessages(prev => [...prev, { sender: "bot", text: "Connection restored! How can I help you?" }]);
       })
       .catch(() => {
         setApiError(true);
         setMessages(prev => [...prev, { sender: "bot", text: "Still having trouble connecting. Please try again later." }]);
       });
  };

  return (
    <div className="chatbot-container">
      {/* Button to open chatbot */}
      <div className="chatbot-button" onClick={toggleChatbot}>
        <FaCommentAlt size={24} />
      </div>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h2 className="text-xl font-semibold">💬 Financial Insights Chatbot</h2>
            <button onClick={toggleChatbot} className="chatbot-close-button">
              <IoMdClose size={24} />
            </button>
          </div>

          {/* Display messages */}
          <div ref={chatContentRef} className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message-container ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                {msg.sender === 'bot' ? (
                  <div className="bot-bubble">
                    <Typewriter
                      words={[msg.text]}
                      loop={1}
                      cursor
                      cursorStyle="|"
                      typeSpeed={30}
                      deleteSpeed={50}
                      delaySpeed={1000000}
                    />
                  </div>
                ) : (
                  <div className="user-bubble">
                    <p>{msg.text}</p>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="message-container bot-message">
                <div className="loading-bubble">
                  <div className="loading-dots">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </div>
              </div>
            )}

            {apiError && !isLoading && (
              <div className="retry-container">
                <button onClick={handleRetry} className="retry-button">
                  Retry Connection
                </button>
              </div>
            )}
          </div>

          {/* Input field and send button */}
          <div className="chatbot-input-container">
            <div className="chatbot-input-wrapper">
              <input
                className="chatbot-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask your financial questions..."
                disabled={isLoading}
              />
              <button
                className={`chatbot-send-button ${isLoading ? 'disabled' : ''}`}
                onClick={sendMessage}
                disabled={isLoading}
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
