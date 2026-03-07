import { useEffect, useState } from "react";

interface Message {
  _id: string;
  projectId?: string; 
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
}

const currentUserId = "u2"; // later auth se aayega

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ProjectChat() {
  const projectId = "123"; 
  const [messages, setMessages] = useState<Message[]>([
    // Dummy backend-like data
    {
      _id: "1",
      senderId: "u1",
      senderName: "Alex Kumar",
      text: "Hey team, please update task status.",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "2",
      senderId: "u2",
      senderName: "You",
      text: "Working on Dashboard UI 👍",
      createdAt: new Date().toISOString(),
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Future: Load from backend
  useEffect(() => {
    async function fetchMessages() {
      try {
        // const res = await fetch("/api/projects/123/messages");
        // const data = await res.json();
        // setMessages(data);
      } catch (err) {
        console.log("Backend not connected yet");
      }
    }

    fetchMessages();
  }, []);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const optimisticMessage: Message = {
      _id: Date.now().toString(),
      senderId: currentUserId,
      senderName: "You",
      text: newMessage,
      createdAt: new Date().toISOString(),
      projectId,
    };

    // Show instantly
    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");

    try {
      setLoading(true);

      // 🔥 Future API call
      // await fetch("/api/projects/123/messages", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ text: newMessage }),
      // });

    } catch (err) {
      console.log("Message saved locally only");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-100 border border-base-300 rounded-lg flex flex-col h-[500px]">
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${
              msg.senderId === currentUserId
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
             className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm text-sm  ${
               msg.senderId === currentUserId
  ? "bg-primary text-primary-content"
  : "bg-base-200 text-base-content"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
              <p className="font-medium text-xs text-base-content/60">
                  {msg.senderName}
                </p>
              <p className="text-[10px] text-base-content/60">
                  {formatTime(msg.createdAt)}
                </p>
              </div>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-base-300 p-3 flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="input input-bordered w-full"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}