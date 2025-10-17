<template>
    <div class="p-8 space-y-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">
            PrimeVue Volt Components Demo
        </h1>

        <!-- Breadcrumb -->
        <Card>
            <template #title>Breadcrumb</template>
            <template #content>
                <Breadcrumb :model="breadcrumbItems" />
            </template>
        </Card>

        <!-- Buttons -->
        <Card>
            <template #title>Buttons</template>
            <template #content>
                <div class="flex gap-4 flex-wrap">
                    <Button label="Primary Button" />
                    <Button label="Secondary Button" severity="secondary" />
                    <Button label="Success Button" severity="success" />
                    <Button label="Info Button" severity="info" />
                    <Button label="Warning Button" severity="warning" />
                    <Button label="Help Button" severity="help" />
                    <Button label="Danger Button" severity="danger" />
                </div>
            </template>
        </Card>

        <!-- Input Fields -->
        <Card>
            <template #title>Input Fields</template>
            <template #content>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Text Input</label>
                        <InputText v-model="textValue" placeholder="Enter text" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Number Input</label>
                        <InputNumber v-model="numberValue" placeholder="Enter number" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Date Picker</label>
                        <DatePicker v-model="dateValue" placeholder="Select date" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Select</label>
                        <Select v-model="selectedValue" :options="selectOptions" placeholder="Choose option" />
                    </div>
                </div>
            </template>
        </Card>

        <!-- Messages -->
        <Card>
            <template #title>Messages</template>
            <template #content>
                <div class="space-y-4">
                    <Message severity="success" :closable="false">Success message content</Message>
                    <Message severity="info" :closable="false">Info message content</Message>
                    <Message severity="warn" :closable="false">Warning message content</Message>
                    <Message severity="error" :closable="false">Error message content</Message>
                </div>
            </template>
        </Card>

        <!-- Form Example -->
        <Card>
            <template #title>Form Example</template>
            <template #content>
                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Full Name</label>
                            <InputText v-model="formData.fullName" placeholder="Enter your full name" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Email</label>
                            <InputText v-model="formData.email" type="email" placeholder="Enter your email" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Age</label>
                            <InputNumber v-model="formData.age" placeholder="Enter your age" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Birth Date</label>
                            <DatePicker v-model="formData.birthDate" placeholder="Select birth date" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Country</label>
                            <Select v-model="formData.country" :options="countryOptions" placeholder="Select country" />
                        </div>
                    </div>
                    <div class="flex gap-4">
                        <Button type="submit" label="Submit Form" />
                        <Button type="button" label="Reset" severity="secondary" @click="resetForm" />
                    </div>
                </form>
            </template>
        </Card>
    </div>
</template>

<script setup>
import Breadcrumb from '@/volt/Breadcrumb.vue'
import Button from '@/volt/Button.vue'
import Card from '@/volt/Card.vue'
import DatePicker from '@/volt/DatePicker.vue'
import InputNumber from '@/volt/InputNumber.vue'
import InputText from '@/volt/InputText.vue'
import Message from '@/volt/Message.vue'
import Select from '@/volt/Select.vue'
import { ref } from 'vue'

// Reactive data
const textValue = ref('')
const numberValue = ref(null)
const dateValue = ref(null)
const selectedValue = ref(null)

const formData = ref({
    fullName: '',
    email: '',
    age: null,
    birthDate: null,
    country: null
})

// Breadcrumb items
const breadcrumbItems = ref([
    { label: 'Home', url: '/' },
    { label: 'Components', url: '/components' },
    { label: 'Volt Demo' }
])

// Select options
const selectOptions = ref([
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' }
])

const countryOptions = ref([
    { label: 'United States', value: 'US' },
    { label: 'Canada', value: 'CA' },
    { label: 'United Kingdom', value: 'UK' },
    { label: 'Germany', value: 'DE' },
    { label: 'France', value: 'FR' }
])

// Methods
const handleSubmit = () => {
    console.log('Form submitted:', formData.value)
    // You can add your form submission logic here
}

const resetForm = () => {
    formData.value = {
        fullName: '',
        email: '',
        age: null,
        birthDate: null,
        country: null
    }
}
</script>