import { Checkbox, FormControlLabel, InputAdornment, MenuItem, TextField } from '@mui/material'
import type { FocusEvent, ReactNode } from 'react'
import { InputAppType } from './inputAppTypes'

type InputAppTipoTexto = Exclude<InputAppType, InputAppType.Checkbox | InputAppType.Select>

type InputAppDesfoque = FocusEvent<HTMLElement>
type InputAppValor = string | number | boolean
type InputAppSelectOption = {
  label: ReactNode
  value: string | number
}

type InputAppBaseProps = {
  id?: string
  label?: ReactNode
  name?: string
  type?: InputAppType
  required?: boolean
  disabled?: boolean
  autoComplete?: string
  placeholder?: string
  multiline?: boolean
  maxLength?: number
  rows?: number
  fullWidth?: boolean
  focus?: boolean
  value?: string | number
  checked?: boolean
  error?: boolean
  helperText?: ReactNode
  startAdornment?: ReactNode
  options?: InputAppSelectOption[]
  onChange?: (id: string, value?: InputAppValor) => void | Promise<void>
  onBlur?: (event: InputAppDesfoque) => void
}

type InputAppTextoProps = InputAppBaseProps & {
  type?: InputAppTipoTexto
  value?: string | number
}

type InputAppCheckboxProps = InputAppBaseProps & {
  type: InputAppType.Checkbox
  checked?: boolean
}

type InputAppSelectProps = InputAppBaseProps & {
  type: InputAppType.Select
  options: InputAppSelectOption[]
  value?: string | number
}

export type InputAppProps = InputAppTextoProps | InputAppCheckboxProps | InputAppSelectProps

type InputAppRenderProps = InputAppBaseProps & {
  type?: InputAppType
}

type InputAppRender = (props: InputAppRenderProps) => ReactNode

const CurrencyLocale = 'pt-BR'
const currencyFormatter = new Intl.NumberFormat(CurrencyLocale, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function renderCurrencyField({
  fullWidth = true,
  label,
  disabled,
  error,
  focus,
  autoComplete,
  helperText,
  id,
  name,
  onChange,
  onBlur,
  placeholder,
  required,
  startAdornment,
  value,
}: InputAppRenderProps) {
  const fieldId = id ?? name
  const formattedValue = value === '' || value === undefined
    ? ''
    : currencyFormatter.format(Number(value))

  return (
    <TextField
      autoComplete={autoComplete}
      autoFocus={focus}
      disabled={disabled}
      error={error}
      fullWidth={fullWidth}
      helperText={helperText}
      id={id}
      label={label}
      name={name}
      onBlur={onBlur}
      onChange={(event) => {
        if (!fieldId) return
        const digits = event.target.value.replace(/\D/g, '')
        onChange?.(fieldId, digits ? Number(digits) / 100 : '')
      }}
      placeholder={placeholder}
      required={required}
      size="small"
      slotProps={{
        htmlInput: { inputMode: 'numeric' },
        input: startAdornment
          ? {
              startAdornment: (
                <InputAdornment position="start">{startAdornment}</InputAdornment>
              ),
            }
          : undefined,
      }}
      type="text"
      value={formattedValue}
    />
  )
}

function renderTextField(inputType: InputAppTipoTexto): InputAppRender {
  return ({
    fullWidth = true,
    label,
    disabled,
    error,
    focus,
    autoComplete,
    helperText,
    id,
    name,
    onChange,
    onBlur,
    placeholder,
    required,
    multiline,
    maxLength,
    rows,
    value,
    startAdornment,
  }) => {
    const fieldId = id ?? name

    return (
      <TextField
        autoComplete={autoComplete}
        autoFocus={focus}
        disabled={disabled}
        error={error}
        fullWidth={fullWidth}
        helperText={helperText}
        id={id}
        label={label}
        multiline={multiline}
        name={name}
        onBlur={onBlur}
        onChange={(event) => {
          if (fieldId) onChange?.(fieldId, event.target.value)
        }}
        placeholder={placeholder}
        required={required}
        rows={rows}
        size="small"
        slotProps={{
          htmlInput: {
            maxLength,
          },
          input: startAdornment
            ? {
                startAdornment: (
                  <InputAdornment position="start">{startAdornment}</InputAdornment>
                ),
              }
            : undefined,
        }}
        type={inputType}
        value={value}
      />
    )
  }
}

const renderizadores: Record<InputAppType, InputAppRender> = {
  [InputAppType.Text]: renderTextField(InputAppType.Text),
  [InputAppType.Email]: renderTextField(InputAppType.Email),
  [InputAppType.Password]: renderTextField(InputAppType.Password),
  [InputAppType.Number]: renderTextField(InputAppType.Number),
  [InputAppType.Currency]: renderCurrencyField,
  [InputAppType.Date]: renderTextField(InputAppType.Date),
  [InputAppType.Search]: renderTextField(InputAppType.Search),
  [InputAppType.Tel]: renderTextField(InputAppType.Tel),
  [InputAppType.Url]: renderTextField(InputAppType.Url),
  [InputAppType.Select]: ({
    disabled,
    error,
    focus,
    fullWidth = true,
    helperText,
    id,
    label,
    name,
    onBlur,
    onChange,
    options,
    required,
    value,
  }) => {
    const fieldId = id ?? name

    return (
      <TextField
        autoFocus={focus}
        disabled={disabled}
        error={error}
        fullWidth={fullWidth}
        helperText={helperText}
        id={id}
        label={label}
        name={name}
        onBlur={onBlur}
        onChange={(event) => {
          if (fieldId) onChange?.(fieldId, event.target.value)
        }}
        required={required}
        select
        size="small"
        value={value}
      >
        {options?.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    )
  },
  [InputAppType.Checkbox]: ({
    checked,
    disabled,
    focus,
    id,
    label,
    name,
    onBlur,
    onChange,
    required,
  }) => {
    const fieldId = id ?? name

    return (
      <FormControlLabel
        label={label}
        control={
          <Checkbox
            autoFocus={focus}
            checked={checked}
            disabled={disabled}
            id={id}
            name={name}
            onBlur={onBlur}
            onChange={(event) => {
              if (fieldId) onChange?.(fieldId, event.target.checked)
            }}
            required={required}
          />
        }
      />
    )
  },
}

export function InputApp(props: InputAppProps) {
  const type = props.type ?? InputAppType.Text
  const renderizar = renderizadores[type]

  return renderizar({
    ...props,
    type,
  })
}
