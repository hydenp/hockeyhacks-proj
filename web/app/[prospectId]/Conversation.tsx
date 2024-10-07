import { useState } from "react";
import { useAgent } from "./hooks";

export const Conversation = ({ sessionId }: { sessionId: string }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [prospectMessage, setProspectMessage] = useState<string>("");
  const [salesRepMessage, setSalesRepMessage] = useState<string>("");

  const { sendMessage, loading } = useAgent(sessionId);

  const onSendMessage = (
    userMessage: string,
    role: "prospect" | "salesRep"
  ) => {
    let inputMessage;
    if (role === "prospect") {
      inputMessage = `<prospect>${prospectMessage}</prospect>`;
    } else {
      inputMessage = `<sales_rep>${salesRepMessage}</sales_rep>`;
    }

    sendMessage(inputMessage).then((res) => {
      setProspectMessage("");

      const text = res.data.data.text_response;
      const salesAssistantOutput = text
        .split("<sales_assistant_output>")[1]
        .split("</sales_assistant_output>")[0];

      setMessages([...messages, userMessage, salesAssistantOutput]);
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "60vw",
      }}
    >
      <h3>Conversation</h3>
      {messages.map((message, index) => (
        <div
          style={{
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 10,
          }}
          key={index}
        >
          <pre>{message}</pre>
        </div>
      ))}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "50%",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <label>Prospect</label>
          <textarea
            style={{}}
            rows={7}
            value={prospectMessage}
            onChange={(e) => setProspectMessage(e.target.value)}
          />
          <button
            disabled={!prospectMessage}
            onClick={() => {
              onSendMessage(prospectMessage, "prospect");
            }}
          >
            Send
          </button>
        </div>
        <div
          style={{
            display: "flex",
            width: "50%",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <label>Sales Rep</label>
          <textarea
            rows={7}
            value={salesRepMessage}
            onChange={(e) => setSalesRepMessage(e.target.value)}
          />
          <button
            disabled={!salesRepMessage}
            onClick={() => {
              onSendMessage(salesRepMessage, "salesRep");
            }}
          >
            Send
          </button>
        </div>
      </div>
      {loading && "loading..."}
    </div>
  );
};
