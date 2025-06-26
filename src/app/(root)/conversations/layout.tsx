import React from "react";

const ConversationsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen flex">
      <aside className="w-full h-full bg-secondary lg:w-80">
        {/* Placeholder for the list of conversations */}
        <div className="p-4">
          <h1 className="text-2xl font-bold">Chats</h1>
          <p className="text-muted-foreground">Select a conversation to start chatting.</p>
        </div>
      </aside>
      <main className="flex-1 h-full">
        {children}
      </main>
    </div>
  );
};

export default ConversationsLayout;
