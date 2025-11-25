import React, { useState } from "react";
import { Send, Search, MoreVertical, Phone, Video, Paperclip } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DashboardHeader } from "@/components/DashboardHeader";

const conversations = [
  { id: 1, name: "Tchad Numérique", lastMsg: "Quand seriez-vous disponible ?", time: "10:30", unread: 2, avatar: "TN" },
  { id: 2, name: "Cabinet Sahel", lastMsg: "Merci pour votre candidature.", time: "Hier", unread: 0, avatar: "CS" },
];

export default function Messages() {
  const [activeChat, setActiveChat] = useState(conversations[0]);
  const [message, setMessage] = useState("");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors flex flex-col">
      <DashboardHeader type="candidat" />
      <div className="flex-1 container mx-auto p-4 h-[calc(100vh-64px)]">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border dark:border-slate-800 h-full flex overflow-hidden">
          <div className="w-full md:w-1/3 border-r dark:border-slate-800 flex flex-col">
            <div className="p-4 border-b dark:border-slate-800">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Messagerie</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input placeholder="Rechercher..." className="pl-9 bg-slate-50 dark:bg-slate-950" />
                </div>
            </div>
            <ScrollArea className="flex-1">
                {conversations.map(chat => (
                    <div key={chat.id} onClick={() => setActiveChat(chat)} className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${activeChat.id === chat.id ? 'bg-blue-50 dark:bg-slate-800' : ''}`}>
                        <Avatar><AvatarFallback>{chat.avatar}</AvatarFallback></Avatar>
                        <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between items-baseline"><h3 className="font-semibold truncate dark:text-slate-200">{chat.name}</h3><span className="text-xs text-slate-400">{chat.time}</span></div>
                            <p className="text-sm text-slate-500 truncate dark:text-slate-400">{chat.lastMsg}</p>
                        </div>
                    </div>
                ))}
            </ScrollArea>
          </div>
          <div className="hidden md:flex flex-1 flex-col bg-slate-50/50 dark:bg-slate-950/50">
            <div className="p-4 border-b dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Avatar><AvatarFallback>{activeChat.avatar}</AvatarFallback></Avatar>
                    <div><h3 className="font-bold dark:text-white">{activeChat.name}</h3><span className="text-xs text-green-600 flex items-center gap-1">● En ligne</span></div>
                </div>
                <div className="flex gap-2"><Button variant="ghost" size="icon"><Phone className="h-5 w-5 text-slate-500" /></Button></div>
            </div>
            <ScrollArea className="flex-1 p-4"></ScrollArea>
            <div className="p-4 bg-white dark:bg-slate-900 border-t dark:border-slate-800 flex gap-2 items-center">
                <Input placeholder="Écrivez votre message..." className="flex-1 bg-slate-100 dark:bg-slate-950 border-0" value={message} onChange={(e) => setMessage(e.target.value)} />
                <Button size="icon" className="bg-brand-blue text-white rounded-full h-10 w-10"><Send className="h-4 w-4 ml-0.5" /></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}