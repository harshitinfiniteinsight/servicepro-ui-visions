import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, X, Send, Bot, User, Hash, Bell } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  channel?: string;
}

interface Channel {
  id: string;
  name: string;
  unread: number;
}

const dummyResponses = [
  "I can help you manage your customers, appointments, and invoices! What would you like to know?",
  "Great question! Let me pull up that information for you...",
  "I've analyzed your dashboard. You have 3 new estimates pending approval.",
  "Based on your current workflow, I recommend following up with the pending invoices.",
  "I can help you create a new appointment. Would you like me to guide you through it?",
  "Your business is performing well! Revenue is up 30% this month compared to last month.",
  "I noticed you have 1 appointment scheduled for today. Would you like to see the details?",
  "I can help with that! Let me search through your customer database...",
  "Here's a tip: You can use keyboard shortcuts to navigate faster. Press 'C' to add a new customer!",
  "Would you like me to generate a report for your recent activities?"
];

export const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentChannel, setCurrentChannel] = useState("general");
  const [channels, setChannels] = useState<Channel[]>([
    { id: "general", name: "General", unread: 0 },
    { id: "support", name: "Support", unread: 2 },
    { id: "sales", name: "Sales", unread: 1 },
    { id: "tech", name: "Tech Team", unread: 0 },
  ]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "👋 Hi! I'm your AI assistant. How can I help you manage your service business today?",
      timestamp: new Date(),
      channel: "general"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Demo team notifications
  useEffect(() => {
    const notifications = [
      { channel: "support", message: "Sarah replied to customer ticket #1234", user: "Sarah" },
      { channel: "sales", message: "New lead assigned to you", user: "System" },
      { channel: "tech", message: "Mike completed the deployment", user: "Mike" },
      { channel: "support", message: "Urgent: Priority ticket requires attention", user: "System" },
    ];

    const interval = setInterval(() => {
      const notification = notifications[Math.floor(Math.random() * notifications.length)];
      
      toast.success(`📢 ${notification.channel.toUpperCase()}`, {
        description: notification.message,
        action: {
          label: "View",
          onClick: () => {
            setCurrentChannel(notification.channel);
            setIsOpen(true);
          },
        },
      });

      // Add unread count
      setChannels(prev => prev.map(ch => 
        ch.id === notification.channel 
          ? { ...ch, unread: ch.unread + 1 }
          : ch
      ));

      // Add system message to channel
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "system",
        content: `${notification.user}: ${notification.message}`,
        timestamp: new Date(),
        channel: notification.channel
      }]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Clear unread when switching channels
  useEffect(() => {
    setChannels(prev => prev.map(ch => 
      ch.id === currentChannel ? { ...ch, unread: 0 } : ch
    ));
  }, [currentChannel]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
      channel: currentChannel
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const randomResponse = dummyResponses[Math.floor(Math.random() * dummyResponses.length)];
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: randomResponse,
        timestamp: new Date(),
        channel: currentChannel
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const totalUnread = channels.reduce((sum, ch) => sum + ch.unread, 0);
  const channelMessages = messages.filter(m => m.channel === currentChannel);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full shadow-2xl gradient-primary hover:scale-110 transition-all duration-300 group relative"
          >
            <MessageCircle className="h-6 w-6" />
            {totalUnread > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive">
                {totalUnread}
              </Badge>
            )}
            <div className="absolute right-full mr-3 px-4 py-2 bg-card text-card-foreground rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap border">
              <span className="text-sm font-medium">Team Chat & AI Assistant</span>
            </div>
          </Button>
        )}

        {/* Chat Window */}
        {isOpen && (
          <Card className="w-[380px] h-[600px] shadow-2xl flex flex-col border-2 animate-in slide-in-from-bottom-5 duration-300">
            {/* Header */}
            <div className="p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-primary">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-3 w-3 bg-success rounded-full border-2 border-card" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Team Chat</h3>
                    <p className="text-xs text-success font-medium">● {channels.length} channels</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full relative"
                  >
                    <Bell className="h-4 w-4" />
                    {totalUnread > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive rounded-full text-[10px] text-white flex items-center justify-center">
                        {totalUnread}
                      </span>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Channel Selector */}
              <Select value={currentChannel} onValueChange={setCurrentChannel}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {channels.map(channel => (
                    <SelectItem key={channel.id} value={channel.id}>
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>{channel.name}</span>
                        {channel.unread > 0 && (
                          <Badge variant="destructive" className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                            {channel.unread}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {channelMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === "user" ? "flex-row-reverse" : 
                      message.role === "system" ? "justify-center" : "flex-row"
                    }`}
                  >
                    {message.role !== "system" && (
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback
                          className={
                            message.role === "user"
                              ? "bg-secondary text-secondary-foreground"
                              : "bg-gradient-to-br from-primary to-accent text-white"
                          }
                        >
                          {message.role === "user" ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`flex-1 ${
                        message.role === "user" ? "items-end" : 
                        message.role === "system" ? "items-center" : "items-start"
                      } flex flex-col`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          message.role === "system" 
                            ? "bg-accent/20 text-accent-foreground text-center text-xs max-w-full"
                            : message.role === "user"
                            ? "bg-primary text-primary-foreground ml-auto max-w-[85%]"
                            : "bg-muted text-foreground max-w-[85%]"
                        }`}
                      >
                        <p className={`${message.role === "system" ? "text-xs" : "text-sm"} leading-relaxed`}>
                          {message.content}
                        </p>
                      </div>
                      {message.role !== "system" && (
                        <span className="text-xs text-muted-foreground mt-1 px-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t bg-muted/30">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className="gradient-primary"
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                AI responses are simulated for demo purposes
              </p>
            </div>
          </Card>
        )}
      </div>
    </>
  );
};
