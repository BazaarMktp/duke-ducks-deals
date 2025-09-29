
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Image, X } from "lucide-react";
import { useMessageAttachments } from "@/hooks/useMessageAttachments";

interface MessageInputProps {
  onSendMessage: (message: string, attachments?: any[]) => void;
  initialMessage?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, initialMessage }) => {
  const [newMessage, setNewMessage] = useState(initialMessage || "");
  const [sending, setSending] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploading, uploadAttachments } = useMessageAttachments();

  // Update message when initialMessage prop changes
  React.useEffect(() => {
    if (initialMessage) {
      setNewMessage(initialMessage);
    }
  }, [initialMessage]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > 3) {
      return; // Max 3 images
    }

    const newFiles = files.slice(0, 3 - selectedFiles.length);
    setSelectedFiles(prev => [...prev, ...newFiles]);

    // Create preview URLs
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if ((!newMessage.trim() && selectedFiles.length === 0) || sending || uploading) return;
    
    setSending(true);
    try {
      let attachments: any[] = [];
      
      // Upload attachments if any
      if (selectedFiles.length > 0) {
        attachments = await uploadAttachments(selectedFiles);
        if (attachments.length === 0) {
          setSending(false);
          return; // Upload failed
        }
      }

      await onSendMessage(newMessage.trim(), attachments);
      setNewMessage("");
      setSelectedFiles([]);
      setPreviewUrls([]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !sending) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-2">
      {/* Image Previews */}
      {previewUrls.length > 0 && (
        <div className="flex gap-2 px-2 flex-wrap">
          {previewUrls.map((url, idx) => (
            <div key={idx} className="relative group">
              <img 
                src={url} 
                alt={`Preview ${idx + 1}`}
                className="h-16 w-16 object-cover rounded-lg border-2 border-muted"
              />
              <button
                onClick={() => removeFile(idx)}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Row */}
      <div className="flex gap-2 items-center px-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={sending || uploading || selectedFiles.length >= 3}
          className="rounded-full h-10 w-10 shrink-0"
        >
          <Image size={20} className={selectedFiles.length >= 3 ? 'text-muted-foreground' : ''} />
        </Button>

        <div className="flex-1">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={handleKeyPress}
            disabled={sending || uploading}
            className="rounded-full border-2 px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        
        <Button 
          onClick={handleSend} 
          disabled={(!newMessage.trim() && selectedFiles.length === 0) || sending || uploading}
          size="icon"
          className="rounded-full h-10 w-10 shrink-0 shadow-md hover:shadow-lg transition-all"
        >
          {uploading ? (
            <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full" />
          ) : (
            <Send size={18} />
          )}
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
