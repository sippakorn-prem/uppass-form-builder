<template>
    <div class="p-8 space-y-8 bg-gradient-to-b from-gray-100 to-white min-h-screen flex flex-col items-center justify-center">
        <h1 class="text-4xl font-bold text-gray-800 mb-12">Form Builder</h1>
        
        <div class="flex gap-6">
            <router-link 
                to="/builder" 
                class="bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 shadow-lg"
            >
                Go to Builder
            </router-link>
            
            <router-link 
                to="/renderer" 
                class="bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 shadow-lg"
            >
                Go to Renderer
            </router-link>
        </div>
    </div>
</template>

<script setup>
// Navigation buttons for Builder and Renderer routes
</script>