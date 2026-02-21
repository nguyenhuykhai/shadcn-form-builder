import { zodResolver } from '@hookform/resolvers/zod'
import { Highlight, themes } from 'prism-react-renderer'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import If from '@/components/ui/if'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FormLibrary } from '@/constants'
import { renderFormField } from '@/screens/render-form-field'
import { FormFieldType } from '@/types'

import { formatJSXCode } from '@/lib/utils'
import {
  generateDefaultValues,
  generateFormCodeForLibrary,
  generateZodSchema,
} from '@/screens/generate-code-parts'
import { Code, Eye, Files } from 'lucide-react'
import { SiReacthookform, SiReactquery } from 'react-icons/si'
import { VscJson } from 'react-icons/vsc'

export type FormFieldOrGroup = FormFieldType | FormFieldType[]

export type FormPreviewProps = {
  formFields: FormFieldOrGroup[]
  selectedLibrary: FormLibrary
  onLibraryChange: (library: FormLibrary) => void
}

const renderFormFields = (fields: FormFieldOrGroup[], form: any) => {
  return fields.map((fieldOrGroup, index) => {
    if (Array.isArray(fieldOrGroup)) {
      // Calculate column span based on number of fields in the group
      const getColSpan = (totalFields: number) => {
        switch (totalFields) {
          case 2:
            return 6 // Two columns
          case 3:
            return 4 // Three columns
          default:
            return 12 // Single column or fallback
        }
      }

      return (
        <div key={index} className="grid grid-cols-12 gap-4">
          {fieldOrGroup.map((field) => {
            const rendered = renderFormField(field, form)
            const isValid = rendered != null && React.isValidElement(rendered)
            return (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem
                    className={`col-span-${getColSpan(fieldOrGroup.length)}`}
                  >
                    {isValid ? (
                      <FormControl>
                        {React.cloneElement(rendered, { ...formField })}
                      </FormControl>
                    ) : (
                      <>
                        <FormLabel>{field.label || field.name}</FormLabel>
                        <FormControl>
                          <div className="min-h-10 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive flex items-center">
                            Unsupported field type: &quot;{field.variant}&quot;
                          </div>
                        </FormControl>
                        <p className="text-xs text-destructive">
                          This component type is not available in the preview.
                        </p>
                      </>
                    )}
                  </FormItem>
                )}
              />
            )
          })}
        </div>
      )
    } else {
      const rendered = renderFormField(fieldOrGroup, form)
      const isValid = rendered != null && React.isValidElement(rendered)
      return (
        <FormField
          key={index}
          control={form.control}
          name={fieldOrGroup.name}
          render={({ field: formField }) => (
            <FormItem className="col-span-12">
              {isValid ? (
                <FormControl>
                  {React.cloneElement(rendered, { ...formField })}
                </FormControl>
              ) : (
                <>
                  <FormLabel>
                    {fieldOrGroup.label || fieldOrGroup.name}
                  </FormLabel>
                  <FormControl>
                    <div className="min-h-10 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive flex items-center">
                      Unsupported field type: &quot;{fieldOrGroup.variant}&quot;
                    </div>
                  </FormControl>
                  <p className="text-xs text-destructive">
                    This component type is not available in the preview.
                  </p>
                </>
              )}
            </FormItem>
          )}
        />
      )
    }
  })
}

export const FormPreview: React.FC<FormPreviewProps> = ({
  formFields,
  selectedLibrary,
  onLibraryChange,
}) => {
  const formSchema = generateZodSchema(formFields)

  const defaultVals = generateDefaultValues(formFields)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultVals,
  })

  function onSubmit(data: any) {
    try {
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>,
      )
    } catch (error) {
      console.error('Form submission error', error)
      toast.error('Failed to submit the form. Please try again.')
    }
  }

  const generatedCode = generateFormCodeForLibrary(formFields, selectedLibrary)
  const formattedCode = formatJSXCode(generatedCode)

  return (
    <div className="w-full h-full col-span-1 rounded-xl flex justify-center">
      <Tabs defaultValue="preview" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="preview">
              <div className="flex items-center gap-1">
                <Eye className="size-4" />{' '}
                <span className="text-sm">Preview</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="json">
              <div className="flex items-center gap-1">
                <VscJson />
                <span className="text-sm">JSON</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="code">
              <div className="flex items-center gap-1">
                <Code className="size-4" />
                <span className="text-sm">Code</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <Select
            value={selectedLibrary}
            onValueChange={(value) => onLibraryChange(value as FormLibrary)}
          >
            <SelectTrigger className="w-auto px-2 gap-2">
              <SelectValue placeholder="Select library">
                {selectedLibrary === 'react-hook-form' && (
                  <SiReacthookform className="size-5 text-[#EC5990]" />
                )}
                {selectedLibrary === 'tanstack-form' && (
                  <SiReactquery className="size-5" />
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Form Libraries</SelectLabel>
                <SelectItem value="react-hook-form">
                  <div className="flex items-center gap-2">
                    <SiReacthookform className="size-4 text-[#EC5990]" />
                    <span>React Hook Form</span>
                  </div>
                </SelectItem>
                <SelectItem value="tanstack-form">
                  <div className="flex items-center gap-2">
                    <SiReactquery className="size-4" />
                    <span>TanStack Form</span>
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <TabsContent
          value="preview"
          className="space-y-4 h-full md:max-h-[70vh] overflow-auto"
        >
          <If
            condition={formFields.length > 0}
            render={() => (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 py-5 max-w-lg"
                >
                  {renderFormFields(formFields, form)}
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            )}
            otherwise={() => (
              <div className="h-[50vh] flex justify-center items-center">
                <p>No form element selected yet.</p>
              </div>
            )}
          />
        </TabsContent>
        <TabsContent value="json">
          <If
            condition={formFields.length > 0}
            render={() => (
              <pre className="p-4 text-sm bg-secondary rounded-lg h-full md:max-h-[70vh] overflow-auto">
                {JSON.stringify(formFields, null, 2)}
              </pre>
            )}
            otherwise={() => (
              <div className="h-[50vh] flex justify-center items-center">
                <p>No form element selected yet.</p>
              </div>
            )}
          />
        </TabsContent>
        <TabsContent value="code">
          <If
            condition={formFields.length > 0}
            render={() => (
              <div className="relative">
                <Button
                  className="absolute right-2 top-2"
                  variant="secondary"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(formattedCode)
                    toast.success('Code copied to clipboard!')
                  }}
                >
                  <Files />
                </Button>
                <Highlight
                  code={formattedCode}
                  language="tsx"
                  theme={themes.oneDark}
                >
                  {({
                    className,
                    style,
                    tokens,
                    getLineProps,
                    getTokenProps,
                  }: any) => (
                    <pre
                      className={`${className} p-4 text-sm bg-gray-100 rounded-lg 
                      h-full md:max-h-[70vh] overflow-auto`}
                      style={style}
                    >
                      {tokens.map((line: any, i: number) => (
                        <div key={i} {...getLineProps({ line, key: i })}>
                          {line.map((token: any, key: any) => (
                            <span
                              key={key}
                              {...getTokenProps({ token, key })}
                            />
                          ))}
                        </div>
                      ))}
                    </pre>
                  )}
                </Highlight>
              </div>
            )}
            otherwise={() => (
              <div className="h-[50vh] flex justify-center items-center">
                <p>No form element selected yet.</p>
              </div>
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
