// Form Schema Types
export interface FormSchema {
  title: string
  version: string
  type: 'form'
  meta: {
    label: string
    description: string
  }
  fields: FormField[]
  validation?: {
    ifThenElse?: Array<{
      if: any
      then: any
      else?: any
    }>
  }
  submit: {
    label: string
    action: string
    method: 'POST' | 'GET' | 'PUT' | 'DELETE'
  }
}

export interface FormField {
  key: string
  schema: {
    type: 'string' | 'integer' | 'number' | 'boolean' | 'array'
    title: string
    minLength?: number
    maxLength?: number
    minimum?: number
    maximum?: number
    enum?: string[]
    default?: any
    items?: any
  }
  ui: {
    widget: 'text' | 'number' | 'select' | 'radio' | 'checkbox' | 'date'
    label: string
    placeholder?: string
    layout: 'normal' | 'inline' | 'full'
    required?: boolean
    options?: Array<{
      label: string
      value: string | number
    }>
    allow_decimal?: boolean
  }
  logic: {
    visibleWhen?: any
    enabledWhen?: any
  }
}

export interface FormData {
  [key: string]: any
}

export interface ValidationError {
  field: string
  message: string
}

export interface FormState {
  data: FormData
  errors: ValidationError[]
  isValid: boolean
  isSubmitting: boolean
}

// Builder Types
export interface BuilderField {
  id: string
  type: 'text' | 'number' | 'select' | 'radio' | 'checkbox' | 'date'
  label: string
  required: boolean
  config: Partial<FormField>
}

export interface BuilderState {
  fields: BuilderField[]
  selectedField: string | null
  isPreviewMode: boolean
}
