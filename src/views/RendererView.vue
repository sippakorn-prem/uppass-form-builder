<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Action Bar -->
    <div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-end items-center py-4">
          <div class="flex space-x-3">
            <button
              @click="clearSchema"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Clear Schema
            </button>
            <button
              @click="loadExampleSchema"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Load Example
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto py-8">
      <div class="bg-white rounded-lg shadow-sm border p-6">
        
        <!-- Schema Loader -->
        <div v-if="!formStore.currentSchema" class="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Load Form Schema</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Upload JSON Schema File</label>
              <input
                ref="fileInput"
                type="file"
                accept=".json"
                @change="handleFileUpload"
                class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>
        </div>
        
        <!-- Form Renderer -->
        <FormRenderer v-if="formStore.currentSchema" />
        
        <!-- No Schema Message -->
        <div v-else class="text-center py-12 text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p class="text-lg">No form schema loaded</p>
          <p class="text-sm mt-2">Upload a JSON schema file or load the example to get started</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FormRenderer from '@/components/FormRenderer.vue'
import { useFormStore } from '@/stores/formStore'
import type { FormSchema } from '@/types/form'
import { ref } from 'vue'

const formStore = useFormStore()
const fileInput = ref<HTMLInputElement>()

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const schema = JSON.parse(e.target?.result as string) as FormSchema
        formStore.loadSchema(schema)
      } catch (error) {
        alert('Invalid JSON file. Please check the format.')
      }
    }
    reader.readAsText(file)
  }
}

const clearSchema = () => {
  formStore.currentSchema = null
  formStore.formData = {}
  formStore.validationErrors = []
}

const loadExampleSchema = () => {
  const exampleSchema: FormSchema = {
    title: "Leave Request Form",
    version: "1.0.0",
    type: "form",
    meta: {
      label: "ใบลา",
      description: "แบบฟอร์มสำหรับกรอกข้อมูลใบลา"
    },
    fields: [
      {
        key: "full_name",
        schema: {
          type: "string",
          title: "Full Name",
          minLength: 1,
          maxLength: 280
        },
        ui: {
          widget: "text",
          label: "ชื่อ",
          placeholder: "กรอกชื่อ-นามสกุล",
          layout: "normal",
          required: true
        },
        logic: {}
      },
      {
        key: "duration",
        schema: {
          type: "string",
          title: "Duration",
          enum: ["half", "full"]
        },
        ui: {
          widget: "radio",
          label: "ลาทำไม",
          placeholder: "หากลาเต็มวันกรุณากรอกวันด้านล่างด้วย",
          options: [
            { label: "ครึ่งวัน", value: "half" },
            { label: "เต็มวัน", value: "full" }
          ],
          layout: "normal",
          required: true
        },
        logic: {}
      },
      {
        key: "days",
        schema: {
          type: "integer",
          title: "Days",
          minimum: 1,
          maximum: 1000000,
          default: 1
        },
        ui: {
          widget: "number",
          label: "ลากี่วัน",
          layout: "normal",
          allow_decimal: false
        },
        logic: {
          visibleWhen: { "==": [{ "var": "duration" }, "full"] }
        }
      }
    ],
    validation: {
      ifThenElse: [
        {
          if: { properties: { duration: { const: "full" } }, required: ["duration"] },
          then: { required: ["days"] }
        }
      ]
    },
    submit: {
      label: "Submit",
      action: "/api/form/submit",
      method: "POST"
    }
  }
  
  formStore.loadSchema(exampleSchema)
}
</script>
