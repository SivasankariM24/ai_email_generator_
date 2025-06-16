
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, Send, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateEmailWithGemini } from '../services/aiService';
import { generateEmail } from '../utils/emailTemplates';

interface EmailForm {
  purpose: string;
  emailType: string;
  recipient: string;
  sender: string;
  company: string;
  subject: string;
  additionalInfo: string;
  maxLength: number;
  preferredAI: string;
}

const EmailGenerator = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [generationStatus, setGenerationStatus] = useState('');
  const [usedAI, setUsedAI] = useState<'gemini' | 'template' | null>(null);
  const [form, setForm] = useState<EmailForm>({
    purpose: 'thank_you',
    emailType: 'casual',
    recipient: 'John Doe',
    sender: 'Sivasankari M',
    company: '',
    subject: 'Thank you for the birthday gift',
    additionalInfo: 'Thank you for the beautiful silver watch you gave me for my 25th birthday. It matches perfectly with my professional wardrobe and I love wearing it to work.',
    maxLength: 150,
    preferredAI: 'gemini'
  });

  const handleInputChange = (field: keyof EmailForm, value: string | number) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const hasGeminiKey = () => {
    return !!(localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GOOGLE_API_KEY);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedEmail('');
    setUsedAI(null);
    setGenerationStatus('🤖 Connecting to AI service...');

    try {
      let email = '';
      let aiUsed: 'gemini' | 'template' = 'template';

      // Try Gemini AI first if available and preferred
      if (form.preferredAI === 'gemini' && hasGeminiKey()) {
        try {
          setGenerationStatus('🧠 Generating with Google Gemini AI...');
          email = await generateEmailWithGemini(form);
          aiUsed = 'gemini';
          console.log('Successfully generated email with Gemini AI');
        } catch (error) {
          console.error('Gemini AI failed, falling back to templates:', error);
          setGenerationStatus('⚠️ AI unavailable, using smart templates...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          email = generateEmail(form);
          aiUsed = 'template';
          
          toast({
            title: "AI Service Unavailable",
            description: "Using template system as fallback. Check your API key in Service Status.",
            variant: "destructive",
          });
        }
      } else {
        // Use template system
        setGenerationStatus('📝 Generating with smart templates...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        email = generateEmail(form);
        aiUsed = 'template';
        
        if (form.preferredAI === 'gemini' && !hasGeminiKey()) {
          toast({
            title: "API Key Required",
            description: "Configure your Gemini API key in Service Status to use AI generation.",
          });
        }
      }
      
      const timestamp = new Date().toLocaleTimeString();
      setGeneratedEmail(email);
      setUsedAI(aiUsed);
      
      if (aiUsed === 'gemini') {
        setGenerationStatus(`✨ Generated with Google Gemini AI at ${timestamp}`);
        toast({
          title: "AI Email Generated!",
          description: "Your personalized email has been created using Google Gemini.",
        });
      } else {
        setGenerationStatus(`📋 Generated with Smart Templates at ${timestamp}`);
        toast({
          title: "Email Generated!",
          description: "Your professional email is ready using our template system.",
        });
      }

    } catch (error) {
      console.error('Email generation failed completely:', error);
      setGenerationStatus(`❌ Generation failed at ${new Date().toLocaleTimeString()}`);
      toast({
        title: "Generation Failed",
        description: "Please try again or check your settings.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedEmail);
      toast({
        title: "Copied to Clipboard!",
        description: "Email content has been copied successfully.",
      });
    } catch (error) {
      console.error('Copy failed:', error);
      toast({
        title: "Copy Failed",
        description: "Please select and copy the text manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Configuration Panel */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Preference */}
          <div className="space-y-2">
            <Label htmlFor="preferredAI">🤖 AI Generation</Label>
            <Select value={form.preferredAI} onValueChange={(value) => handleInputChange('preferredAI', value)}>
              <SelectTrigger className={!hasGeminiKey() ? "border-orange-300 bg-orange-50" : ""}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini">
                  🧠 Google Gemini AI {!hasGeminiKey() && "(API Key Required)"}
                </SelectItem>
                <SelectItem value="template">📝 Smart Templates (Always Available)</SelectItem>
              </SelectContent>
            </Select>
            {form.preferredAI === 'gemini' && !hasGeminiKey() && (
              <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
                <AlertTriangle className="h-4 w-4" />
                Configure API key in Service Status tab to use AI generation
              </div>
            )}
          </div>

          {/* Email Purpose */}
          <div className="space-y-2">
            <Label htmlFor="purpose">📝 Email Purpose</Label>
            <Select value={form.purpose} onValueChange={(value) => handleInputChange('purpose', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thank_you">Thank You</SelectItem>
                <SelectItem value="job_application">Job Application</SelectItem>
                <SelectItem value="meeting_request">Meeting Request</SelectItem>
                <SelectItem value="follow_up">Follow Up</SelectItem>
                <SelectItem value="complaint">Professional Complaint</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Email Style */}
          <div className="space-y-2">
            <Label htmlFor="emailType">🎨 Email Style</Label>
            <Select value={form.emailType} onValueChange={(value) => handleInputChange('emailType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casual">Casual (Friendly)</SelectItem>
                <SelectItem value="formal">Formal (Respectful)</SelectItem>
                <SelectItem value="business">Business (Professional)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Email Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">📧 To (Recipient)</Label>
              <Input
                id="recipient"
                value={form.recipient}
                onChange={(e) => handleInputChange('recipient', e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sender">✍️ From (Your Name)</Label>
              <Input
                id="sender"
                value={form.sender}
                onChange={(e) => handleInputChange('sender', e.target.value)}
                placeholder="Your Full Name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">🏢 Company (Optional)</Label>
            <Input
              id="company"
              value={form.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder="Your Company Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">📬 Subject Line</Label>
            <Input
              id="subject"
              value={form.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Thank you for the birthday gift"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalInfo">💬 Context & Details</Label>
            <Textarea
              id="additionalInfo"
              value={form.additionalInfo}
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              placeholder="Be specific! The more details you provide, the better the AI can personalize your email."
              rows={4}
            />
            <p className="text-sm text-gray-500">
              {form.preferredAI === 'gemini' && hasGeminiKey() 
                ? 'The AI will use these details to create a personalized, context-aware email!'
                : 'These details will be incorporated into your professional email template.'
              }
            </p>
          </div>

          <div className="space-y-3">
            <Label>📏 Email Length: {form.maxLength} words</Label>
            <Slider
              value={[form.maxLength]}
              onValueChange={(value) => handleInputChange('maxLength', value[0])}
              min={50}
              max={300}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Concise (50)</span>
              <span>Detailed (300)</span>
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="w-full h-12 text-lg"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                {form.preferredAI === 'gemini' && hasGeminiKey() ? '🤖 Generate AI Email' : '📝 Generate Email'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Output Panel */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              📧 Generated Email
              {usedAI && (
                <Badge variant={usedAI === 'gemini' ? 'default' : 'secondary'} className="ml-2">
                  {usedAI === 'gemini' ? '🤖 AI-Powered' : '📋 Template-Based'}
                </Badge>
              )}
            </span>
            {generatedEmail && (
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Generation Status */}
            {generationStatus && (
              <div className={`p-3 border rounded-lg ${
                usedAI === 'gemini' ? 'bg-blue-50 border-blue-200' : 
                usedAI === 'template' ? 'bg-green-50 border-green-200' : 
                'bg-gray-50 border-gray-200'
              }`}>
                <p className={`text-sm font-medium ${
                  usedAI === 'gemini' ? 'text-blue-800' : 
                  usedAI === 'template' ? 'text-green-800' : 
                  'text-gray-800'
                }`}>
                  {generationStatus}
                </p>
              </div>
            )}

            {/* Generated Email Output */}
            <div className="space-y-2">
              <Textarea
                value={generatedEmail || 'Your personalized email will appear here...'}
                readOnly
                rows={20}
                className="font-mono text-sm resize-none"
                placeholder="Your personalized email will appear here..."
              />
            </div>

            {/* AI Features Info */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  ✨ AI vs Template Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-blue-700 mb-2">🤖 Google Gemini AI:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Unique content every time</li>
                      <li>• Context-aware writing</li>
                      <li>• Natural conversation flow</li>
                      <li>• Adapts to your specific needs</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">📝 Smart Templates:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Always available</li>
                      <li>• Professional structure</li>
                      <li>• Fast generation</li>
                      <li>• Reliable fallback</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailGenerator;
