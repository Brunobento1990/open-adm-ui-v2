import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'

export type RadioAppOption<T extends string | number> = {
  label: string
  value: T
}

type RadioAppProps<T extends string | number> = {
  id: string
  label?: string
  onChange: (id: string, value: T) => void
  options: RadioAppOption<T>[]
  row?: boolean
  value?: T
}

export function RadioApp<T extends string | number>({
  id,
  label,
  onChange,
  options,
  row,
  value,
}: RadioAppProps<T>) {
  return (
    <FormControl>
      {label && <FormLabel id={`${id}-label`}>{label}</FormLabel>}
      <RadioGroup
        aria-labelledby={label ? `${id}-label` : undefined}
        name={id}
        onChange={(event) => {
          const option = options.find((item) => String(item.value) === event.target.value)
          if (option) onChange(id, option.value)
        }}
        row={row}
        value={value ?? ''}
      >
        {options.map((option) => (
          <FormControlLabel
            control={<Radio />}
            key={option.value}
            label={option.label}
            value={option.value}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}
