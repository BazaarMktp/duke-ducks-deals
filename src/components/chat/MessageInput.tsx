import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Send, ImagePlus, X, Loader2 } from "lucide-react";
import { useMessageAttachments } from "@/hooks/useMessageAttachments";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  onSendMessage: (message: string, attachments?: any[]) => void;
  initialMessage?: string;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  initialMessage = '',
  disabled = false
}) => {
  const [newMessage, setNewMessage] = useState(initialMessage);
  const [sending, setSending] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { uploading, uploadAttachments } = useMessageAttachments();

  // Update message when initialMessage prop changes
  useEffect(() => {
    if (initialMessage) {
      setNewMessage(initialMessage);
      // Focus the textarea when initial message is set
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [initialMessage]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [newMessage]);

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
    if ((!newMessage.trim() && selectedFiles.length === 0) || sending || uploading || disabled) return;
    
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
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !sending) {
      e.preventDefault();
      handleSend();
    }
  };

  const isDisabled = disabled || sending || uploading;
  const canSend = (newMessage.trim() || selectedFiles.length > 0) && !isDisabled;

  return (
    <div className="space-y-3">
      {/* Image Previews */}
      {previewUrls.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {previewUrls.map((url, idx) => (
            <div key={idx} className="relative group flex-shrink-0">
              <img 
                src={url} 
                alt={`Preview ${idx + 1}`}
                className="h-16 w-16 object-cover rounded-xl border-2 border-border"
              />
              <button
                onClick={() => removeFile(idx)}
                className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-0.5 shadow-md hover:bg-destructive/90 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-end gap-2">
        {/* Image upload button */}
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
          disabled={isDisabled || selectedFiles.length >= 3}
          className="h-10 w-10 flex-shrink-0 rounded-full hover:bg-muted"
        >
          <ImagePlus size={20} className={selectedFiles.length >= 3 ? 'text-muted-foreground' : 'text-muted-foreground'} />
        </Button>

        {/* Message input */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={handleKeyDown}
            disabled={isDisabled}
            rows={1}
            className="min-h-[44px] max-h-[120px] py-3 px-4 rounded-2xl resize-none text-[15px] bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary/50 placeholder:text-muted-foreground/70"
          />
        </div>
        
        {/* Send button */}
        <Button 
          onClick={handleSend} 
          disabled={!canSend}
          size="icon"
          className={`h-10 w-10 flex-shrink-0 rounded-full transition-all ${
            canSend 
              ? 'bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg' 
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {uploading || sending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} className={canSend ? '' : ''} />
          )}
        </Button>
      </div>
      
      {/* Helper text */}
      <p className="text-[11px] text-muted-foreground text-center">
        Press Enter to send • Shift+Enter for new line
      </p>
    </div>
  );
};

export default MessageInput;
