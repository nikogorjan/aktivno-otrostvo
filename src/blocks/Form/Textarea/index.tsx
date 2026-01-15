import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Textarea as TextAreaComponent } from '@/components/ui/textarea'
import React from 'react'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { capitaliseFirstLetter } from '@/utilities/capitaliseFirstLetter'
import { cn } from '@/utilities/cn'
import { Width } from '../Width'

const TEXTAREA_CLASS = cn(
  // match the pill style but keep textarea usable
  'w-full rounded-2xl px-4 py-3',
  'placeholder:text-muted-foreground text-foreground',
  'bg-white/60',
  'focus:outline-none focus:ring-2 focus:ring-accent',
)

export const Textarea: React.FC<
  TextField & {
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
    register: UseFormRegister<FieldValues>
    rows?: number
    inputPlaceholder?: string
    disabled?: boolean
  }
> = ({
  name,
  defaultValue,
  errors,
  label,
  register,
  required: requiredFromProps,
  rows = 3,
  width,
  inputPlaceholder,
  disabled,
}) => {
  return (
    <Width width={width}>
      <FormItem>
        {/*<Label htmlFor={name}>{label}</Label>*/}

        <TextAreaComponent
          defaultValue={defaultValue}
          id={name}
          rows={rows}
          disabled={disabled}
          placeholder={label ?? inputPlaceholder}
          className={TEXTAREA_CLASS}
          {...register(name, {
            required: requiredFromProps
              ? `${capitaliseFirstLetter(label || name)} is required.`
              : undefined,
          })}
        />

        {errors?.[name]?.message && typeof errors?.[name]?.message === 'string' && (
          <FormError message={errors?.[name]?.message} />
        )}
      </FormItem>
    </Width>
  )
}
