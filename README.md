# Form Builder Application

A modern, drag-and-drop form builder built with Vue 3, TypeScript, and Tailwind CSS. Create dynamic forms with conditional logic, validation, and beautiful UI components.

## 1. Project Overview

This is a **visual form builder** that allows users to create forms through a simple drag-and-drop interface. Think of it like a "Lego set for forms" - you can drag different input types (text fields, dropdowns, date pickers, etc.) onto a canvas to build your form.

### What it does:
- 🎨 **Visual Form Builder**: Drag and drop form elements
- 📝 **Multiple Input Types**: Text, numbers, dropdowns, radio buttons, date pickers
- 🧠 **Smart Logic**: Show/hide fields based on other field values
- ✅ **Real-time Validation**: Instant feedback on form errors
- 💾 **Save & Load**: Store your forms in the browser
- 🔒 **Secure Storage**: Forms are encrypted before saving
- 📱 **Responsive Design**: Works on desktop and mobile

### Who it's for:
- Developers who need to create forms quickly
- Non-technical users who want to build forms without coding
- Teams that need to prototype form interfaces

## 2. Design Concept / Architecture

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Form Builder  │    │   Form Renderer │    │   Form Store    │
│   (Design Mode) │◄──►│   (Preview)     │◄──►│   (Data Layer)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Field Types   │    │   Validation    │    │   LocalStorage  │
│   (Components)  │    │   (Real-time)   │    │   (Encrypted)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Core Concepts

**1. Three Main Views:**
- **Builder**: Where you design your form (drag & drop)
- **Preview**: See how your form looks to users
- **Renderer**: The actual form users fill out

**2. Component-Based Design:**
- Each form field is a separate, reusable component
- Components handle their own validation and styling
- Easy to add new field types

**3. State Management:**
- Central store (Pinia) manages all form data
- Real-time updates between builder and preview
- Automatic saving to browser storage

## 3. Key Technical Decisions

### Schema Design Philosophy

The core of this form builder is a **flexible, JSON-based schema** that can represent any form structure. Our schema design follows these principles:

#### **1. Separation of Concerns**
```json
{
  "schema": { /* Data validation rules */ },
  "ui": { /* User interface settings */ },
  "logic": { /* Conditional behavior */ }
}
```

**Why this matters:**
- **Schema**: Defines what data is valid (types, constraints, validation)
- **UI**: Controls how users interact with the form (labels, placeholders, styling)
- **Logic**: Determines when fields appear or become required

#### **2. JSON Schema Compatibility**
Our schema extends JSON Schema standards, making it compatible with existing validation libraries:

```json
{
  "schema": {
    "type": "string",
    "minLength": 1,
    "maxLength": 280
  }
}
```

**Benefits:**
- ✅ Works with existing JSON Schema validators
- ✅ Standardized validation rules
- ✅ Easy to understand for developers
- ✅ Future-proof against schema changes

#### **3. Flexible Widget System**
Instead of hardcoding input types, we use a widget-based approach:

```json
{
  "ui": {
    "widget": "text",     // Could be: text, number, select, radio, date
    "label": "ชื่อ",
    "placeholder": "กรอกชื่อ-นามสกุล"
  }
}
```

**Why widgets work:**
- 🎨 **Consistent UI**: Same widget looks the same everywhere
- 🔧 **Easy to extend**: Add new widgets without changing core logic
- 🧪 **Testable**: Each widget can be tested independently

#### **4. JsonLogic for Conditional Behavior**
We use JsonLogic for complex conditional rules:

```json
{
  "logic": {
    "visibleWhen": { "==": [{ "var": "duration" }, "full"] }
  }
}
```

**This means:** "Show this field when the 'duration' field equals 'full'"

**Why JsonLogic:**
- ✅ **Human-readable**: Easy to understand the logic
- ✅ **Powerful**: Supports complex conditions (AND, OR, comparisons)
- ✅ **Standardized**: Works with existing JsonLogic libraries
- ✅ **Safe**: No arbitrary code execution

#### **5. Real-World Example Structure**

Looking at our `example.json`, here's how a complete form is structured:

```json
{
  "title": "Leave Request Form",           // Form identification
  "version": "1.0.0",                     // Schema versioning
  "type": "form",                          // Document type
  "meta": {                               // Human-readable info
    "label": "ใบลา",
    "description": "แบบฟอร์มสำหรับกรอกข้อมูลใบลา"
  },
  "fields": [ /* Array of form fields */ ],
  "validation": { /* Cross-field validation */ },
  "submit": { /* Form submission settings */ }
}
```

### Architecture Decisions

**1. Schema-First Design**
- ✅ Forms are just data structures
- ✅ Easy to serialize/deserialize
- ✅ Can be generated programmatically
- ❌ Requires careful schema design

**2. Component-Based Rendering**
- ✅ Each field type is a separate component
- ✅ Easy to add new field types
- ✅ Consistent behavior across fields
- ❌ More components to maintain

**3. Client-Side Storage with Encryption**
- ✅ Works offline
- ✅ User data is secure
- ✅ No server required
- ❌ Data lost if browser cache cleared

**4. Real-Time Preview**
- ✅ Immediate feedback on changes
- ✅ WYSIWYG form building
- ✅ Reduces development time
- ❌ Can be resource-intensive

## 4. Project Structure (Directory Overview)

```
form-builder/
├── 📁 src/
│   ├── 📁 components/           # Vue components
│   │   ├── 📁 forms/            # Form input components
│   │   │   ├── TextInput.vue    # Text field component
│   │   │   ├── NumberInput.vue  # Number field component
│   │   │   ├── SelectInput.vue  # Dropdown component
│   │   │   ├── RadioInput.vue   # Radio buttons component
│   │   │   └── DateInput.vue    # Date picker component
│   │   ├── FormBuilder.vue      # Main builder interface
│   │   ├── FormRenderer.vue     # Form display component
│   │   └── AppNavigation.vue    # Navigation bar
│   ├── 📁 stores/               # State management
│   │   └── formStore.ts         # Main application state
│   ├── 📁 types/                # TypeScript definitions
│   │   └── form.ts              # Form data types
│   ├── 📁 utils/                # Helper functions
│   │   └── crypto.ts            # Encryption utilities
│   ├── 📁 views/                # Page components
│   │   ├── HomeView.vue         # Landing page
│   │   └── BuilderView.vue      # Builder page
│   └── 📁 volt/                 # UI component library
│       ├── Button.vue           # Button component
│       ├── InputText.vue        # Text input
│       └── ...                  # Other UI components
├── 📁 src/components/__tests__/  # Component tests
├── 📁 src/stores/__tests__/     # Store tests
├── 📄 package.json              # Dependencies
├── 📄 vite.config.ts            # Build configuration
├── 📄 tailwind.config.js        # Styling configuration
└── 📄 README.md                 # This file
```

### Key Files Explained

| File | Purpose | Why Important |
|------|--------|---------------|
| `FormBuilder.vue` | Main interface for creating forms | Heart of the application |
| `formStore.ts` | Manages all application state | Keeps everything in sync |
| `crypto.ts` | Encrypts/decrypts saved data | Protects user information |
| `form.ts` | Defines data structures | Ensures type safety |
| `example.json` | Sample form configuration | Shows what's possible |

## 5. Setup and Run Instructions

### Prerequisites
Make sure you have these installed:
- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)

### Quick Start (3 steps)

**Step 1: Download the project**
```bash
# If you have the code already, just navigate to the folder
cd form-builder

# If you need to download it first:
git clone <repository-url>
cd form-builder
```

**Step 2: Install dependencies**
```bash
npm install
```
*This downloads all the required libraries (takes 1-2 minutes)*

**Step 3: Start the development server**
```bash
npm run dev
```
*This starts the application at http://localhost:3000*

### Available Commands

| Command | What it does | When to use |
|---------|--------------|-------------|
| `npm run dev` | Start development server | When developing |
| `npm run build` | Create production files | Before deploying |
| `npm run preview` | Test production build | Before deploying |
| `npm run test` | Run all tests | When making changes |
| `npm run test:ui` | Open test interface | When debugging tests |

### Troubleshooting

**Problem**: "Command not found: npm"
- **Solution**: Install Node.js from [nodejs.org](https://nodejs.org)

**Problem**: "Port 3000 is already in use"
- **Solution**: The app will automatically use the next available port (5174, 5175, etc.)

**Problem**: "Module not found" errors
- **Solution**: Run `npm install` again

## 6. Testing

### What We Test
- ✅ **Components render correctly**
- ✅ **User interactions work** (clicking, typing, etc.)
- ✅ **Form validation works**
- ✅ **Data saving and loading**
- ✅ **State management**

### Running Tests

**Run all tests:**
```bash
npm run test
```

**Run tests in watch mode:**
```bash
npm run test:ui
```

**Run tests once:**
```bash
npm run test:run
```

### Test Structure
```
src/
├── components/__tests__/     # Component tests
│   ├── FormBuilder.test.ts   # Builder functionality
│   ├── FormRenderer.test.ts  # Form display
│   └── forms/                # Individual field tests
└── stores/__tests__/         # State management tests
    └── formStore.test.ts     # Store functionality
```

### Test Coverage
- **109 tests** covering all major functionality
- **10 test files** organized by component
- **Mock components** for isolated testing
- **Realistic scenarios** that match user behavior

## 7. Deployment

### Building for Production

**Step 1: Create production build**
```bash
npm run build
```
*This creates optimized files in the `dist/` folder*

**Step 2: Test the build**
```bash
npm run preview
```
*This serves the production build locally*

### Deployment Options

**Option 1: Static Hosting (Recommended)**
- **Netlify**: Drag and drop the `dist/` folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Push to a `gh-pages` branch

**Option 2: Traditional Web Server**
- Upload the `dist/` folder contents to your web server
- Ensure the server serves `index.html` for all routes

**Option 3: Docker (Advanced)**
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
```

### Environment Configuration

The app works entirely in the browser, so no environment variables are needed. However, you can customize:

```javascript
// In vite.config.ts
export default defineConfig({
  base: '/your-app-path/',  // If not deployed to root
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
```

## 8. Future Improvements

### Short Term (Next 1-2 months)
- 🔄 **Undo/Redo**: Add history management for form changes
- 📱 **Mobile Optimization**: Better touch interactions
- 🎨 **Themes**: Dark mode and custom color schemes
- 📤 **Export Options**: PDF, Word, or HTML export

### Medium Term (3-6 months)
- 👥 **Multi-user**: Collaborative form building
- 🔗 **API Integration**: Connect to external services
- 📊 **Analytics**: Track form usage and completion rates
- 🌐 **Internationalization**: Support multiple languages

### Long Term (6+ months)
- 🤖 **AI Form Suggestions**: Auto-generate form fields
- 📱 **Mobile App**: Native iOS/Android versions
- 🔌 **Plugin System**: Third-party integrations
- ☁️ **Cloud Storage**: Sync forms across devices

### Technical Debt
- [ ] Improve error handling for edge cases
- [ ] Add more comprehensive accessibility features
- [ ] Optimize bundle size for faster loading
- [ ] Add end-to-end testing with Playwright

---

## 📞 Support

If you have questions or need help:

- 📧 **Email**: [sippakorn.su@gmail.com]

---

**Made with ❤️ using Vue 3, TypeScript, and modern web technologies**
