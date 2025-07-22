import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '@/contexts/ProjectContext';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, tasks, beginTask, completeTask, deleteProject } = useProject();
  const project = projects.find(p => p.id === id);
  const projectTasks = tasks.filter(t => t.projectId === id);

  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [tags, setTags] = useState(project?.tags || []);
  const [priority, setPriority] = useState(project?.priority || 'medium');
  const [colorLabel, setColorLabel] = useState(project?.colorLabel || '#3b82f6');
  const [dueDate, setDueDate] = useState(project?.endDate || '');

  useEffect(() => {
    if (project) {
      setTitle(project.name);
      setDescription(project.description || '');
      setTags(project.tags || []);
      setPriority(project.priority || 'medium');
      setColorLabel(project.colorLabel || '#3b82f6');
      setDueDate(project.endDate || '');
    }
  }, [project]);

  if (!project) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <div className="flex items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          {editMode ? (
            <Input value={title} onChange={e => setTitle(e.target.value)} className="text-2xl font-bold" />
          ) : (
            <h2 className="text-2xl font-bold">{title}</h2>
          )}
          <span className="inline-block w-4 h-4 rounded-full border border-border" style={{ backgroundColor: colorLabel }} />
          <Badge variant={priority === 'high' ? 'destructive' : priority === 'medium' ? 'default' : 'secondary'}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-destructive" onClick={async (e) => {
              e.preventDefault();
              if (window.confirm('Are you sure you want to delete this project? This will delete all related tasks.')) {
                await deleteProject(project.id);
                navigate('/dashboard');
              }
            }}>Delete Project</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
        {editMode ? (
          <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} />
        ) : (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Due:</span>
        {editMode ? (
          <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-40" />
        ) : (
          <span>{dueDate}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-1">
        {(tags || []).map((tag: string) => (
          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
        ))}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-2" />
        <div className="flex items-center gap-2 text-xs">
          <span>Status:</span>
          <Badge>{project.status.replace('-', ' ')}</Badge>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Tasks</h3>
        <div className="space-y-2">
          {projectTasks.map((task: any) => (
            <div key={task.id} className="flex items-center gap-2 p-2 border rounded">
              <span className="flex-1">{task.title}</span>
              <Badge variant={task.isReviewTask ? 'secondary' : 'outline'}>{task.isReviewTask ? 'Review' : task.status.replace('-', ' ')}</Badge>
              <Button size="xs" variant="outline" onClick={() => beginTask(task.id)} disabled={task.status === 'in-progress' || task.completed}>Begin</Button>
              <Button size="xs" variant="outline" onClick={() => completeTask(task.id)} disabled={task.completed}>Complete</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage; 