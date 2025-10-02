"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { jsPDF } from "jspdf";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import { Skeleton } from "@/app/components/ui/skeleton";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/app/components/ui/sidebar";
import "highlight.js/styles/github-dark.css";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  citations?: Array<{ title: string; source: string }>;
}

interface Thread {
  id: string;
  title: string;
  updatedAt: Date;
}

interface Document {
  id: string;
  title: string;
  sourceType: string;
  fileType: string;
  embeddingStatus: string;
  chunkCount: number;
  createdAt: Date;
}

interface ChatInterfaceProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function ChatInterface({ user }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isStreamingNewThread, setIsStreamingNewThread] = useState(false);
  interface SearchResult {
    id: string;
    title: string;
    authors: string;
    year: string;
    source: string;
    abstract: string;
    doi: string;
    url: string;
  }
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch documents and threads on mount
  useEffect(() => {
    fetchDocuments();
    fetchThreads();
  }, []);

  // Load messages when thread changes (but not when streaming a new thread)
  useEffect(() => {
    if (currentThreadId && !isStreamingNewThread) {
      loadThreadMessages(currentThreadId);
    }
  }, [currentThreadId, isStreamingNewThread]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents?id=${documentId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  const fetchThreads = async () => {
    try {
      const response = await fetch('/api/threads');
      if (response.ok) {
        const data = await response.json();
        setThreads(data.threads);
      }
    } catch (error) {
      console.error('Failed to fetch threads:', error);
    }
  };

  const handleDeleteThread = async (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent thread selection when clicking delete

    if (!confirm('Are you sure you want to delete this conversation?')) {
      return;
    }

    try {
      const response = await fetch(`/api/threads?id=${threadId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove from threads list
        setThreads((prev) => prev.filter((thread) => thread.id !== threadId));

        // If the deleted thread was active, clear the chat
        if (currentThreadId === threadId) {
          handleNewChat();
        }
      }
    } catch (error) {
      console.error('Failed to delete thread:', error);
    }
  };

  const loadThreadMessages = async (threadId: string) => {
    try {
      const response = await fetch(`/api/threads/${threadId}/messages`);
      if (response.ok) {
        const data = await response.json();
        interface MessageData {
          id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          createdAt: string;
        }
        const formattedMessages: Message[] = data.messages.map((msg: MessageData) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.createdAt),
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Failed to load thread messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() && selectedFiles.length === 0) return;

    // Handle file uploads first
    if (selectedFiles.length > 0) {
      setIsLoading(true);
      try {
        for (const file of selectedFiles) {
          const formData = new FormData();
          formData.append('file', file);
          if (currentThreadId) {
            formData.append('threadId', currentThreadId);
          }

          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json().catch(() => ({ error: 'Failed to upload file' }));
            throw new Error(errorData.error || 'Failed to upload file');
          }

          const uploadData = await uploadResponse.json();

          // Add a system message indicating successful upload
          const uploadMessage: Message = {
            id: Date.now().toString() + '-upload',
            role: 'assistant',
            content: `✅ Successfully uploaded and processed "${uploadData.fileName}" (${uploadData.chunkCount} chunks extracted). You can now ask questions about this document!`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, uploadMessage]);
        }
        setSelectedFiles([]);
        fetchDocuments(); // Refresh documents list
        setIsLoading(false);

        // If there's no message, return after upload
        if (!input.trim()) {
          return;
        }
      } catch (error) {
        console.error('Upload error:', error);
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `❌ Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setIsLoading(false);
        return;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageContent = input;
    setInput("");
    setIsLoading(true);

    // Flag that we're streaming a new thread if no threadId exists
    const isNewThread = !currentThreadId;
    if (isNewThread) {
      setIsStreamingNewThread(true);
    }

    try {
      // Call the chat API with SSE streaming
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageContent,
          threadId: currentThreadId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      // Create a temporary assistant message for streaming
      const assistantMessageId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Read the stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      let done = false;
      let firstChunkReceived = false;

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = JSON.parse(line.slice(6));

              if (data.error) {
                throw new Error(data.error);
              }

              if (data.threadId && !currentThreadId) {
                setCurrentThreadId(data.threadId);
              }

              if (data.content) {
                // Stop loading indicator once we receive first content
                if (!firstChunkReceived) {
                  setIsLoading(false);
                  firstChunkReceived = true;
                }

                // Update the assistant message with streamed content
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: msg.content + data.content }
                      : msg
                  )
                );
              }

              if (data.done) {
                done = true;
                // Clear the streaming flag when done
                if (isNewThread) {
                  setIsStreamingNewThread(false);
                }
                break;
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Clear streaming flag on error
      if (isNewThread) {
        setIsStreamingNewThread(false);
      }
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      fetchThreads(); // Refresh thread list after sending message
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentThreadId(null);
    setSelectedFiles([]);
    setIsStreamingNewThread(false);
  };

  const exportConversation = (format: 'markdown' | 'text' | 'pdf') => {
    if (messages.length === 0) return;

    const timestamp = new Date().toISOString().split('T')[0];

    if (format === 'pdf') {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      let yPosition = 20;

      // Title
      doc.setFontSize(16);
      doc.text('Conversation Export', margin, yPosition);
      yPosition += 10;
      doc.setFontSize(10);
      doc.text(timestamp, margin, yPosition);
      yPosition += 15;

      // Messages
      doc.setFontSize(11);
      messages.forEach((msg) => {
        const role = msg.role === 'user' ? 'You' : 'AI Assistant';

        // Add new page if needed
        if (yPosition > doc.internal.pageSize.getHeight() - 30) {
          doc.addPage();
          yPosition = 20;
        }

        // Role header
        doc.setFont('helvetica', 'bold');
        doc.text(role + ':', margin, yPosition);
        yPosition += 7;

        // Message content
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(msg.content, maxWidth);
        lines.forEach((line: string) => {
          if (yPosition > doc.internal.pageSize.getHeight() - 20) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, margin, yPosition);
          yPosition += 5;
        });

        yPosition += 10; // Space between messages
      });

      doc.save(`conversation-${timestamp}.pdf`);
    } else {
      let content = '';

      if (format === 'markdown') {
        content = `# Conversation Export - ${timestamp}\n\n`;
        messages.forEach((msg) => {
          const role = msg.role === 'user' ? '**You**' : '**AI Assistant**';
          content += `${role}:\n\n${msg.content}\n\n---\n\n`;
        });
      } else {
        content = `Conversation Export - ${timestamp}\n\n`;
        messages.forEach((msg) => {
          const role = msg.role === 'user' ? 'You' : 'AI Assistant';
          content += `${role}:\n${msg.content}\n\n---\n\n`;
        });
      }

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `conversation-${timestamp}.${format === 'markdown' ? 'md' : 'txt'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&source=both&max=10`);
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const insertPaperReference = (paper: SearchResult) => {
    const reference = `Reference: ${paper.title} (${paper.id})\nAuthors: ${paper.authors}\nYear: ${paper.year}\nURL: ${paper.url}`;
    setInput((prev) => {
      // Add proper spacing: no space if empty, otherwise add newlines before
      if (prev.trim() === '') {
        return reference;
      }
      return prev + '\n\n' + reference;
    });
    setShowSearchModal(false);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <Sidebar className="border-r">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="PaperTrail"
                width={32}
                height={32}
                className="square-md"
              />
              <span className="font-bold text-lg">PaperTrail</span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="px-4 py-2">
                <Button
                  onClick={handleNewChat}
                  className="w-full"
                  size="sm"
                >
                  + New Chat
                </Button>
              </SidebarGroupLabel>
            </SidebarGroup>

            <Separator />

            <SidebarGroup>
              <SidebarGroupLabel>Uploaded Documents</SidebarGroupLabel>
              <SidebarGroupContent>
                {documents.length === 0 ? (
                  <div className="px-4 py-4 text-center text-xs text-muted-foreground">
                    No documents uploaded yet
                  </div>
                ) : (
                  <div className="px-2 space-y-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-start justify-between p-2 rounded-md hover:bg-accent text-xs group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{doc.title}</p>
                          <p className="text-muted-foreground">
                            {doc.chunkCount} chunks • {doc.embeddingStatus}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="opacity-0 group-hover:opacity-100 ml-2 text-destructive hover:text-destructive/80"
                          title="Delete document"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </SidebarGroupContent>
            </SidebarGroup>

            <Separator />

            <SidebarGroup>
              <SidebarGroupLabel>Recent Conversations</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {threads.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                      No conversations yet.
                      <br />
                      Start a new chat!
                    </div>
                  ) : (
                    threads.map((thread) => (
                      <SidebarMenuItem key={thread.id} className="group">
                        <div className="relative flex items-center w-full">
                          <SidebarMenuButton
                            onClick={() => setCurrentThreadId(thread.id)}
                            isActive={currentThreadId === thread.id}
                            className="flex-1 pr-9"
                          >
                            <span className="truncate">{thread.title}</span>
                          </SidebarMenuButton>
                          <button
                            onClick={(e) => handleDeleteThread(thread.id, e)}
                            className="absolute right-1 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-opacity"
                            title="Delete conversation"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </SidebarMenuItem>
                    ))
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="flex items-center gap-3">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b p-4 flex items-center gap-2">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">
                {currentThreadId ? "Conversation" : "New Conversation"}
              </h1>
              <p className="text-sm text-muted-foreground">
                Ask questions about research from PubMed and arXiv
              </p>
            </div>
            <Badge variant="secondary" className="hidden md:flex">
              RAG-Powered
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSearchModal(true)}
              title="Search PubMed & arXiv"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Papers
            </Button>
            {messages.length > 0 && (
              <div className="flex gap-2">
                <div
                  className="relative"
                  onMouseEnter={() => setShowExportMenu(true)}
                  onMouseLeave={() => setShowExportMenu(false)}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    title="Export conversation"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export
                  </Button>
                  {showExportMenu && (
                    <div className="absolute right-0 mt-1 w-56 bg-background border rounded-md shadow-lg z-50">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            exportConversation('markdown');
                            setShowExportMenu(false);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-muted text-sm flex items-center gap-3 transition-colors"
                        >
                          <span className="text-lg">📄</span>
                          <div className="flex flex-col">
                            <span className="font-medium">Markdown</span>
                            <span className="text-xs text-muted-foreground">.md file</span>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            exportConversation('text');
                            setShowExportMenu(false);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-muted text-sm flex items-center gap-3 transition-colors"
                        >
                          <span className="text-lg">📝</span>
                          <div className="flex flex-col">
                            <span className="font-medium">Text</span>
                            <span className="text-xs text-muted-foreground">.txt file</span>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            exportConversation('pdf');
                            setShowExportMenu(false);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-muted text-sm flex items-center gap-3 transition-colors"
                        >
                          <span className="text-lg">📕</span>
                          <div className="flex flex-col">
                            <span className="font-medium">PDF</span>
                            <span className="text-xs text-muted-foreground">.pdf file</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </header>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="max-w-md space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <svg
                      className="w-8 h-8 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold">
                    Start a Research Conversation
                  </h2>
                  <p className="text-muted-foreground">
                    Ask me anything about research papers, scientific topics, or
                    upload your own documents to discuss.
                  </p>
                  <div className="grid gap-2 pt-4">
                    <button
                      onClick={() => setInput("What are the latest breakthroughs in mRNA vaccines?")}
                      className="text-left"
                    >
                      <Card className="p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                        <p className="text-sm">
                          💡 &quot;What are the latest breakthroughs in mRNA vaccines?&quot;
                        </p>
                      </Card>
                    </button>
                    <button
                      onClick={() => setInput("Explain CRISPR gene editing mechanisms")}
                      className="text-left"
                    >
                      <Card className="p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                        <p className="text-sm">
                          🔬 &quot;Explain CRISPR gene editing mechanisms&quot;
                        </p>
                      </Card>
                    </button>
                    <button
                      onClick={() => setInput("Compare deep learning architectures in computer vision")}
                      className="text-left"
                    >
                      <Card className="p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                        <p className="text-sm">
                          📊 &quot;Compare deep learning architectures in computer vision&quot;
                        </p>
                      </Card>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-chart-1 to-chart-3 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-medium">AI</span>
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                          : "bg-muted rounded-2xl rounded-tl-sm"
                      } p-4`}
                    >
                      {message.role === "user" ? (
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                      ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                            components={{
                              code: ({ className, children, ...props }) => {
                                const isInline = !className;
                                return isInline ? (
                                  <code className="bg-background/50 px-1 py-0.5 rounded text-xs" {...props}>
                                    {children}
                                  </code>
                                ) : (
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                );
                              },
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}

                      {/* Action buttons for assistant messages */}
                      {message.role === "assistant" && (
                        <div className="mt-3 flex items-center gap-2 border-t border-border/50 pt-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(message.content);
                              // Optional: Show a toast notification
                            }}
                            className="text-xs px-2 py-1 rounded hover:bg-background/50 transition-colors flex items-center gap-1"
                            title="Copy to clipboard"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy
                          </button>
                        </div>
                      )}

                      {message.citations && message.citations.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                          <p className="text-xs font-medium opacity-70">
                            Citations:
                          </p>
                          {message.citations.map((citation, idx) => (
                            <div
                              key={idx}
                              className="text-xs opacity-80 flex items-center gap-2"
                            >
                              <Badge variant="outline" className="text-xs">
                                {citation.source}
                              </Badge>
                              <span>{citation.title}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="text-xs opacity-50 mt-2">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium">
                          {user.name?.charAt(0) || "U"}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-chart-1 to-chart-3 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">AI</span>
                    </div>
                    <div className="bg-muted rounded-2xl rounded-tl-sm p-4 max-w-[70%]">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="max-w-4xl mx-auto space-y-3">
              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((file, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="flex items-center gap-2"
                    >
                      📄 {file.name}
                      <button
                        onClick={() =>
                          setSelectedFiles((prev) =>
                            prev.filter((_, i) => i !== idx)
                          )
                        }
                        className="hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Input Box */}
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </Button>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about research papers, or upload documents..."
                  className="min-h-[60px] max-h-[200px] resize-none"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || (!input.trim() && selectedFiles.length === 0)}
                  size="icon"
                  className="h-[60px] w-[60px]"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  )}
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                PaperTrail can make mistakes. Verify important information with original sources.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => setShowSearchModal(false)}>
          <div className="bg-background border rounded-lg w-full max-w-3xl my-8 flex flex-col shadow-xl" onClick={(e) => e.stopPropagation()} style={{ maxHeight: 'calc(100vh - 4rem)' }}>
            <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
              <h2 className="text-lg font-semibold">Search PubMed & arXiv</h2>
              <button onClick={() => setShowSearchModal(false)} className="text-muted-foreground hover:text-foreground">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 border-b flex gap-2 flex-shrink-0">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search for research papers..."
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: '400px' }}>
              {searchResults.length === 0 && !isSearching && (
                <div className="text-center text-muted-foreground py-12">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p>Search for papers from PubMed and arXiv</p>
                </div>
              )}

              {isSearching && (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  ))}
                </div>
              )}

              {searchResults.map((paper, idx) => (
                <div key={idx} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{paper.source}</Badge>
                        <span className="text-xs text-muted-foreground">{paper.year}</span>
                      </div>
                      <h3 className="font-medium mb-1">{paper.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{paper.authors}</p>
                      {paper.abstract && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{paper.abstract}</p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => insertPaperReference(paper)}
                      title="Add to message"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </SidebarProvider>
  );
}

