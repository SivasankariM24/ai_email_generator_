
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

interface EmailTemplate {
  greeting: string;
  closing: string;
}

export const generateEmail = (form: EmailForm): string => {
  // Email format templates
  const templates: Record<string, EmailTemplate> = {
    casual: { 
      greeting: `Hi ${form.recipient || 'there'},`, 
      closing: `Best regards,\n${form.sender || 'Your Name'}` 
    },
    formal: { 
      greeting: `Dear ${form.recipient || 'Sir/Madam'},`, 
      closing: `Sincerely,\n${form.sender || 'Your Name'}` 
    },
    business: { 
      greeting: `Dear ${form.recipient || 'Sir/Madam'},`, 
      closing: `Best regards,\n${form.sender || 'Your Name'}${form.company ? `\n${form.company}` : ''}` 
    }
  };

  const template = templates[form.emailType] || templates.casual;

  // Enhanced content based on purpose
  const contentLibrary: Record<string, string> = {
    thank_you: `I wanted to take a moment to express my heartfelt gratitude for ${form.additionalInfo || 'your kindness and support'}. Your thoughtfulness truly means a great deal to me, and I feel fortunate to know someone as generous and caring as you.

${form.additionalInfo || 'Your support'} has made a real difference, and I want you to know how much I appreciate everything you've done. It's people like you who make the world a brighter place.

Thank you once again for your generosity and kindness. I hope I can return the favor someday.`,

    job_application: `I am writing to express my strong interest in the position at your esteemed organization. ${form.additionalInfo || 'Based on my research and experience, I believe I would be a valuable addition to your team.'}

My background and skills align well with the requirements, and I am particularly excited about the opportunity to contribute to your company's continued success. I am confident that my experience and enthusiasm would make me an asset to your organization.

I have attached my resume for your review and would welcome the opportunity to discuss how I can contribute to your team. Thank you for considering my application, and I look forward to hearing from you.`,

    meeting_request: `I hope this email finds you well. I would like to schedule a meeting to discuss ${form.additionalInfo || 'some important matters that would benefit from your input and expertise'}.

The discussion would be valuable for moving forward effectively, and I believe your insights would be instrumental in achieving our goals. I am flexible with timing and can accommodate your schedule.

Please let me know your availability, and I will arrange the meeting accordingly. The discussion should take approximately 30-45 minutes and can be conducted in person or via video call, whichever is more convenient for you.`,

    follow_up: `I wanted to follow up on our previous conversation regarding ${form.additionalInfo || 'the matters we discussed'}. I have been working on the items we talked about and wanted to provide you with an update on the progress.

I have made good headway on the action items and believe we are moving in the right direction. I wanted to ensure we remain aligned on the next steps and address any questions you might have.

Please let me know if you need any additional information from me or if there's anything else I can do to support our objectives. I appreciate your continued collaboration on this matter.`,

    complaint: `I am writing to bring to your attention a concern regarding ${form.additionalInfo || 'a service issue that requires prompt attention'}. While I value our relationship, I believe this matter needs to be addressed to ensure we can continue working together effectively.

The situation has caused some inconvenience, and I would appreciate your assistance in resolving it promptly. I am confident that we can work together to find a satisfactory solution that addresses the issue comprehensively.

I look forward to your response and to resolving this matter quickly. Thank you for your attention to this concern, and I appreciate your commitment to customer satisfaction.`
  };

  const content = contentLibrary[form.purpose] || contentLibrary.thank_you;

  // Format complete email
  let email = `Subject: ${form.subject || form.purpose.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}\n\n`;
  email += `${template.greeting}\n\n`;
  email += `${content}\n\n`;
  email += template.closing;

  // Adjust length if needed (simple truncation for demo)
  const words = email.split(' ');
  if (words.length > form.maxLength) {
    const truncatedWords = words.slice(0, form.maxLength);
    const lastSentenceEnd = truncatedWords.join(' ').lastIndexOf('.');
    if (lastSentenceEnd > 0) {
      email = truncatedWords.join(' ').substring(0, lastSentenceEnd + 1);
      email += `\n\n${template.closing}`;
    }
  }

  return email;
};

export const getEmailPurposes = () => [
  { value: 'thank_you', label: 'Thank You' },
  { value: 'job_application', label: 'Job Application' },
  { value: 'meeting_request', label: 'Meeting Request' },
  { value: 'follow_up', label: 'Follow Up' },
  { value: 'complaint', label: 'Professional Complaint' }
];

export const getEmailTypes = () => [
  { value: 'casual', label: 'Casual (Friendly)' },
  { value: 'formal', label: 'Formal (Respectful)' },
  { value: 'business', label: 'Business (Professional)' }
];

export const getAIPreferences = () => [
  { value: 'auto', label: 'Auto (Recommended)' },
  { value: 'gemini', label: 'Google Gemini' },
  { value: 'huggingface', label: 'Hugging Face' }
];
