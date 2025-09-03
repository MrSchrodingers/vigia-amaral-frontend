"use client"

import { useState } from "react"
import { MessagesView } from "../common/components/messages/messages-view"
import { ProcessSearchView } from "../common/components/process/process-search-view"
import { ChatView } from "../common/components/chat/chat-view"
import { Sidebar } from "../common/components/shared/sidebar"
import { Header } from "../common/components/shared/header"


type ViewType = "messages" | "processes" | "chat"

export default function HomePage() {
  const [currentView, setCurrentView] = useState<ViewType>("messages")

  const renderView = () => {
    switch (currentView) {
      case "messages":
        return <MessagesView />
      case "processes":
        return <ProcessSearchView />
      case "chat":
        return <ChatView />
      default:
        return <MessagesView />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentView={currentView} />
        <main className="flex-1 overflow-auto">{renderView()}</main>
      </div>
    </div>
  )
}
