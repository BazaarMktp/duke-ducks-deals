import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  HardDrive, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw, 
  File,
  Database,
  Loader2 
} from 'lucide-react';
import { useDeviceStorage } from '@/hooks/useDeviceStorage';
import { Badge } from '@/components/ui/badge';

const DeviceStorageManager = () => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<{[key: string]: string}>({});
  
  const {
    setPreference,
    getPreference,
    removePreference,
    clearAllPreferences,
    saveFile,
    readFile,
    deleteFile,
    listFiles,
    cacheData,
    getCachedData,
    clearCache,
    isLoading,
  } = useDeviceStorage();

  useEffect(() => {
    loadFiles();
    loadSamplePreferences();
  }, []);

  const loadFiles = async () => {
    const fileList = await listFiles();
    setFiles(fileList);
  };

  const loadSamplePreferences = async () => {
    const sampleKeys = ['user_settings', 'app_theme', 'last_sync'];
    const prefs: {[key: string]: string} = {};
    
    for (const key of sampleKeys) {
      const value = await getPreference(key);
      if (value) {
        prefs[key] = value;
      }
    }
    setPreferences(prefs);
  };

  const handleSavePreference = async () => {
    if (!key || !value) return;
    
    const success = await setPreference(key, value);
    if (success) {
      setKey('');
      setValue('');
      await loadSamplePreferences();
    }
  };

  const handleRemovePreference = async (prefKey: string) => {
    const success = await removePreference(prefKey);
    if (success) {
      await loadSamplePreferences();
    }
  };

  const handleSaveFile = async () => {
    if (!fileName || !fileContent) return;
    
    const success = await saveFile(fileName, fileContent);
    if (success) {
      setFileName('');
      setFileContent('');
      await loadFiles();
    }
  };

  const handleReadFile = async (file: string) => {
    const content = await readFile(file);
    if (content) {
      setFileContent(content);
      setFileName(file);
    }
  };

  const handleDeleteFile = async (file: string) => {
    const success = await deleteFile(file);
    if (success) {
      await loadFiles();
      if (fileName === file) {
        setFileName('');
        setFileContent('');
      }
    }
  };

  const handleCacheTest = async () => {
    const testData = {
      timestamp: new Date().toISOString(),
      listings: ['item1', 'item2', 'item3'],
      user: { name: 'Test User', id: '123' }
    };
    
    await cacheData('test_data', testData);
    
    const cached = await getCachedData('test_data');
    console.log('Cached data:', cached);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="h-5 w-5" />
          Device Storage
        </CardTitle>
        <CardDescription>
          Manage local storage, preferences, and files on the device.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preferences Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <h3 className="font-medium">Preferences (Key-Value Storage)</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
            <Input
              placeholder="Value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={handleSavePreference}
            disabled={!key || !value || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Save Preference
          </Button>

          {Object.keys(preferences).length > 0 && (
            <div className="space-y-2">
              <Label>Stored Preferences:</Label>
              {Object.entries(preferences).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex-1 min-w-0">
                    <Badge variant="secondary" className="mr-2">{key}</Badge>
                    <span className="text-sm text-muted-foreground truncate">
                      {value.length > 30 ? value.substring(0, 30) + '...' : value}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemovePreference(key)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={handleCacheTest}
              variant="outline"
              className="flex-1"
            >
              Test Cache
            </Button>
            <Button 
              onClick={clearCache}
              variant="outline"
              className="flex-1"
            >
              Clear Cache
            </Button>
            <Button 
              onClick={clearAllPreferences}
              variant="destructive"
              className="flex-1"
            >
              Clear All
            </Button>
          </div>
        </div>

        <Separator />

        {/* File Storage Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <File className="h-4 w-4" />
            <h3 className="font-medium">File Storage</h3>
          </div>
          
          <Input
            placeholder="File name (e.g., data.txt)"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
          
          <Textarea
            placeholder="File content..."
            value={fileContent}
            onChange={(e) => setFileContent(e.target.value)}
            rows={4}
          />
          
          <Button 
            onClick={handleSaveFile}
            disabled={!fileName || !fileContent || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Save File
          </Button>

          {files.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Device Files:</Label>
                <Button size="sm" variant="outline" onClick={loadFiles}>
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh
                </Button>
              </div>
              {files.map((file) => (
                <div key={file} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm font-mono">{file}</span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReadFile(file)}
                    >
                      Read
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteFile(file)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceStorageManager;