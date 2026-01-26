import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import React from 'react'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { capitaliseFirstLetter } from '@/utilities/capitaliseFirstLetter'
import { cn } from '@/utilities/cn'
import { Width } from '../Width'

const INPUT_CLASS = cn(
  'flex-1 rounded-full px-4 py-3',
  'placeholder:text-muted-foreground text-foreground',
  'bg-white/60',
  'focus:outline-none focus:ring-2 focus:ring-accent',
)

export const Text: React.FC<
  TextField & {
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
    register: UseFormRegister<FieldValues>
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
  width,
  inputPlaceholder,
  disabled,
}) => {
  return (
    <Width width={width}>
      <FormItem>
        {/*<Label htmlFor={name}>{label}</Label>*/}

        <Input
          defaultValue={defaultValue}
          id={name}
          type="text"
          disabled={disabled}
          placeholder={label ?? inputPlaceholder}
          className={INPUT_CLASS}
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
