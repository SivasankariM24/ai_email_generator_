
import React, { useState } from 'react';
import EmailGenerator from '../components/EmailGenerator';
import ServiceStatus from '../components/ServiceStatus';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🤖 AI Email Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate professional emails using advanced AI models. Create personalized, 
            context-aware emails for any business or personal need.
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="generator" className="max-w-7xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="generator" className="text-lg py-3">
              📝 Email Generator
            </TabsTrigger>
            <TabsTrigger value="status" className="text-lg py-3">
              🔧 Service Status
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator">
            <EmailGenerator />
          </TabsContent>

          <TabsContent value="status">
            <ServiceStatus />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
