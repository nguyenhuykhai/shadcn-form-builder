import React from 'react'

import { Button } from '@/components/ui/button'
import { fieldTypes } from '@/constants'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'

type FieldSelectorProps = {
  addFormField: (variant: string, index?: number) => void
}

export const FieldSelector: React.FC<FieldSelectorProps> = ({
  addFormField,
}) => {
  return (
    <div
      className={cn(
        'rounded-xl border border-border/80 bg-muted/30 py-3',
        'flex flex-col w-full min-w-0',
        'md:w-[220px] md:shrink-0 md:max-h-[75vh]',
      )}
    >
      <div
        className={cn(
          'overflow-y-auto overflow-x-hidden px-2',
          'flex flex-wrap gap-2 md:flex-col md:flex-nowrap md:gap-1.5',
        )}
      >
        {fieldTypes.map((variant) => (
          <Button
            key={variant.name}
            variant="ghost"
            onClick={() => addFormField(variant.name, variant.index ?? 0)}
            className={cn(
              'h-9 rounded-lg justify-start px-3 font-normal',
              'text-muted-foreground hover:text-foreground hover:bg-background',
              'border border-transparent hover:border-border/60',
              'transition-colors shrink-0',
              'md:w-full',
            )}
            size="sm"
          >
            <Plus className="h-3.5 w-3.5 mr-2 shrink-0 opacity-70" />
            <span className="truncate">{variant.name}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
