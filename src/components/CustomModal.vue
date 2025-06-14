<template>
  <dialog ref="dialogRef" class="modal" @close="emit('update:visible', false)">
    <div class="modal-box">
      <slot name="content">
        <h3 class="font-bold text-lg">Título por default</h3>
        <p class="py-4">Mensaje por default del modal</p>
      </slot>

      <div class="modal-action">
        <form @submit.prevent="handleSubmit">
          <input
            v-model="projectName"
            type="text"
            placeholder="Nombre del proyecto"
            class="input input-bordered w-full max-w-xs"
          />
          <button type="submit" class="btn btn-primary">Agregar Proyecto</button>
          <button type="button" class="btn" @click="emitClose">Cerrar</button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useProjectsStore } from '@/stores/projects'

const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(['update:visible'])

const dialogRef = ref(null)
const projectName = ref('')
const projectsStore = useProjectsStore()

watch(() => props.visible, (val) => {
  if (val) dialogRef.value?.showModal()
  else dialogRef.value?.close()
})

function emitClose() {
  emit('update:visible', false)
}

function handleSubmit() {
  if (projectName.value.trim()) {
    projectsStore.addProject(projectName.value)
    projectName.value = ''
    emitClose()
  }
}
</script>
