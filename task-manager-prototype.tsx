import React, { useState } from 'react';
import { Calendar, Clock, Plus, CheckCircle, Circle, Edit3, Trash2 } from 'lucide-react';

const TaskManager = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Website Redesign",
      priority: "urgent",
      dueDate: "2025-06-15",
      category: "professional",
      tasks: [
        { id: 1, name: "Research competitor sites", completed: true, estimatedHours: 2 },
        { id: 2, name: "Create wireframes", completed: false, estimatedHours: 4 },
        { id: 3, name: "Design mockups", completed: false, estimatedHours: 6 }
      ]
    },
    {
      id: 2,
      name: "Kitchen Cabinet Repair",
      priority: "usual",
      dueDate: "2025-06-30",
      category: "home",
      tasks: [
        { id: 4, name: "Buy wood stain", completed: false, estimatedHours: 1 },
        { id: 5, name: "Sand cabinet doors", completed: false, estimatedHours: 3 },
        { id: 6, name: "Apply stain", completed: false, estimatedHours: 2 }
      ]
    },
    {
      id: 3,
      name: "Plan Friend Hangout",
      priority: "if you have time",
      dueDate: "2025-06-20",
      category: "social",
      tasks: [
        { id: 7, name: "Text group chat", completed: false, estimatedHours: 0.5 },
        { id: 8, name: "Research activities", completed: false, estimatedHours: 1 },
        { id: 9, name: "Make reservations", completed: false, estimatedHours: 0.5 }
      ]
    }
  ]);

  const [workSchedule, setWorkSchedule] = useState({
    monday: { start: '09:00', end: '17:00', enabled: true },
    tuesday: { start: '09:00', end: '17:00', enabled: true },
    wednesday: { start: '09:00', end: '16:00', enabled: true },
    thursday: { start: '09:00', end: '17:00', enabled: true },
    friday: { start: '09:00', end: '15:00', enabled: true },
    saturday: { start: '10:00', end: '14:00', enabled: false },
    sunday: { start: '10:00', end: '14:00', enabled: false }
  });

  const [showNewProject, setShowNewProject] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    priority: 'usual',
    dueDate: '',
    category: 'professional',
    tasks: []
  });

  const priorityColors = {
    'immediate': 'bg-red-100 text-red-800 border-red-200',
    'urgent': 'bg-orange-100 text-orange-800 border-orange-200',
    'usual': 'bg-blue-100 text-blue-800 border-blue-200',
    'if you have time': 'bg-green-100 text-green-800 border-green-200',
    'do whenever': 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const categoryColors = {
    'professional': 'bg-purple-50 border-l-purple-400',
    'personal': 'bg-blue-50 border-l-blue-400',
    'home': 'bg-green-50 border-l-green-400',
    'social': 'bg-pink-50 border-l-pink-400'
  };

  // Mock schedule generation
  const generateSchedule = () => {
    const schedule = [];
    const today = new Date();
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      
      if (workSchedule[dayName]?.enabled) {
        const startHour = parseInt(workSchedule[dayName].start.split(':')[0]);
        const endHour = parseInt(workSchedule[dayName].end.split(':')[0]);
        const workHours = endHour - startHour;
        const slots = Math.floor(workHours / 2);
        
        const daySchedule = {
          date: date.toLocaleDateString(),
          dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1),
          slots: []
        };
        
        // Priority-based task assignment (mock)
        const urgentTasks = projects.filter(p => p.priority === 'urgent' || p.priority === 'immediate').flatMap(p => p.tasks.filter(t => !t.completed));
        const normalTasks = projects.filter(p => p.priority === 'usual').flatMap(p => p.tasks.filter(t => !t.completed));
        const flexTasks = projects.filter(p => p.priority === 'if you have time' || p.priority === 'do whenever').flatMap(p => p.tasks.filter(t => !t.completed));
        
        for (let slot = 0; slot < slots; slot++) {
          const slotStart = startHour + (slot * 2);
          const slotEnd = slotStart + 2;
          
          let task = null;
          if (urgentTasks.length > 0) {
            task = urgentTasks.shift();
          } else if (normalTasks.length > 0) {
            task = normalTasks.shift();
          } else if (flexTasks.length > 0) {
            task = flexTasks.shift();
          }
          
          daySchedule.slots.push({
            time: `${slotStart}:00 - ${slotEnd}:00`,
            task: task ? task.name : 'Open slot',
            project: task ? projects.find(p => p.tasks.some(t => t.id === task.id))?.name : null,
            priority: task ? projects.find(p => p.tasks.some(t => t.id === task.id))?.priority : null
          });
        }
        
        schedule.push(daySchedule);
      }
    }
    
    return schedule;
  };

  const mockSchedule = generateSchedule();

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Flow Manager</h1>
        <p className="text-gray-600">ADHD-friendly project organization and calendar integration</p>
      </header>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-sm">
        {[
          { id: 'tasks', label: 'Projects & Tasks', icon: CheckCircle },
          { id: 'schedule', label: 'Generated Schedule', icon: Calendar },
          { id: 'settings', label: 'Work Hours', icon: Clock }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Projects & Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Your Projects</h2>
            <button
              onClick={() => setShowNewProject(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              <span>Add Project</span>
            </button>
          </div>

          {/* New Project Form */}
          {showNewProject && (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-4">Add New Project</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Project name"
                  className="border rounded-lg px-3 py-2"
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                />
                <select
                  className="border rounded-lg px-3 py-2"
                  value={newProject.priority}
                  onChange={(e) => setNewProject({...newProject, priority: e.target.value})}
                >
                  <option value="immediate">Immediate</option>
                  <option value="urgent">Urgent</option>
                  <option value="usual">Usual</option>
                  <option value="if you have time">If You Have Time</option>
                  <option value="do whenever">Do Whenever</option>
                </select>
                <input
                  type="date"
                  className="border rounded-lg px-3 py-2"
                  value={newProject.dueDate}
                  onChange={(e) => setNewProject({...newProject, dueDate: e.target.value})}
                />
                <select
                  className="border rounded-lg px-3 py-2"
                  value={newProject.category}
                  onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                >
                  <option value="professional">Professional</option>
                  <option value="personal">Personal Interest</option>
                  <option value="home">Home</option>
                  <option value="social">Social</option>
                </select>
              </div>
              <div className="flex space-x-3 mt-4">
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  onClick={() => setShowNewProject(false)}
                >
                  Add Project
                </button>
                <button 
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  onClick={() => setShowNewProject(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Project Cards */}
          <div className="grid gap-6">
            {projects.map(project => (
              <div key={project.id} className={`bg-white rounded-lg shadow-sm border-l-4 p-6 ${categoryColors[project.category]}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">Due: {new Date(project.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${priorityColors[project.priority]}`}>
                      {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize">
                      {project.category}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {project.tasks.map(task => (
                    <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      {task.completed ? (
                        <CheckCircle className="text-green-600" size={20} />
                      ) : (
                        <Circle className="text-gray-400" size={20} />
                      )}
                      <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.name}
                      </span>
                      <span className="text-sm text-gray-500">{task.estimatedHours}h</span>
                    </div>
                  ))}
                </div>
                
                <button className="mt-4 flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  <Plus size={16} />
                  <span>Add Task</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Your Generated Schedule</h2>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Sync to Google Calendar
            </button>
          </div>
          
          <div className="grid gap-4">
            {mockSchedule.map((day, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {day.dayName} - {day.date}
                </h3>
                <div className="space-y-3">
                  {day.slots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium text-gray-700 w-24">{slot.time}</span>
                        <div>
                          <span className="text-gray-900">{slot.task}</span>
                          {slot.project && (
                            <span className="text-sm text-gray-600 ml-2">({slot.project})</span>
                          )}
                        </div>
                      </div>
                      {slot.priority && (
                        <span className={`px-2 py-1 rounded-full text-xs ${priorityColors[slot.priority]}`}>
                          {slot.priority}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Work Hours Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Work Schedule Settings</h2>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Set Your Available Work Hours</h3>
            <div className="space-y-4">
              {Object.entries(workSchedule).map(([day, schedule]) => (
                <div key={day} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 w-32">
                    <input
                      type="checkbox"
                      checked={schedule.enabled}
                      onChange={(e) => setWorkSchedule({
                        ...workSchedule,
                        [day]: { ...schedule, enabled: e.target.checked }
                      })}
                      className="rounded"
                    />
                    <span className="font-medium capitalize">{day}</span>
                  </div>
                  
                  {schedule.enabled && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={schedule.start}
                        onChange={(e) => setWorkSchedule({
                          ...workSchedule,
                          [day]: { ...schedule, start: e.target.value }
                        })}
                        className="border rounded px-2 py-1"
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={schedule.end}
                        onChange={(e) => setWorkSchedule({
                          ...workSchedule,
                          [day]: { ...schedule, end: e.target.value }
                        })}
                        className="border rounded px-2 py-1"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Save Schedule Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;