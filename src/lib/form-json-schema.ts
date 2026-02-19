import { z } from 'zod'
import { FormFieldType } from '@/types'

/** Schema for a single field as stored in JSON (no functions). */
const serializedFieldSchema = z.object({
  type: z.string().optional().default(''),
  variant: z.string(),
  name: z.string(),
  label: z.string(),
  placeholder: z.string().optional(),
  description: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  value: z.union([
    z.string(),
    z.boolean(),
    z.number(),
    z.array(z.string()),
  ]).optional(),
  checked: z.boolean().optional().default(true),
  rowIndex: z.number().optional(),
  required: z.boolean().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  locale: z.string().optional(),
  hour12: z.boolean().optional(),
  className: z.string().optional(),
}).passthrough()

/** Schema for form export: array of single fields or groups (array of fields). */
export const formFieldsJsonSchema = z.array(
  z.union([
    serializedFieldSchema,
    z.array(serializedFieldSchema),
  ])
)

export type SerializedFormField = z.infer<typeof serializedFieldSchema>

const noop = () => {}
const noopWithValue = (_: string | string[] | boolean | Date | number | number[]) => {}

/** Hydrate a serialized field into full FormFieldType (adds stub functions). */
function hydrateField(raw: SerializedFormField, rowIndex: number): FormFieldType {
  const value = raw.value ?? ''
  return {
    type: raw.type ?? '',
    variant: raw.variant,
    name: raw.name,
    label: raw.label,
    placeholder: raw.placeholder,
    description: raw.description,
    disabled: raw.disabled ?? false,
    value: value as FormFieldType['value'],
    setValue: noop,
    checked: raw.checked ?? true,
    onChange: noopWithValue,
    onSelect: noopWithValue,
    rowIndex: raw.rowIndex ?? rowIndex,
    required: raw.required,
    min: raw.min,
    max: raw.max,
    step: raw.step,
    locale: raw.locale as FormFieldType['locale'],
    hour12: raw.hour12,
    className: raw.className,
  }
}

/** Parse and validate JSON string; return hydrated FormFieldOrGroup[] or throw. */
export function parseAndValidateFormJson(jsonString: string): (FormFieldType | FormFieldType[])[] {
  let data: unknown
  try {
    data = JSON.parse(jsonString)
  } catch {
    throw new Error('Invalid JSON: could not parse.')
  }
  const parsed = formFieldsJsonSchema.safeParse(data)
  if (!parsed.success) {
    const first = parsed.error.errors[0]
    const path = first.path.length ? ` at ${first.path.join('.')}` : ''
    throw new Error(`Invalid form JSON${path}: ${first.message}`)
  }
  return parsed.data.map((item, rowIndex) => {
    if (Array.isArray(item)) {
      return item.map((f) => hydrateField(f, rowIndex))
    }
    return hydrateField(item, rowIndex)
  })
}
