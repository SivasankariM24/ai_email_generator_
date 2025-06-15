
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, RefreshCw, ExternalLink, Key, Info } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ServiceStatus {
  name: string;
  status: 'connected' | 'disconnected' | 'checking';
  icon: string;
  description: string;
  setupUrl: string;
}

const ServiceStatus = () => {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'Google Gemini',
      status: 'disconnected',
      icon: '🧠',
      description: 'Advanced AI model for high-quality email generation',
      setupUrl: 'https://makersuite.google.com/app/apikey'
    },
    {
      name: 'Hugging Face',
      status: 'disconnected',
      icon: '🤗',
      description: 'Multiple AI models for creative email generation',
      setupUrl: 'https://huggingface.co/settings/tokens'
    }
  ]);

  const [isChecking, setIsChecking] = useState(false);

  const checkServiceStatus = async () => {
    setIsChecking(true);
    
    // Simulate API key checking
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, you would check for actual API keys
    const hasGeminiKey = localStorage.getItem('gemini_api_key') || process.env.GOOGLE_API_KEY;
    const hasHuggingFaceKey = localStorage.getItem('huggingface_api_key') || process.env.HUGGINGFACE_API_KEY;
    
    setServices(prev => prev.map(service => ({
      ...service,
      status: service.name === 'Google Gemini' 
        ? (hasGeminiKey ? 'connected' : 'disconnected')
        : (hasHuggingFaceKey ? 'connected' : 'disconnected')
    })));
    
    setIsChecking(false);
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
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">✅ Ready</Badge>;
      case 'disconnected':
        return <Badge variant="destructive">❌ API Key Missing</Badge>;
      case 'checking':
        return <Badge variant="secondary">🔄 Checking...</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
            Refresh Status
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        Setup
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
                  <li>Click "Create API Key" and select a project</li>
                  <li>Copy your API key</li>
                  <li>Set environment variable: <code className="bg-gray-100 px-2 py-1 rounded">GOOGLE_API_KEY=your_key_here</code></li>
                </ol>
                <Alert>
                  <AlertDescription>
                    <strong>Free Tier:</strong> 60 requests per minute, perfect for personal use
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="huggingface">
              <AccordionTrigger>🤗 Hugging Face Setup</AccordionTrigger>
              <AccordionContent className="space-y-3">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Create account at <a href="https://huggingface.co/join" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Hugging Face</a></li>
                  <li>Go to <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Token Settings</a></li>
                  <li>Click "New token" and select "Read" permissions</li>
                  <li>Copy your access token</li>
                  <li>Set environment variable: <code className="bg-gray-100 px-2 py-1 rounded">HUGGINGFACE_API_KEY=your_token_here</code></li>
                </ol>
                <Alert>
                  <AlertDescription>
                    <strong>Free Tier:</strong> Unlimited requests for most models, completely free
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="env">
              <AccordionTrigger>⚙️ Environment Variables</AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p className="text-sm">You can set up your API keys in several ways:</p>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Option 1: .env file (Recommended)</h4>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`# Create a .env file in your project root
GOOGLE_API_KEY=your_gemini_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_token_here`}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Option 2: System Environment Variables</h4>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`# Windows
set GOOGLE_API_KEY=your_key_here
set HUGGINGFACE_API_KEY=your_token_here

# Mac/Linux
export GOOGLE_API_KEY=your_key_here
export HUGGINGFACE_API_KEY=your_token_here`}
                    </pre>
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
          <CardTitle>✨ AI Features & Capabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-blue-700 flex items-center gap-2">
                🧠 Google Gemini Advantages
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Advanced reasoning and context understanding
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Natural, human-like writing style
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Excellent for complex professional communication
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Handles nuanced tone and formality levels
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-purple-700 flex items-center gap-2">
                🤗 Hugging Face Advantages
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Multiple specialized models available
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Completely free to use
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Good for creative and conversational emails
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  No rate limits for basic usage
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
