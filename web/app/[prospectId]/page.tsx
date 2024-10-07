"use client";

import styled from "styled-components";
import { DATA } from "../../data";
import { Conversation } from "./Conversation";

const Page = styled.div`
  padding: 50px;
  display: flex;
  flex-direction: column;
  gap: 12px
  align-items: center;
  justify-content: center;
`;

export default function ProspectPage({
  params,
}: {
  params: { prospectId: string };
}) {
  const prospectData = DATA.data.find((item) => item.id === params.prospectId);

  return (
    <Page>
      <h1>{prospectData?.prospect.name ?? "New Prospect"}</h1>
      {prospectData && (
        <>
          <p>Age: {prospectData.prospect.age}</p>
          <p>Location: {prospectData.prospect.location}</p>
        </>
      )}
      <div />
      <hr style={{ width: "100%" }} />
      <div />
      <div
        style={{
          display: "flex",
          gap: "70px",
        }}
      >
        <Conversation sessionId={params.prospectId} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2>Previous Conversations</h2>
          {prospectData?.previousConversations.map((conversation, index) => (
            <div key={index}>
              <h3>{conversation.date}</h3>
              {conversation.messages.map((message, idx) => (
                <p key={idx}>
                  <strong>{message.role}:</strong> {message.content}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}
