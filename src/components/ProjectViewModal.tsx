// src/components/ProjectViewModal.tsx
import React, { useState, useEffect } from 'react'; // Import React, useState, and useEffect
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
// import { Checkbox } from '@/components/ui/checkbox'; // Assuming you have a Checkbox component
import { Clock, CheckCircle, XCircle, MinusCircle, AlertCircle } from 'lucide-react'; // Icons for status
import { useProject } from '@/contexts/ProjectContext';
import { format } from 'date-fns';
import { cn } from '@/lib/utils'; // Assuming you have a cn utility

// --- Define Types ---
// Replace 'any' with your actual types from your data model
interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done' | 'cancelled'; // Add 'cancelled'
  completed?: boolean; // Depending on your data structure, you might use status or completed
  // ... other task properties
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: string; // Or specific type like 'todo' | 'in-progress' | ...
  priority?: 'low' | 'medium' | 'high';
  colorLabel?: string;
  endDate?: string; // Or Date
  startDate?: string; // Or Date
  tags?: string[];
  category?: string;
  progress?: number; // If stored, otherwise calculated
  // ... other project properties
}
// --- End Define Types ---

interface ProjectViewModalProps {
  project: Project | null; // Accept null
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectViewModal = ({ project, isOpen, onClose }: ProjectViewModalProps) => {
  const { getProjectTasks, beginTask, completeTask, cancelTask /* , refetchProjects or refreshData */ } = useProject();
  const [projectTasks, setProjectTasks] = useState<ProjectTask[]>([]);
  const [isUpdating, setIsUpdating] = useState(false); // Optional: for loading state on actions

  // Fetch tasks when modal opens or project changes
  useEffect(() => {
    if (isOpen && project?.id) {
      // Simple approach: get tasks directly from context
      // This assumes getProjectTasks returns the current state from context
      const tasks = getProjectTasks(project.id);
      // Optionally sort tasks (e.g., active first, then completed, then cancelled)
      const sortedTasks = [...tasks].sort((a, b) => {
        const statusOrder: Record<string, number> = { 'todo': 1, 'in-progress': 2, 'done': 3, 'cancelled': 4 };
        return (statusOrder[a.status] || 5) - (statusOrder[b.status] || 5);
      });
      setProjectTasks(sortedTasks);
    } else {
      setProjectTasks([]); // Clear tasks when modal closes or project changes
    }
  }, [isOpen, project?.id, getProjectTasks]); // Depend on isOpen, project ID, and getProjectTasks

  // --- Function to refresh data ---
  // This function encapsulates the logic to update the local state
  // based on the context's current data.
  const refreshLocalData = () => {
    if (isOpen && project?.id) {
      const tasks = getProjectTasks(project.id);
      const sortedTasks = [...tasks].sort((a, b) => {
        const statusOrder = { 'todo': 1, 'in-progress': 2, 'done': 3, 'cancelled': 4 };
        // @ts-ignore - statusOrder implicit any
        return (statusOrder[a.status] || 5) - (statusOrder[b.status] || 5);
      });
      setProjectTasks(sortedTasks);
    }
  };
  // --- End Function to refresh data ---

  const handleTaskStatusChange = async (taskId: string, newStatus: 'todo' | 'in-progress' | 'done' | 'cancelled') => {
    setIsUpdating(true); // Set loading state
    try {
      switch (newStatus) {
        case 'todo':
          // Assuming beginTask sets status to 'todo' or similar
          await beginTask(taskId);
          break;
        case 'in-progress':
          // You might need an explicit startTask function
          // For now, assume beginTask or add logic
          console.warn('Starting task logic not implemented or assumed beginTask handles it.');
          // Example placeholder if you had a specific function:
          // if (startTask) await startTask(taskId);
          // Fallback or placeholder action:
          // await updateTaskStatusInContextOrAPI(taskId, 'in-progress');
          break;
        case 'done':
          await completeTask(taskId);
          break;
        case 'cancelled':
          if (cancelTask) {
            await cancelTask(taskId);
          } else {
            console.error('cancelTask function is not available in the context.');
            // Handle error or provide user feedback
            alert("Cancel task functionality is not implemented yet.");
            setIsUpdating(false);
            return; // Stop execution if cancelTask is not available
          }
          break;
        default:
          console.warn('Unknown task status:', newStatus);
      }
      // --- Optional: Refresh data after status change ---
      // If your context automatically updates its state (e.g., via React Query mutations
      // that invalidate/refresh the project/tasks query), you might not need this.
      // However, if it relies on the component to trigger a refetch or if the local
      // state in this component needs to be updated immediately, call refreshLocalData.
      // If context has a refetch function:
      // await refetchProjects?.();
      // Then update local state:
      refreshLocalData();
      // -----------------------------

    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Failed to update task status. Please try again."); // Basic user feedback
    } finally {
      setIsUpdating(false); // Reset loading state
    }
  };

  // Calculate progress based on completed tasks out of non-cancelled tasks
  const calculateProgress = () => {
    if (!projectTasks.length) return 0;
    const nonCancelledTasks = projectTasks.filter(task => task.status !== 'cancelled');
    if (nonCancelledTasks.length === 0) return 0; // Avoid division by zero if all are cancelled
    const completedTasks = nonCancelledTasks.filter(task => task.completed || task.status === 'done').length;
    return Math.round((completedTasks / nonCancelledTasks.length) * 100);
  };

  const progress = calculateProgress();

  // --- Enhanced onClose handler ---
  const handleOnClose = () => {
    // --- Optional: Add logic here to refresh project/task data if needed after status changes ---
    // This is useful if changes made in this modal view might affect data displayed
    // elsewhere in the app (e.g., the Kanban board) after the modal is closed.
    // If your context manages data globally and updates correctly on mutations,
    // this might not be strictly necessary every time, but it's a good practice
    // to ensure consistency, especially if the user navigates immediately after closing.
    // Example: Trigger a refetch in the context
    // refetchProjects?.();
    // Or, if context doesn't auto-update and parent needs to know:
    // onProjectViewClosedOrDataChanged?.();
    // ---------------------------------
    onClose(); // Call the original onClose prop
  };
  // --- End Enhanced onClose handler ---

  // Early return if not open or no project
  if (!isOpen || !project) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOnClose}> {/* Use handleOnClose */}
      <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2 text-xl md:text-2xl"> {/* Responsive title */}
            {/* Color label circle */}
            {project.colorLabel && (
              <span
                className="inline-block w-5 h-5 rounded-full border border-border flex-shrink-0"
                style={{ backgroundColor: project.colorLabel }}
                title="Project color"
              />
            )}
            <span className="truncate">{project.name}</span>
            {/* Priority badge */}
            {project.priority && (
              <Badge
                variant={project.priority === 'high' ? 'destructive' : project.priority === 'medium' ? 'default' : 'secondary'}
                className="flex-shrink-0"
              >
                {project.priority?.charAt(0).toUpperCase() + project.priority?.slice(1)}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{project.description || 'No description provided.'}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Category</Label>
              <p className="font-medium">{project.category || 'N/A'}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Start Date</Label>
              <p className="font-medium">
                {project.startDate ? format(new Date(project.startDate), 'PPP') : 'N/A'}
              </p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Due Date</Label>
              <p className="font-medium">
                {project.endDate ? format(new Date(project.endDate), 'PPP') : 'N/A'}
              </p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Status</Label>
              <p className="font-medium capitalize">{project.status?.replace('-', ' ') || 'N/A'}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Progress</h3>
              <span className="font-medium text-lg">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {projectTasks.filter(t => t.status !== 'cancelled').length > 0
                ? `${projectTasks.filter(t => t.completed || t.status === 'done').length} of ${projectTasks.filter(t => t.status !== 'cancelled').length} tasks completed`
                : 'No active tasks'}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-1">
              {(project.tags && project.tags.length > 0) ? (
                project.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No tags</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Tasks</h3>
              <Badge variant="secondary">{projectTasks.length} Total</Badge>
            </div>
            <div className="space-y-3">
              {projectTasks.length > 0 ? (
                projectTasks.map((task) => {
                  // Determine status icon and text
                  let statusIcon, statusText, statusColorClass;
                  switch (task.status) {
                    case 'done':
                      statusIcon = <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />;
                      statusText = 'Completed';
                      statusColorClass = 'text-green-500';
                      break;
                    case 'cancelled':
                      statusIcon = <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />;
                      statusText = 'Cancelled';
                      statusColorClass = 'text-red-500';
                      break;
                    case 'in-progress':
                      statusIcon = <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />;
                      statusText = 'In Progress';
                      statusColorClass = 'text-blue-500';
                      break;
                    case 'todo':
                    default:
                      statusIcon = <MinusCircle className="h-4 w-4 text-gray-500 flex-shrink-0" />;
                      statusText = 'To Do';
                      statusColorClass = 'text-gray-500';
                  }

                  return (
                    <Card
                      key={task.id}
                      className={cn(
                        "transition-opacity",
                        task.status === 'cancelled' ? 'opacity-70 border-dashed' : '',
                        isUpdating ? 'opacity-90 pointer-events-none' : '' // Visual feedback during update
                      )}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <CardTitle className="text-base font-medium break-words">{task.title}</CardTitle>
                          <div className="flex items-center gap-1 text-xs whitespace-nowrap">
                            {statusIcon}
                            <span className={statusColorClass}>{statusText}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {task.description && <p className="text-sm text-muted-foreground mb-3 break-words">{task.description}</p>}
                        {/* Task Actions - Only if not cancelled */}
                        {task.status !== 'cancelled' && task.status !== 'done' && (
                          <div className="flex flex-wrap gap-2">
                            {task.status !== 'todo' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleTaskStatusChange(task.id, 'todo')}
                                disabled={isUpdating}
                                className="text-xs"
                              >
                                {isUpdating ? '...' : 'To Do'}
                              </Button>
                            )}
                            {task.status !== 'in-progress' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleTaskStatusChange(task.id, 'in-progress')}
                                disabled={isUpdating}
                                className="text-xs"
                              >
                                {isUpdating ? '...' : 'Start'}
                              </Button>
                            )}
                            <Button
                              size="sm"
                              onClick={() => handleTaskStatusChange(task.id, 'done')}
                              disabled={isUpdating}
                              className="text-xs"
                            >
                              {isUpdating ? '...' : 'Complete'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline" // Use outline for less destructive action feel initially
                              onClick={() => {
                                if (window.confirm('Are you sure you want to cancel this task?')) {
                                   handleTaskStatusChange(task.id, 'cancelled');
                                }
                              }}
                              disabled={isUpdating}
                              className="text-xs"
                            >
                              {isUpdating ? '...' : 'Cancel'}
                            </Button>
                          </div>
                        )}
                        {task.status === 'done' && (
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleTaskStatusChange(task.id, 'in-progress')}
                              disabled={isUpdating}
                              className="text-xs"
                            >
                              {isUpdating ? '...' : 'Reopen'}
                            </Button>
                             <Button
                              size="sm"
                              variant="outline" // Use outline for less destructive action feel initially
                              onClick={() => {
                                if (window.confirm('Are you sure you want to cancel this completed task?')) {
                                   handleTaskStatusChange(task.id, 'cancelled');
                                }
                              }}
                              disabled={isUpdating}
                              className="text-xs"
                            >
                              {isUpdating ? '...' : 'Cancel'}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <AlertCircle className="mx-auto h-8 w-8 opacity-70 mb-2" />
                  <p>No tasks found for this project.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
