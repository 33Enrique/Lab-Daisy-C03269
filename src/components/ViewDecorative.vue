<template>
  <div class="p-6">
    <div class="overflow-x-auto">
      <template v-if="projectsStore.selectedProject">
        <h2 class="text-xl font-bold mb-4">
          <span v-if="!editingProjectName" @dblclick="startEditProjectName">{{ projectsStore.selectedProject.name }}</span>
          <input v-else v-model="editProjectNameValue" @keyup.enter="saveEditProjectName" @blur="cancelEditProjectName" class="input input-sm w-48" />
        </h2>

        <table class="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Tarea</th>
              <th>Completado</th>
              <th>Fecha de completado</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(task, index) in projectsStore.selectedProject.tasks"
              :key="task.id"
            >
              <td>{{ index + 1 }}</td>
              <td>
                <span v-if="!editingTaskId || editingTaskId !== task.id" @dblclick="startEditTask(task)">{{ task.name }}</span>
                <input v-else v-model="editTaskNameValue" @keyup.enter="saveEditTask(task)" @blur="cancelEditTask" class="input input-sm w-32" />
              </td>
              <td>
                <input
                  type="checkbox"
                  class="checkbox checkbox-success"
                  :checked="task.completed"
                  @change="() => toggleCompleted(task)"
                />
              </td>
              <td>
                {{ task.completedAt ? new Date(task.completedAt).toLocaleString() : '-' }}
              </td>
              <td>
                <button @click="handleDeleteTask(task)" class="btn btn-xs btn-error">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>

        <p
          v-if="projectsStore.selectedProject.tasks.length === 0"
          class="text-gray-500 mt-2"
        >
          Sin tareas
        </p>

        <div class="flex items-center gap-2 mt-4">
          <input
            v-model="newTaskName"
            type="text"
            placeholder="Nombre de la nueva tarea"
            class="input input-bordered w-full max-w-xs"
            @keyup.enter="addTask"
          />
          <button class="btn btn-primary" @click="addTask">Agregar</button>
        </div>

        <button class="btn btn-sm mt-4" @click="projectsStore.deselectProject">
          Volver
        </button>

        <button v-if="projectsStore.selectedProject" class="btn btn-error mt-4" @click="handleDeleteProject">Eliminar proyecto</button>
      </template>

      <template v-else>
        <table class="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Tarea</th>
              <th>Completado</th>
              <th>Fecha de completado</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(project, index) in projectsStore.projects"
              :key="project.id"
            >
              <th>{{ index + 1 }}</th>
              <td>{{ project.name }}</td>
              <td>{{ project.tasks.length }}</td>
              <td>
                <div class="flex items-center gap-2">
                  <progress
                    class="progress progress-success w-56"
                    :value="getProjectProgress(project)"
                    max="100"
                  ></progress>
                  <span>{{ getProjectProgress(project) }}%</span>
                  <button class="btn btn-error btn-sm ml-2" @click="handleDeleteProjectFromList(project.id)">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useProjectsStore } from "@/stores/projects";

const projectsStore = useProjectsStore();
const newTaskName = ref("");
const { editTaskName, deleteTask, editProjectName, deleteProject } = projectsStore
const editingTaskId = ref(null)
const editTaskNameValue = ref('')
const editingProjectName = ref(false)
const editProjectNameValue = ref('')

function addTask() {
  const trimmed = newTaskName.value.trim();
  if (trimmed !== "") {
    projectsStore.addTaskToProject(projectsStore.selectedProjectId, trimmed);
    projectsStore.saveToLocalStorage();
    newTaskName.value = "";
  }
}

function toggleCompleted(task) {
  task.completed = !task.completed;
  task.completedAt = task.completed ? new Date().toISOString() : null;
  projectsStore.saveToLocalStorage();
}

function getProjectProgress(project) {
  const tasks = project.tasks || [];
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  return total === 0 ? 0 : Math.round((completed / total) * 100);
}

function startEditTask(task) {
  editingTaskId.value = task.id
  editTaskNameValue.value = task.name
}
function saveEditTask(task) {
  if (editTaskNameValue.value.trim()) {
    editTaskName(projectsStore.selectedProjectId, task.id, editTaskNameValue.value.trim())
  }
  editingTaskId.value = null
}
function cancelEditTask() {
  editingTaskId.value = null
}
function handleDeleteTask(task) {
  deleteTask(projectsStore.selectedProjectId, task.id)
}
function startEditProjectName() {
  editingProjectName.value = true
  editProjectNameValue.value = projectsStore.selectedProject.name
}
function saveEditProjectName() {
  if (editProjectNameValue.value.trim()) {
    editProjectName(projectsStore.selectedProjectId, editProjectNameValue.value.trim())
  }
  editingProjectName.value = false
}
function cancelEditProjectName() {
  editingProjectName.value = false
}
function handleDeleteProject() {
  deleteProject(projectsStore.selectedProjectId)
}
function handleDeleteProjectFromList(projectId) {
  deleteProject(projectId)
}

watch(
  () => projectsStore.selectedProjectId,
  (val) => {
    console.log("selectedProjectId cambió a:", val);
  }
);
</script>