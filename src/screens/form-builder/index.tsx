import { useState, useEffect } from 'react'

import { FormFieldType } from '@/types'
import { defaultFieldConfig, FORM_LIBRARIES, FormLibrary } from '@/constants'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Separator } from '@/components/ui/separator'

import If from '@/components/ui/if'
import SpecialComponentsNotice from '@/components/playground/special-component-notice'
import { FieldSelector } from '@/screens/field-selector'
import { FormFieldList } from '@/screens/form-field-list'
import { FormPreview } from '@/screens/form-preview'
import { EditFieldDialog } from '@/screens/edit-field-dialog'
import EmptyListSvg from '@/assets/oc-thinking.svg'
import { cn } from '@/lib/utils'

export type FormFieldOrGroup = FormFieldType | FormFieldType[]

export default function FormBuilder() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [formFields, setFormFields] = useState<FormFieldOrGroup[]>([])
  const [selectedField, setSelectedField] = useState<FormFieldType | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedLibrary, setSelectedLibrary] = useState<FormLibrary>(() => {
    if (typeof window !== 'undefined') {
      return (
        (localStorage.getItem('formLibrary') as FormLibrary) ||
        FORM_LIBRARIES.REACT_HOOK_FORM
      )
    }
    return FORM_LIBRARIES.REACT_HOOK_FORM
  })

  // Handlers
  const addFormField = (variant: string, index: number) => {
    const newFieldName = `name_${Math.random().toString().slice(-10)}`

    const { label, description, placeholder } = defaultFieldConfig[variant] || {
      label: '',
      description: '',
      placeholder: '',
    }

    const newField: FormFieldType = {
      checked: true,
      description: description || '',
      disabled: false,
      label: label || newFieldName,
      name: newFieldName,
      onChange: () => {},
      onSelect: () => {},
      placeholder: placeholder || 'Placeholder',
      required: true,
      rowIndex: index,
      setValue: () => {},
      type: '',
      value: '',
      variant,
    }
    setFormFields([...formFields, newField])
  }

  const findFieldPath = (
    fields: FormFieldOrGroup[],
    name: string,
  ): number[] | null => {
    const search = (
      currentFields: FormFieldOrGroup[],
      currentPath: number[],
    ): number[] | null => {
      for (let i = 0; i < currentFields.length; i++) {
        const field = currentFields[i]
        if (Array.isArray(field)) {
          const result = search(field, [...currentPath, i])
          if (result) return result
        } else if (field.name === name) {
          return [...currentPath, i]
        }
      }
      return null
    }
    return search(fields, [])
  }

  const updateFormField = (path: number[], updates: Partial<FormFieldType>) => {
    const updatedFields = JSON.parse(JSON.stringify(formFields)) // Deep clone
    let current: any = updatedFields
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]]
    }
    current[path[path.length - 1]] = {
      ...current[path[path.length - 1]],
      ...updates,
    }
    setFormFields(updatedFields)
  }

  const openEditDialog = (field: FormFieldType) => {
    setSelectedField(field)
    setIsDialogOpen(true)
  }

  const handleSaveField = (updatedField: FormFieldType) => {
    if (selectedField) {
      const path = findFieldPath(formFields, selectedField.name)
      if (path) {
        updateFormField(path, updatedField)
      }
    }
    setIsDialogOpen(false)
  }

  // Effects
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('formLibrary', selectedLibrary)
    }
  }, [selectedLibrary])

  // UI
  const renderFieldSelector = (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-start">
      <FieldSelector
        addFormField={(variant: string, index: number = 0) =>
          addFormField(variant, index)
        }
      />
      <Separator
        orientation={isDesktop ? 'vertical' : 'horizontal'}
        className={cn(
          'shrink-0',
          isDesktop ? 'h-[min(75vh,600px)]' : 'w-full',
        )}
      />
    </div>
  )

  return (
    <section className="min-h-0 md:max-h-screen space-y-6 md:space-y-8 py-4">
      <If
        condition={formFields.length > 0}
        render={() => (
          <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-4 px-4 mx-auto">
            
            {/* Left: field selector + form list */}
            <div className="flex flex-col md:flex-row gap-4 min-h-0 md:max-h-[75vh]">
              {renderFieldSelector}
              <div className="flex-1 min-h-0 overflow-y-auto rounded-xl border border-border/80 bg-card/50 p-4 md:p-5">
                <FormFieldList
                  formFields={formFields}
                  setFormFields={setFormFields}
                  updateFormField={updateFormField}
                  openEditDialog={openEditDialog}
                />
              </div>
            </div>

            {/* Right: notice + preview */}
            <div className="flex flex-col gap-4 min-h-0 lg:max-h-[75vh]">
              <SpecialComponentsNotice formFields={formFields} />
              <div className="min-h-0 flex-1 rounded-xl border border-border/80 bg-card/50 overflow-hidden">
                <FormPreview
                  key={JSON.stringify(formFields)}
                  formFields={formFields}
                  selectedLibrary={selectedLibrary}
                  onLibraryChange={setSelectedLibrary}
                />
              </div>
            </div>
          </div>
        )}
        otherwise={() => (
          <div className="flex flex-col md:flex-row md:items-center gap-6 px-4 mx-auto">
            {renderFieldSelector}
            <div className="flex-1 flex flex-col items-center justify-center py-12 md:py-16 text-center">
            <EmptyListSvg />
            </div>
          </div>
        )}
      />
      <EditFieldDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        field={selectedField}
        onSave={handleSaveField}
      />
    </section>
  )
}
