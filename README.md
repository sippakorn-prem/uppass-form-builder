# Form Builder & Renderer

A comprehensive Vue 3 application for building and rendering dynamic forms with drag-and-drop functionality, validation, and conditional logic.

## 🎯 Features

### Form Builder (Admin Interface)
- **Drag & Drop Interface**: Add, remove, and reorder form fields with intuitive drag-and-drop
- **Field Configuration**: Edit field properties including labels, placeholders, validation rules
- **Live Preview**: Real-time preview of the form as you build it
- **Schema Export**: Export form schemas as JSON for storage or sharing
- **Multiple Field Types**: Support for Text, Number, Select, and Radio inputs

### Form Renderer (User Interface)
- **Dynamic Rendering**: Load and render forms from JSON schemas
- **Conditional Logic**: Fields show/hide based on JsonLogic rules
- **Real-time Validation**: Client-side validation with immediate feedback
- **Responsive Design**: Mobile-friendly interface with smooth animations
- **Form Submission**: Mock API integration with loading states

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **Pinia Store**: Centralized state management
- **JsonLogic**: Advanced conditional field visibility
- **Ajv Validation**: JSON Schema validation
- **Tailwind CSS**: Modern, responsive styling
- **Vue 3 Composition API**: Modern Vue development patterns

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd form-builder

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── forms/           # Individual form input components
│   │   ├── TextInput.vue
│   │   ├── NumberInput.vue
│   │   ├── SelectInput.vue
│   │   └── RadioInput.vue
│   ├── FormBuilder.vue  # Drag-and-drop form builder
│   └── FormRenderer.vue # Dynamic form renderer
├── stores/
│   └── formStore.ts    # Pinia store for state management
├── types/
│   └── form.ts         # TypeScript interfaces
├── views/
│   ├── HomeView.vue    # Landing page
│   ├── BuilderView.vue # Form builder page
│   └── RendererView.vue # Form renderer page
└── router/
    └── index.ts       # Vue Router configuration
```

## 🎨 Usage

### Building Forms

1. Navigate to `/builder` to access the form builder
2. Drag field types from the palette to the canvas
3. Click on fields to configure their properties
4. Use the preview mode to test your form
5. Export the schema as JSON when complete

### Rendering Forms

1. Navigate to `/renderer` to access the form renderer
2. Upload a JSON schema file or use the example schema
3. Fill out the form with real-time validation
4. Submit the form to see the results

## 📋 Schema Format

The application uses a comprehensive JSON schema format:

```json
{
  "title": "Form Title",
  "version": "1.0.0",
  "type": "form",
  "meta": {
    "label": "Form Label",
    "description": "Form Description"
  },
  "fields": [
    {
      "key": "field_name",
      "schema": {
        "type": "string",
        "title": "Field Title",
        "minLength": 1,
        "maxLength": 100
      },
      "ui": {
        "widget": "text",
        "label": "Field Label",
        "placeholder": "Enter text...",
        "required": true
      },
      "logic": {
        "visibleWhen": { "==": [{ "var": "other_field" }, "value"] }
      }
    }
  ],
  "submit": {
    "label": "Submit",
    "action": "/api/submit",
    "method": "POST"
  }
}
```

## 🔧 Configuration

### Field Types Supported
- **Text Input**: Single-line text with validation
- **Number Input**: Numeric input with min/max constraints
- **Select Dropdown**: Single selection from options
- **Radio Buttons**: Single selection with radio button UI

### Validation Features
- Required field validation
- String length constraints
- Numeric range validation
- Custom error messages
- Real-time validation feedback

### Conditional Logic
- Field visibility based on other field values
- JsonLogic expressions for complex conditions
- Dynamic form behavior

## 🛠️ Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check
```

### Adding New Field Types

1. Create a new component in `src/components/forms/`
2. Add the field type to the `BuilderField` type
3. Update the `FormBuilder` component to handle the new type
4. Add the field to the `FormRenderer` component

## 📦 Dependencies

- **Vue 3**: Progressive JavaScript framework
- **TypeScript**: Type-safe JavaScript
- **Pinia**: State management
- **Vue Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **JsonLogic**: Logic evaluation
- **Ajv**: JSON Schema validation
- **VueDraggable**: Drag and drop functionality

## 🚀 Deployment

The application can be deployed to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Connect your repository
- **GitHub Pages**: Use GitHub Actions
- **Cloudflare Pages**: Connect your repository

## 📄 License

This project is part of a technical assessment for UpPass Frontend Developer 2025.

## 🤝 Contributing

This is a technical assessment project. For questions or feedback, please contact the development team.