"use client"

import { useState } from "react"
import { MessagesView } from "../common/components/messages/messages-view"
import { ChatView } from "../common/components/chat/chat-view"
import { Sidebar } from "../common/components/shared/sidebar"
import { Header } from "../common/components/shared/header"
import { LegalProcessManager } from "../common/components/process"
import { TransitCasesManager } from "../common/components/transit"


type ViewType = "messages" | "processes" | "transit"

export default function HomePage() {
  const [currentView, setCurrentView] = useState<ViewType>("messages")

  const renderView = () => {
    switch (currentView) {
//      case "messages":
//        return <MessagesView />
      case "processes":
        return <LegalProcessManager />
      case "transit":
        return <TransitCasesManager />
      default:
        return <LegalProcessManager />
    }
  }

return (
  <div className="flex h-screen overflow-hidden bg-background">
    <Sidebar currentView={currentView} onViewChange={setCurrentView} />

    <div className="flex-1 flex flex-col min-h-0">
      <Header currentView={currentView}/>
      
      <main className="flex-1 min-h-0 overflow-y-auto">
        {renderView()}
      </main>

    </div>
  </div>
)
}
