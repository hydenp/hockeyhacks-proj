import axios from "axios";
import { useState } from "react";

export const useAgent = (sessionId: string) => {
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string) => {
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": "UyM6XKhHW6as1fBMegnQjBiAO72Lx9LDqNJ77g70",
    };

    const payload = {
      //   input: message,
      input_text: message,
      session_id: sessionId,
    };

    setLoading(true);

    const response = await axios.post(
      // `https://s265bgagqa.execute-api.us-west-2.amazonaws.com/default/monical-api`,
      `http://localhost:8000/bedrock-agent`,
      {
        ...payload,
      },
      {
        headers: headers,
      }
    );
    setLoading(false);

    return response
  };

  return {
    sendMessage,
    loading,
  };
};
