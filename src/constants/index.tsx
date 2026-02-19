import { FieldType } from '@/types'

export const FORM_LIBRARIES = {
  REACT_HOOK_FORM: 'react-hook-form',
  TANSTACK_FORM: 'tanstack-form',
  BRING_YOUR_OWN: 'bring-your-own',
} as const

export type FormLibrary = typeof FORM_LIBRARIES[keyof typeof FORM_LIBRARIES]

export const FORM_LIBRARY_LABELS = {
  [FORM_LIBRARIES.REACT_HOOK_FORM]: 'React Hook Form',
  [FORM_LIBRARIES.TANSTACK_FORM]: 'TanStack Form',
  [FORM_LIBRARIES.BRING_YOUR_OWN]: 'Bring Your Own Form',
}

export const fieldTypes: FieldType[] = [
  { name: 'Checkbox' },
  { name: 'Combobox' },
  { name: 'Date Picker' },
  { name: 'Datetime Picker' },
  { name: 'File Input' },
  { name: 'Input' },
  { name: 'Input OTP' },
  { name: 'Location Input' },
  { name: 'Multi Select' },
  { name: 'Password' },
  { name: 'Phone' },
  { name: 'Select' },
  { name: 'Signature Input' },
  { name: 'Signature Pad' },
  { name: 'Slider' },
  { name: 'Smart Datetime Input' },
  { name: 'Switch' },
  { name: 'Tags Input' },
  { name: 'Textarea' },
  { name: 'Rating' },
  { name: 'RadioGroup' },
  { name: 'Credit Card' },
]

export const defaultFieldConfig: Record<
  string,
  { label: string; description: string; placeholder?: any }
> = {
  Checkbox: {
    label: 'Use different settings for my mobile devices',
    description:
      'You can manage your mobile notifications in the mobile settings page.',
  },
  Combobox: {
    label: 'Language',
    description: 'This is the language that will be used in the dashboard.',
  },
  'Date Picker': {
    label: 'Date of birth',
    description: 'Your date of birth is used to calculate your age.',
  },
  'Datetime Picker': {
    label: 'Submission Date',
    description: 'Add the date of submission with detailly.',
  },
  'File Input': {
    label: 'Select File',
    description: 'Select a file to upload.',
  },
  Input: {
    label: 'Username',
    description: 'This is your public display name.',
    placeholder: 'shadcn',
  },
  'Input OTP': {
    label: 'One-Time Password',
    description: 'Please enter the one-time password sent to your phone.',
  },
  'Location Input': {
    label: 'Select Country',
    description:
      'If your country has states, it will be appear after selecting country',
  },
  'Multi Select': {
    label: 'Select your framework',
    description: 'Select multiple options.',
  },
  Select: {
    label: 'Email',
    description: 'You can manage email addresses in your email settings.',
    placeholder: 'Select a verified email to display',
  },
  Slider: {
    label: 'Set Price Range',
    description: 'Adjust the price by sliding.',
  },
  'Signature Input': {
    label: 'Sign here',
    description: 'Please provide your signature above',
  },
  'Signature Pad': {
    label: 'Your Signature',
    description: 'Click the pen button to sign',
  },
  'Smart Datetime Input': {
    label: "What's the best time for you?",
    description: 'Please select the full time',
  },
  Switch: {
    label: 'Marketing emails',
    description: 'Receive emails about new products, features, and more.',
  },
  'Tags Input': { label: 'Enter your tech stack.', description: 'Add tags.' },
  Textarea: {
    label: 'Bio',
    description: 'You can @mention other users and organizations.',
  },
  Password: {
    label: 'Password',
    description: 'Enter your password.',
  },
  Phone: {
    label: 'Phone number',
    description: 'Enter your phone number.',
  },
  Rating: {
    label: 'Rating',
    description: 'Please provide your rating.',
  },
  RadioGroup: {
    label: 'Gender',
    description: 'Select your gender',
  },
  'Credit Card': {
    label: 'Credit Card Information',
    description: 'Enter your credit card details for payment.',
  },
}
