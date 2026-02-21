import { useState } from 'react'
import { FormPreview } from '@/screens/form-preview'
import { FormLibrary, FORM_LIBRARIES } from '@/constants'
import { parseAndValidateFormJson } from '@/lib/form-json-schema'
import type { FormFieldOrGroup } from '@/screens/form-preview'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ReviewFormJson() {
  const [jsonInput, setJsonInput] = useState('')
  const [formFields, setFormFields] = useState<FormFieldOrGroup[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedLibrary, setSelectedLibrary] = useState<FormLibrary>(FORM_LIBRARIES.REACT_HOOK_FORM)

  const handlePreview = () => {
    setError(null)
    setFormFields(null)
    const trimmed = jsonInput.trim()
    if (!trimmed) {
      setError('Please paste form JSON.')
      return
    }
    try {
      const hydrated = parseAndValidateFormJson(trimmed)
      setFormFields(hydrated)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid form JSON.')
    }
  }

  const handleClear = () => {
    setJsonInput('')
    setFormFields(null)
    setError(null)
  }

  return (
    <div className="mx-auto space-y-6 py-6 px-5">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Review form from JSON</h1>
        <p className="text-muted-foreground text-sm">
          Paste the exported form JSON below to preview the form. Use the same JSON format exported from the Playground (JSON tab).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-sm font-medium" htmlFor="json-input">
            Form JSON
          </label>
          <textarea
            id="json-input"
            className="w-full min-h-[280px] rounded-lg border bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder='[{"variant":"Input","name":"name_123","label":"Username",...}]'
            value={jsonInput}
            onChange={(e) => {
              setJsonInput(e.target.value)
              if (error) setError(null)
            }}
          />
          <div className="flex gap-2">
            <Button onClick={handlePreview}>Preview form</Button>
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          </div>
          {error && (
            <div
              className={cn(
                'flex gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive',
              )}
              role="alert"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Invalid JSON</p>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          )}
        </div>

        <div className="min-h-[300px]">
          {formFields && formFields.length > 0 ? (
            <FormPreview
              formFields={formFields}
              selectedLibrary={selectedLibrary}
              onLibraryChange={setSelectedLibrary}
            />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[300px] rounded-xl border border-dashed bg-muted/30 text-muted-foreground text-sm">
              <p>Paste JSON and click &quot;Preview form&quot; to see the form here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
