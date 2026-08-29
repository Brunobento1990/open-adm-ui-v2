import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { type ReactNode } from 'react';

interface propsDropDown {
  value?: any;
  onChange?: (key: string, newValue?: any) => void;
  label: string;
  keyLabel: string;
  size?: 'small' | 'medium';
  id: string;
  required?: boolean;
  helperText?: any;
  error?: boolean;
  values: any[];
  readonly?: boolean;
  width?: string;
  defaultValue?: any;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  renderOption?: (params: any, value: any) => ReactNode;
  desabilitarExclusao?: boolean;
  focus?: boolean;
  segundaKeyLabel?: string;
  startComponent?: ReactNode;
}

export function DropDownApp(props: propsDropDown) {
  function getByPath(obj: any, path?: string) {
    if (!obj || !path) return undefined;
    const keys = path.split('.');
    let current = obj;
    for (const k of keys) {
      if (current == null) return undefined;
      current = current[k];
    }
    return current;
  }
  function getLabel(value: any) {
    if (!value) return '';
    const primeira = getByPath(value, props.keyLabel);
    const segunda = getByPath(value, props.segundaKeyLabel);
    if (segunda) {
      return `${primeira ?? ''} - ${segunda}`;
    }
    if (primeira) {
      return primeira;
    }

    return '';
  }
  function renderOptions(params: any) {
    if (props.renderOption) {
      return props.renderOption(
        params,
        props.values[params['data-option-index']],
      );
    }
    return null;
  }

  const value = props.value
    ? {
      id: props.value.id,
      label: getLabel(props.value),
    }
    : null;

  return (
    <Autocomplete
      noOptionsText='Não há registros'
      sx={{
        width: props.width,
      }}
      disableClearable={props.desabilitarExclusao}
      onChange={(_, newValue: any, reason) => {
        const newV = reason !== 'clear' ? newValue : undefined;
        if (props.onChange) {
          props.onChange(props.id, newV?.id);
        }
      }}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      readOnly={props.readonly}
      fullWidth
      value={value}
      options={props.values.map((val) => {
        return {
          id: val.id,
          label: getLabel(val),
        };
      })}
      size={props.size ?? 'small'}
      renderOption={props.renderOption ? renderOptions : undefined}
      renderInput={(params) => (
        <TextField
          {...params}
          autoFocus={props.focus}
          label={props.label}
          required={props.required}
          helperText={props.helperText}
          error={props.error}
          disabled={props.readonly}
          onBlur={props.onBlur}
          slotProps={{
            input: {
              ...params.slotProps.input,
              startAdornment: (
                <>
                  {props.startComponent}
                  {params.slotProps.input.startAdornment}
                </>
              ),
            },
            inputLabel: params.slotProps.inputLabel,
            htmlInput: params.slotProps.htmlInput,
          }}
        />
      )}
    />
  );
}
