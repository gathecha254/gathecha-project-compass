
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Send, 
  Lightbulb, 
  AlertTriangle, 
  Calendar,
  TrendingUp,
  Clock
} from 'lucide-react';

interface AIAssistantProps {
  onClose: () => void;
}

export const AIAssistant = ({ onClose }: AIAssistantProps) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hi Edwin! I'm your AI project assistant. I can help you with task breakdowns, schedule optimization, bottleneck detection, and progress insights. What would you like to work on today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');

  const quickActions = [
    { icon: Lightbulb, label: 'Suggest optimizations', action: 'optimize' },
    { icon: AlertTriangle, label: 'Find bottlenecks', action: 'bottlenecks' },
    { icon: Calendar, label: 'Schedule tasks', action: 'schedule' },
    { icon: TrendingUp, label: 'Progress analysis', action: 'progress' },
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateAIResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setInput('');
  };

  const generateAIResponse = (query: string) => {
    const responses = {
      optimize: "Based on your current workload, I suggest:\n\n• Moving the 'Data Analysis' task to after authentication system completion\n• Breaking down the AI Ethics paper into 3 smaller tasks\n• Scheduling review sessions on Fridays\n• Setting up automated testing for the tech project",
      
      bottlenecks: "I've identified these potential bottlenecks:\n\n⚠️ **High Priority Issues:**\n• Authentication system has no backup developer\n• Research paper deadline conflicts with data analysis\n• Missing dependencies for customer segmentation\n\n💡 **Recommendations:**\n• Add buffer time to authentication tasks\n• Consider extending research paper deadline\n• Prepare fallback plans for data availability",
      
      schedule: "Here's your optimized schedule for next week:\n\n**Monday-Tuesday:** Focus on authentication system (65% → 85%)\n**Wednesday:** Research paper final review\n**Thursday:** Begin customer segmentation prep\n**Friday:** Weekly review and planning\n\n🎯 This schedule balances high-priority items while maintaining steady progress.",
      
      progress: "**Progress Analysis:**\n\n📈 **Strong Performance:**\n• Business Process Analysis: Completed on time\n• Research Paper: 90% complete, ahead of schedule\n\n⚡ **Attention Needed:**\n• Authentication System: Slightly behind (65% vs expected 75%)\n• Data Analysis: Not started, consider early preparation\n\n**Overall Score: 8.2/10**"
    };

    // Simple keyword matching for demo
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('optim')) return responses.optimize;
    if (lowerQuery.includes('bottleneck') || lowerQuery.includes('problem')) return responses.bottlenecks;
    if (lowerQuery.includes('schedul') || lowerQuery.includes('plan')) return responses.schedule;
    if (lowerQuery.includes('progress') || lowerQuery.includes('status')) return responses.progress;
    
    return "I understand you're asking about: " + query + "\n\nLet me analyze your current projects and provide specific recommendations. Based on your project portfolio (Tech, Data Science, Research, Business Analysis), I can help with task prioritization, deadline management, and workflow optimization.\n\nTry asking about specific areas like 'schedule optimization' or 'bottleneck analysis' for detailed insights!";
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
    handleSend();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Bot className="h-5 w-5 mr-2 text-blue-600" />
            AI Project Assistant
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col space-y-4">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.action}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.action)}
                className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <action.icon className="h-4 w-4 mr-2" />
                {action.label}
              </Button>
            ))}
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 border rounded-lg p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                      max-w-[70%] p-3 rounded-lg whitespace-pre-wrap
                      ${message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-muted text-foreground border'
                      }
                    `}
                  >
                    {message.type === 'ai' && (
                      <div className="flex items-center mb-2">
                        <Bot className="h-4 w-4 mr-2 text-blue-600" />
                        <Badge variant="secondary" className="text-xs">AI Assistant</Badge>
                      </div>
                    )}
                    <div className="text-sm">{message.content}</div>
                    <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-muted-foreground'}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about task optimization, bottlenecks, scheduling..."
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1"
            />
            <Button onClick={handleSend} className="bg-gradient-to-r from-blue-600 to-blue-700">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
