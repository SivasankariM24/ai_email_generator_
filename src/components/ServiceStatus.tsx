
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, RefreshCw, ExternalLink, Key, Info, Eye, EyeOff } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { checkGeminiConnection } from '../services/aiService';

interface ServiceStatus {
  name: string;
  status: 'connected' | 'disconnected' | 'checking';
  icon: string;
  description: string;
  setupUrl: string;
}

const ServiceStatus = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'Google Gemini',
      status: 'disconnected',
      icon: '🧠',
      description: 'Advanced AI model for high-quality email generation',
      setupUrl: 'https://makersuite.google.com/app/apikey'
    }
  ]);

  const [isChecking, setIsChecking] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const checkServiceStatus = async () => {
    setIsChecking(true);
    
    // Check for existing API keys
    const storedGeminiKey = localStorage.getItem('gemini_api_key');
    const envGeminiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    const hasGeminiKey = !!(storedGeminiKey || envGeminiKey);
    
    if (storedGeminiKey) {
      setGeminiApiKey(storedGeminiKey);
    }
    
    if (hasGeminiKey) {
      // Test actual connection
      setServices(prev => prev.map(service => ({
        ...service,
        status: service.name === 'Google Gemini' ? 'checking' : service.status
      })));
      
      try {
        const isConnected = await checkGeminiConnection();
        setServices(prev => prev.map(service => ({
          ...service,
          status: service.name === 'Google Gemini' 
            ? (isConnected ? 'connected' : 'disconnected')
            : service.status
        })));
        
        if (isConnected) {
          console.log('Gemini API connection successful');
        } else {
          console.log('Gemini API connection failed');
        }
      } catch (error) {
        console.error('Error checking Gemini connection:', error);
        setServices(prev => prev.map(service => ({
          ...service,
          status: service.name === 'Google Gemini' ? 'disconnected' : service.status
        })));
      }
    } else {
      setServices(prev => prev.map(service => ({
        ...service,
        status: service.name === 'Google Gemini' ? 'disconnected' : service.status
      })));
    }
    
    setIsChecking(false);
  };

  const saveApiKey = () => {
    if (geminiApiKey.trim()) {
      localStorage.setItem('gemini_api_key', geminiApiKey.trim());
      toast({
        title: "API Key Saved",
        description: "Your Gemini API key has been saved locally.",
      });
      checkServiceStatus();
    } else {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
    }
  };

  const removeApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setGeminiApiKey('');
    toast({
      title: "API Key Removed",
      description: "Your Gemini API key has been removed.",
    });
    checkServiceStatus();
  };

  useEffect(() => {
    checkServiceStatus();
  }, []);

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'disconnected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'checking':
        return <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />;
    }
  };

  const getStatusBadge = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'connected':
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">✅ Connected</Badge>;
      case 'disconnected':
        return <Badge variant="destructive">❌ Not Connected</Badge>;
      case 'checking':
        return <Badge variant="secondary">🔄 Testing...</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* API Key Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Key Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="gemini-key">🧠 Google Gemini API Key</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="gemini-key"
                  type={showApiKey ? 'text' : 'password'}
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="Enter your Gemini API key..."
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button onClick={saveApiKey} disabled={!geminiApiKey.trim()}>
                Save
              </Button>
              {localStorage.getItem('gemini_api_key') && (
                <Button onClick={removeApiKey} variant="outline">
                  Remove
                </Button>
              )}
            </div>
            <p className="text-sm text-gray-600">
              Your API key is stored locally in your browser and never sent to our servers.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Service Status Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            AI Service Status
          </CardTitle>
          <Button 
            onClick={checkServiceStatus} 
            disabled={isChecking}
            variant="outline"
            size="sm"
          >
            {isChecking ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Test Connection
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {services.map((service) => (
              <Card key={service.name} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{service.icon}</span>
                      <h3 className="font-semibold">{service.name}</h3>
                    </div>
                    {getStatusIcon(service.status)}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                  
                  <div className="flex items-center justify-between">
                    {getStatusBadge(service.status)}
                    <Button variant="ghost" size="sm" asChild>
                      <a href={service.setupUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Get API Key
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Setup Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="gemini">
              <AccordionTrigger>🧠 Google Gemini Setup</AccordionTrigger>
              <AccordionContent className="space-y-3">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a></li>
                  <li>Sign in with your Google account</li>
                  <li>Click "Create API Key" and select a project (or create new one)</li>
                  <li>Copy your API key</li>
                  <li>Paste it in the API Key Configuration section above</li>
                  <li>Click "Save" and test the connection</li>
                </ol>
                <Alert>
                  <AlertDescription>
                    <strong>Free Tier:</strong> 60 requests per minute, perfect for personal use. Your API key is stored locally and never shared.
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="troubleshooting">
              <AccordionTrigger>🔧 Troubleshooting</AccordionTrigger>
              <AccordionContent className="space-y-3">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Common Issues:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Make sure your API key is correctly copied (no extra spaces)</li>
                      <li>• Verify your Google AI Studio project has the Gemini API enabled</li>
                      <li>• Check that you haven't exceeded your rate limits</li>
                      <li>• Ensure your API key has the necessary permissions</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">If connection fails:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• The system will automatically fall back to template generation</li>
                      <li>• You can still generate professional emails using our template system</li>
                      <li>• No functionality is lost - just fewer AI customization options</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle>✨ AI vs Template Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-blue-700 flex items-center gap-2">
                🧠 Google Gemini AI Advantages
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Generates unique content every time
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Understands context and nuance
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Adapts writing style naturally
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Handles complex requests intelligently
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-green-700 flex items-center gap-2">
                📝 Smart Template Advantages
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Always available (no API required)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Instant generation speed
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Professional structure guaranteed
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Perfect fallback when AI is unavailable
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceStatus;
