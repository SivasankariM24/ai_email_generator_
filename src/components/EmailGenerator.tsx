
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, Send, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
  const [form, setForm] = useState<EmailForm>({
    purpose: 'thank_you',
    emailType: 'casual',
    recipient: 'John Doe',
    sender: 'Sivasankari M',
    company: '',
    subject: 'Thank you for the birthday gift',
    additionalInfo: 'Thank you for the beautiful silver watch you gave me for my 25th birthday. It matches perfectly with my professional wardrobe and I love wearing it to work.',
    maxLength: 150,
    preferredAI: 'auto'
  });

  const handleInputChange = (field: keyof EmailForm, value: string | number) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedEmail(''); // Clear previous result to prevent duplication
    setGenerationStatus('🔄 Generating your professional email...');

    try {
      // Simulate AI generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const email = generateEmail(form);
      const timestamp = new Date().toLocaleTimeString();
      
      // Set results with single update to prevent duplication
      setGeneratedEmail(email);
      setGenerationStatus(`✅ Generated with AI Template Engine at ${timestamp}`);
      
      toast({
        title: "Email Generated Successfully!",
        description: "Your professional email is ready to use.",
      });
    } catch (error) {
      console.error('Email generation failed:', error);
      setGenerationStatus(`❌ Generation failed at ${new Date().toLocaleTimeString()}`);
      toast({
        title: "Generation Failed",
        description: "Please try again or check your inputs.",
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

          {/* AI Preference */}
          <div className="space-y-2">
            <Label htmlFor="preferredAI">🤖 AI Preference</Label>
            <Select value={form.preferredAI} onValueChange={(value) => handleInputChange('preferredAI', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto (Recommended)</SelectItem>
                <SelectItem value="gemini">Google Gemini</SelectItem>
                <SelectItem value="huggingface">Hugging Face</SelectItem>
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
            <p className="text-sm text-gray-500">The more specific details you provide, the better the AI can personalize your email!</p>
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
                🚀 Generate AI Email
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
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-800">{generationStatus}</p>
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
                  ✨ AI Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-blue-700 mb-2">🧠 Google Gemini:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Advanced reasoning</li>
                      <li>• Natural writing style</li>
                      <li>• Complex communication</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-700 mb-2">🤗 Hugging Face:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Multiple models</li>
                      <li>• Creative emails</li>
                      <li>• Free to use</li>
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
