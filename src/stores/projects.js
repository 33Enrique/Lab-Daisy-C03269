import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { v4 as uuidv4 } from "uuid";

export const useProjectsStore = defineStore("projects", () => {
  const projects = ref([
    {
      id: uuidv4(),
      name: "Project 1",
      tasks: [],
    },
    {
      id: uuidv4(),
      name: "Project 2",
      tasks: [
        {
          id: uuidv4(),
          name: "Tarea de Numericos",
          completed: false
        },
      ],
    },
  ]);

  function addProject(name) {
    projects.value.push({
      id: uuidv4(),
      name,
      tasks: [],
    });
  }

  function selectProject(id) {
    selectedProjectId.value = id;
  }

  function deselectProject() {
    selectedProjectId.value = null;
  }
  const selectedProjectId = ref(null);

  const selectedProject = computed(() =>
    projects.value.find((p) => p.id === selectedProjectId.value)
  );

  function addTaskToProject(projectId, taskName) {
    const project = projects.value.find((p) => p.id === projectId);
    if (project) {
      project.tasks.push({
        id: uuidv4(),
        name: taskName,
        completed: false,
      });
    }
  }

  function toggleTaskCompletion(projectId, taskId) {
    const project = projects.value.find((p) => p.id === projectId);
    if (project) {
      const task = project.tasks.find((t) => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;
      }
    }
  }

  const progress = computed(() => {
  if (!selectedProject.value) return 0;
  const tasks = selectedProject.value.tasks || [];
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  return total === 0 ? 0 : Math.round((completed / total) * 100);
});

function editProjectName(projectId, newName) {
  const project = projects.value.find((p) => p.id === projectId);
  if (project) {
    project.name = newName;
    saveToLocalStorage();
  }
}

function editTaskName(projectId, taskId, newName) {
  const project = projects.value.find((p) => p.id === projectId);
  if (project) {
    const task = project.tasks.find((t) => t.id === taskId);
    if (task) {
      task.name = newName;
      saveToLocalStorage();
    }
  }
}

function deleteTask(projectId, taskId) {
  const project = projects.value.find((p) => p.id === projectId);
  if (project) {
    project.tasks = project.tasks.filter((t) => t.id !== taskId);
    saveToLocalStorage();
  }
}

function deleteProject(projectId) {
  projects.value = projects.value.filter((p) => p.id !== projectId);
  if (selectedProjectId.value === projectId) {
    selectedProjectId.value = null;
  }
  saveToLocalStorage();
}

function saveToLocalStorage() {
  localStorage.setItem('projects', JSON.stringify(projects.value));
}

function loadFromLocalStorage() {
  const data = localStorage.getItem('projects');
  if (data) {
    projects.value = JSON.parse(data);
  }
}

// Cargar al iniciar
loadFromLocalStorage();

return {
  projects,
  selectedProjectId,
  progress,
  selectedProject,
  selectProject,
  deselectProject,
  addProject,
  addTaskToProject,
  toggleTaskCompletion,
  editProjectName,
  editTaskName,
  deleteTask,
  deleteProject,
  saveToLocalStorage,
  loadFromLocalStorage,
};
});