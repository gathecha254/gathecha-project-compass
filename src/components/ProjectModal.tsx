// src/components/ProjectModal.tsx
import { useState, useEffect } from 'react';
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

// --- Define Types ---
// Replace 'any' with your actual types from your data model if available
interface ProjectTask {
  id?: string; // Might not exist for new tasks
  title: string;
  description?: string;
  isReviewTask?: boolean;
  // ... other potential task properties
}

interface Project {
  id?: string; // Might not exist for new projects
  name: string;
  description: string;
  category: 'tech' | 'academic' | 'research' | 'business' | 'personal';
  status?: string; // For existing projects
  progress?: number; // For existing projects
  startDate?: string; // For existing projects
  endDate?: string; // Expected format from date picker
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  colorLabel: string;
  tasks?: ProjectTask[]; // For existing projects
  // ... other potential project properties
}
// --- End Define Types ---

interface ProjectModalProps {
  isOpen: boolean; // Changed from 'open' and made required for controlled component
  onClose: () => void;
  project?: Project; // Use defined type or 'any'
}

export const ProjectModal = ({ isOpen, onClose, project }: ProjectModalProps) => {
  const { addProject, updateProject } = useProject();
  const [title, setTitle] = useState('');
  const [isDueDatePopoverOpen, setIsDueDatePopoverOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'tech' | 'academic' | 'research' | 'business' | 'personal'>('tech');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

  // Add state for new fields
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  // --- Set a default colorLabel ---
  // This addresses the optional update mentioned previously for better UX
  const [colorLabel, setColorLabel] = useState<string>('#3b82f6'); // Default blue color
  // --- End Set a default colorLabel ---
  const [tasks, setTasks] = useState<Array<{ title: string; description?: string }>>([{ title: '' }]);

  // Populate form with project data when in edit mode or reset when modal closes/opens for new
  useEffect(() => {
    if (isOpen && project) {
      // Populate form if modal opens for editing
      setTitle(project.name || '');
      setDescription(project.description || '');
      setCategory(project.category || 'tech');
      setDueDate(project.endDate ? new Date(project.endDate) : undefined);
      setTags(project.tags || []);
      setPriority(project.priority || 'medium');
      // --- Use the project's color or fallback to default ---
      setColorLabel(project.colorLabel || '#3b82f6');
      // --- End Use the project's color ---
      if (Array.isArray(project.tasks)) {
        // Filter out tasks without a title or the review task when populating for edit
        const filteredTasks = project.tasks.filter(
          (task) => task.title && !task.isReviewTask
        );
        setTasks(filteredTasks.length > 0 ? filteredTasks : [{ title: '' }]);
      } else {
        setTasks([{ title: '' }]);
      }
    } else if (isOpen && !project) {
       // Reset form for new project if modal opens in create mode
      setTitle('');
      setDescription('');
      setCategory('tech');
      setDueDate(undefined);
      setTags([]);
      setPriority('medium');
      setColorLabel('#3b82f6'); // Reset to default color for new project
      setTasks([{ title: '' }]);
    }
    // Optional: Reset form when modal closes, might be useful depending on UX needs
    // else if (!isOpen) {
    //   setTitle('');
    //   // ... reset other fields
    // }
  }, [isOpen, project]); // Depend on isOpen and project

  const availableTags = [
    'React', 'TypeScript', 'Python', 'Machine Learning',
    'Web Development', 'Analytics', 'Research', 'Business',
    'AI Ethics', 'Academic', 'Process', 'Optimization'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation (Consider user feedback like alerts or inline errors in a real app)
    if (!title.trim()) {
      alert("Project title is required.");
      return;
    }
    if (!dueDate) {
      alert("Due date is required.");
      return;
    }

    // Validate at least one user-defined task with a title
    const userTasks = tasks.filter(t => t.title.trim());
    if (userTasks.length === 0) {
      alert("At least one task is required.");
      return;
    }

    // Append non-removable Review & Comments task
    const allTasks = [
      ...userTasks,
      {
        title: 'Review & Comments',
        description: 'Final review and collect feedback on the project',
        isReviewTask: true,
      },
    ];

    const projectData = {
      name: title.trim(),
      description: description.trim(),
      category,
      endDate: dueDate ? dueDate.toISOString().split('T')[0] : null,
      tags,
      priority,
      colorLabel,
      tasks: allTasks,
    };

    if (project && project.id) { // Ensure project ID exists for update
      // Update existing project
      // Keep existing status, progress, and startDate
      updateProject(project.id, {
        ...projectData,
        status: project.status,
        progress: project.progress,
        startDate: project.startDate,
      });
    } else {
      // Create new project
      addProject({
        ...projectData,
        status: 'todo',
        progress: 0,
        startDate: new Date().toISOString().split('T')[0],
      });
    }
    onClose(); // Close the modal after submission
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
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

  const addTask = () => {
    setTasks([...tasks, { title: '' }]);
  };

  const removeTask = (index: number) => {
    if (tasks.length <= 1) return; // Prevent removing the last task if it's the only one
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const updateTaskTitle = (index: number, newTitle: string) => {
    const newTasks = [...tasks];
    newTasks[index].title = newTitle;
    setTasks(newTasks);
  };

  // --- Optional: Early return if not open for performance ---
  // This ensures the component doesn't do unnecessary work when closed.
  if (!isOpen) {
    return null;
  }
  // --- End Optional: Early return ---

  return (
    // --- Use isOpen prop to control visibility ---
    <Dialog open={isOpen} onOpenChange={onClose}>
    {/* --- End Use isOpen prop --- */}
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {project ? (
            <DialogTitle>Edit Project</DialogTitle>
          ) : (
            <DialogTitle>Create New Project</DialogTitle>
          )}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
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
              <Label>Due Date *</Label>
              <Popover open={isDueDatePopoverOpen} onOpenChange={setIsDueDatePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => {
                      setDueDate(date);
                      setIsDueDatePopoverOpen(false); // Close the popover on date selection
                    }}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="colorLabel">Color Label</Label>
              <div className="flex items-center gap-2">
                <input
                  id="colorLabel"
                  type="color"
                  value={colorLabel}
                  onChange={e => setColorLabel(e.target.value)}
                  className="w-12 h-8 p-0 border rounded cursor-pointer"
                  aria-label="Pick project color"
                />
                <span className="text-sm text-muted-foreground">{colorLabel}</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Initial Task(s) *</Label>
            <div className="space-y-2">
              {tasks.map((task, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    value={task.title}
                    onChange={e => updateTaskTitle(idx, e.target.value)}
                    placeholder={`Task ${idx + 1} title...`}
                    required={idx === 0} // Require the first task
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTask(idx)}
                    disabled={tasks.length === 1} // Disable remove button if only one task
                    aria-label={`Remove task ${idx + 1}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addTask}
                className="mt-1"
              >
                Add Task
              </Button>
              <p className="text-xs text-muted-foreground">At least one task is required. &quot;Review &amp; Comments&quot; will be added automatically.</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-sm py-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1.5 hover:text-destructive focus:outline-none focus:ring-1 focus:ring-ring rounded-full"
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleKeyPress} // Use onKeyDown for better compatibility
                  placeholder="Add a tag..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addTag(currentTag)}
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
                      className="text-xs cursor-pointer hover:bg-accent"
                      onClick={() => addTag(tag)}
                      aria-label={`Add tag ${tag}`}
                    >
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              {project ? 'Save Changes' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
