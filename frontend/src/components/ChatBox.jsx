import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const ChatBox = ({ weddingInput, result }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (messageText) => {
    const text = messageText || inputValue;
    if (!text.trim() || !weddingInput || !result) return;

    setInputValue("");
    setMessages(prev => [...prev, { text, isUser: true }]);
    setLoading(true);

    const context = {
      num_guests: weddingInput.num_guests,
      duration_days: weddingInput.duration_days,
      venue_location: weddingInput.venue_location,
      budget_inr: weddingInput.budget_inr,
      sub_events: weddingInput.sub_events,
      total_carbon_kg_co2: result.impact?.total_carbon_kg_co2,
      savings_kg: result.ml_prediction?.savings_kg,
      savings_percent: result.ml_prediction?.savings_percent,
      co2_savings_kg: result.optimizer?.co2_savings_kg,
      sustainability_score: result.recommendations?.sustainability_score || 'N/A'
    };

    try {
      const response = await axios.post("http://localhost:8000/chat", {
        message: text,
        wedding_context: context
      });
      setMessages(prev => [...prev, { text: response.data.reply, isUser: false }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        text: `Sorry, I couldn't process that right now. Error: ${err.message}`,
        isUser: false
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const suggestions = [
    "How can I reduce carbon further?",
    "Which vendor saves the most CO2?",
    "Tips for a vegetarian eco menu?"
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-xl font-bold text-gray-800">💬 Ask About Your Eco Plan</h3>
        <p className="text-gray-500 text-sm mt-1">Ask Gemini anything about your wedding's sustainability</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <span className="text-sm font-medium text-gray-700 py-1.5 mr-1 hover:cursor-default">Suggested:</span>
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => handleSend(s)}
            disabled={loading}
            className="text-xs bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="h-80 overflow-y-auto bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 my-auto italic text-sm">
            Send a message to start chatting!
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] p-3 text-sm shadow-sm ${msg.isUser
                  ? 'bg-green-600 text-white rounded-tl-2xl rounded-tr-sm rounded-b-2xl'
                  : 'bg-white border border-gray-200 text-gray-800 rounded-tr-2xl rounded-tl-sm rounded-b-2xl'
                }`}
            >
              {!msg.isUser && <span className="mr-2">🌿</span>}
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 text-sm shadow-sm bg-white border border-gray-200 text-gray-500 rounded-tr-2xl rounded-tl-sm rounded-b-2xl italic">
              <span className="mr-2 animate-pulse">🌿</span> Thinking...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2 w-full mt-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder="Ask me anything about your eco plan..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm transition-shadow shadow-inner"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !inputValue.trim()}
          className="bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-white font-medium px-6 py-2 rounded-lg disabled:opacity-50 transition-colors shadow-md min-w-[100px]"
        >
          Send →
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
