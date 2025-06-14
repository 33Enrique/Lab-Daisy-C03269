<template>
  <div class="w-80 min-h-screen bg-base-200 p-4">
    <ul class="menu text-base-content">
      <li class="menu-title">
        <span class="text-lg text-white">Proyectos</span>
        <span class="text-sm opacity-50">
          {{ projects.length === 0 ? 'No hay proyectos' : '' }}
        </span>
      </li>

      <li v-for="project in projects" :key="project.id">
        <details v-if="project.tasks.length > 0">
          <summary @click="selectProject(project.id)" class="cursor-pointer">
            {{ project.name }}
          </summary>
          <ul>
            <li v-for="task in project.tasks" :key="task.id">
              <a>{{ task.name }}</a>
            </li>
          </ul>
        </details>
        <template v-else>
          <a @click="selectProject(project.id)" class="cursor-pointer">
            {{ project.name }}
          </a>
        </template>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useProjectsStore } from '@/stores/projects'
const { projects, selectProject } = useProjectsStore()
</script>
