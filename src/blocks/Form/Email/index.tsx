import type { EmailField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import React from 'react'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { capitaliseFirstLetter } from '@/utilities/capitaliseFirstLetter'
import { cn } from '@/utilities/cn'
import { Width } from '../Width'

const INPUT_CLASS = cn(
  'flex-1 rounded-full px-4 py-3 h-full',
  'placeholder:text-muted-foreground text-foreground',
  'bg-white/60',
  'focus:outline-none focus:ring-2 focus:ring-accent',
)

export const Email: React.FC<
  EmailField & {
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
  const placeholder =
    (typeof inputPlaceholder === 'string' && inputPlaceholder.trim() ? inputPlaceholder : undefined) ??
    (typeof label === 'string' && label.trim() ? label : undefined) ??
    ''

  return (
    <Width width={width}>
      <FormItem>
        <Input
          defaultValue={defaultValue}
          id={name}
          type="email"
          disabled={disabled}
          placeholder={placeholder}
          className={INPUT_CLASS}
          {...register(name, {
            pattern: /^\S[^\s@]*@\S+$/,
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
