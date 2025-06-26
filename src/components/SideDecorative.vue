<template>
  <div class="w-80 min-h-screen bg-base-200 p-4">
    <ul class="menu text-base-content">
      <li class="menu-title">
        <span class="text-lg font-bold text-gray-800">Proyectos</span>
        <span class="text-sm opacity-50">
          {{ projects.length === 0 ? 'No hay proyectos' : '' }}
        </span>
      </li>

      <li v-for="project in projects" :key="project.id" class="flex items-center gap-2 group">
        <details v-if="project.tasks.length > 0">
          <summary @click="selectProject(project.id)" class="cursor-pointer">
            <span v-if="!editingProjectId || editingProjectId !== project.id" @dblclick="startEditProject(project)">{{ project.name }}</span>
            <input v-else v-model="editProjectNameValue" @keyup.enter="saveEditProject(project)" @blur="cancelEditProject" class="input input-sm w-32" />
          </summary>
          <ul>
            <li v-for="task in project.tasks" :key="task.id">
              <a>{{ task.name }}</a>
            </li>
          </ul>
        </details>
        <template v-else>
          <span v-if="!editingProjectId || editingProjectId !== project.id" @dblclick="startEditProject(project)" @click="selectProject(project.id)" class="cursor-pointer">{{ project.name }}</span>
          <input v-else v-model="editProjectNameValue" @keyup.enter="saveEditProject(project)" @blur="cancelEditProject" class="input input-sm w-32" />
        </template>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useProjectsStore } from '@/stores/projects'
const { projects, selectProject, editProjectName, deleteProject } = useProjectsStore()

const editingProjectId = ref(null)
const editProjectNameValue = ref('')

function startEditProject(project) {
  editingProjectId.value = project.id
  editProjectNameValue.value = project.name
}
function saveEditProject(project) {
  if (editProjectNameValue.value.trim()) {
    editProjectName(project.id, editProjectNameValue.value.trim())
  }
  editingProjectId.value = null
}
function cancelEditProject() {
  editingProjectId.value = null
}
</script>