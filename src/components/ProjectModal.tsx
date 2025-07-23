
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useProject } from '@/contexts/ProjectContext';

interface ProjectModalProps {
  onClose: () => void;
}

  export const ProjectModal = ({ onClose }: ProjectModalProps) => {
  const { addProject } = useProject();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'tech' | 'academic' | 'research' | 'business' | 'personal'>('tech');
  const [dueDate, setDueDate] = useState<Date>();
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  // Add state for new fields
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [colorLabel, setColorLabel] = useState<string>('#3b82f6'); // default blue
  const [tasks, setTasks] = useState<Array<{ title: string; description?: string }>>([{ title: '' }]);

  const availableTags = [
    'React', 'TypeScript', 'Python', 'Machine Learning', 
    'Web Development', 'Analytics', 'Research', 'Business',
    'AI Ethics', 'Academic', 'Process', 'Optimization'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (!dueDate) return;
    // Validate at least one user-defined task with a title
    const userTasks = tasks.filter(t => t.title.trim());
    if (userTasks.length === 0) return;

    // Append non-removable Review & Comments task
    const allTasks = [
      ...userTasks,
      {
        title: 'Review & Comments',
        description: 'Final review and collect feedback on the project',
        isReviewTask: true,
      },
    ];

    addProject({
      name: title.trim(),
      description: description.trim(),
      category,
      status: 'todo',
      progress: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: dueDate?.toISOString().split('T')[0],
      tags,
      priority,
      colorLabel,
      tasks: allTasks,
    });
    onClose();
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setCurrentTag('');
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      addTag(currentTag.trim());
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the project goals and objectives..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Color Label</Label>
            <input
              type="color"
              value={colorLabel}
              onChange={e => setColorLabel(e.target.value)}
              className="w-12 h-8 p-0 border-none bg-transparent cursor-pointer"
              aria-label="Pick project color"
            />
          </div>

          <div className="space-y-2">
            <Label>Initial Task(s)</Label>
            <div className="space-y-2">
              {tasks.map((task, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    value={task.title}
                    onChange={e => {
                      const newTasks = [...tasks];
                      newTasks[idx].title = e.target.value;
                      setTasks(newTasks);
                    }}
                    placeholder={`Task ${idx + 1} title...`}
                    required={idx === 0}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setTasks(tasks.filter((_, i) => i !== idx))}
                    disabled={tasks.length === 1}
                    aria-label="Remove task"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => setTasks([...tasks, { title: '' }])}
                className="mt-1"
              >
                Add Task
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">At least one task is required. "Review & Comments" will be added automatically.</p>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-sm">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addTag(currentTag.trim())}
                  disabled={!currentTag.trim() || tags.includes(currentTag.trim())}
                >
                  Add
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {availableTags
                  .filter(tag => !tags.includes(tag) && tag.toLowerCase().includes(currentTag.toLowerCase()))
                  .slice(0, 6)
                  .map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onClick={() => addTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-700">
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

