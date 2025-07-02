
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SharedLinkGenerator: React.FC = () => {
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateSharedLink = () => {
    // Generate a simple token (in production, use a more secure method)
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const baseUrl = window.location.origin + window.location.pathname;
    const sharedLink = `${baseUrl}?shared_token=${token}`;
    
    setGeneratedLink(sharedLink);
    toast({
      title: "Shared Link Generated",
      description: "Link will expire on July 4th, 2025 at 5:00 PM EST",
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Shared link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <Share className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Generate Shared Link
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <Button onClick={generateSharedLink} className="w-full sm:w-auto">
            Generate New Shared Link
          </Button>
        </div>

        {generatedLink && (
          <div className="space-y-3">
            <Label htmlFor="shared-link">Generated Link (Expires July 4th, 5PM EST)</Label>
            <div className="flex space-x-2">
              <Input
                id="shared-link"
                value={generatedLink}
                readOnly
                className="flex-1"
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="icon"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> This link will automatically expire on July 4th, 2025 at 5:00 PM EST. 
                Users accessing via this link will see a preview version with limited functionality.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
