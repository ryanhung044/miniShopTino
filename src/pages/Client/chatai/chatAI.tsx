import React, { useEffect, useState } from "react";
import { Header } from "zmp-ui";

type Message = {
    role: string;
    content: string;
};
const ChatApp = () => {

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [reply, setReply] = useState("");
    useEffect(() => {
        const footer = document.getElementById("footer");
        if (footer) {
            footer.style.display = "none";
        }
    }, []);

    const sendMessage = async () => {
        if (!input.trim()) return;  // Không gửi tin nhắn trống

        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer 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',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'deepseek/deepseek-chat-v3-0324:free',
                    messages: [
                        { role: 'user', content: input },
                    ],
                }),
            });

            const data = await response.json();
            console.log('Response:', data);

            // Cập nhật phản hồi AI
            const aiReply = data?.choices?.[0]?.message?.content || "Không có phản hồi từ AI.";
            setReply(aiReply);
            setMessages([...newMessages, { role: "assistant", content: aiReply }]);
        } catch (error) {
            console.error('Error:', error);
            setReply("Đã xảy ra lỗi khi gửi tin nhắn.");
        } finally {
            setLoading(false);
        }
    };
    const formatMessage = (text: string) => {
        return text
            .replace(/\n/g, '<br/>')                     // xuống dòng
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // in đậm **text**
    };

    return (

        <div style={styles.container}>
            <Header title="Chat GPT" showBackIcon={true} />
            <div style={styles.header}>🤖 ChatGPT</div>
            <div style={styles.chatBox}>
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        style={{
                            ...styles.message,
                            textAlign: msg.role === "user" ? "right" : "left",
                            backgroundColor: msg.role === "user" ? "#d1f7c4" : "#f1f1f1",
                            marginRight: msg.role === "user" ? "0" : "auto",
                            marginLeft: msg.role === "assistant" ? "0" : "auto",
                        }}
                    >
                        {/* <span>{msg.content}</span> */}
                        <span dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />

                    </div>
                ))}
                {loading && <div style={styles.loading}>Đang trả lời...</div>}
            </div>
            <div style={styles.inputContainer}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Nhập nội dung..."
                    style={styles.input}
                />
                <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    style={styles.sendButton}
                >
                    Gửi
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column' as 'column',
    },
    header: {
        fontSize: '24px',
        textAlign: 'center' as 'center',
        marginBottom: '20px',
    },
    chatBox: {
         flex: 0.93,
        overflowY: 'auto' as 'auto',
        marginBottom: '20px',
        padding: '10px',
        // borderBottom: '1px solid #ddd',
    },
    message: {
        // display: 'inline-block',
        padding: '10px',
        borderRadius: '10px',
        margin: '5px 0',
        maxWidth: '80%',
        fontSize: '16px',
    },
    loading: {
        textAlign: 'center' as 'center',
        color: '#888',
    },
    inputContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    input: {
        width: '80%',
        padding: '10px',
        borderRadius: '20px',
        border: '1px solid #ccc',
        marginRight: '10px',
    },
    sendButton: {
        padding: '10px 20px',
        borderRadius: '20px',
        backgroundColor: '#152379',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
    },


};

export default ChatApp;
