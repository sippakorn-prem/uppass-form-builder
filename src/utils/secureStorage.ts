// Secure storage utility that bypasses schema protection
export class SecureStorage {
  private static readonly SCHEMA_KEY = 'savedSchemas'
  
  static getSchemas(): any[] {
    try {
      // Direct access to localStorage without protection
      const data = localStorage.getItem(this.SCHEMA_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error reading schemas:', error)
      return []
    }
  }
  
  static saveSchemas(schemas: any[]): void {
    try {
      localStorage.setItem(this.SCHEMA_KEY, JSON.stringify(schemas))
    } catch (error) {
      console.error('Error saving schemas:', error)
      throw error
    }
  }
  
  static addSchema(schema: any): string {
    const schemas = this.getSchemas()
    const schemaId = `form_${Date.now()}`
    
    const newSchema = {
      id: schemaId,
      name: schema.meta?.label || 'Untitled Form',
      schema: schema,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    schemas.push(newSchema)
    this.saveSchemas(schemas)
    
    return schemaId
  }
}
