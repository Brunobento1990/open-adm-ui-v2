export const componentsOverrides = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        backgroundImage: 'none',
      },
    },
  },
  MuiTypography: {
    defaultProps: {
      variantMapping: {
        body1: 'label',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        height: '30px',
        padding: '0.2rem 1rem',
        fontSize: '0.875rem',
        textTransform: 'none',
      },
      contained: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        '&.MuiOutlinedInput-root': {
          padding: '0px 0px 0px 0.5rem',
          minHeight: '36px',
          fontSize: '0.875rem',
          borderRadius: '8px',
          '& .MuiSelect-select': {
            minHeight: '36px',
            padding: '0.2rem',
          },
        },
        '&.MuiStandardInput-root': {
          padding: '0px 0px 0px 0.5rem',
          minHeight: '36px',
          fontSize: '0.875rem',
          '& .MuiSelect-select': {
            minHeight: '36px',
            padding: '0.2rem',
          },
        },
        '& .MuiInputAdornment-root': {
          marginRight: '0.5rem',
        },
      },
      input: {
        '&.MuiOutlinedInput-input': {
          padding: '0.2rem',
        },
        '&.MuiStandardInput-input': {
          padding: '0.2rem',
        },
      },
    },
  },
  MuiSelect: {
    styleOverrides: {
      select: {
        minHeight: '36px',
        '&.MuiOutlinedInput-input': {
          padding: '0.2rem',
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          minHeight: '36px',
          borderRadius: '8px',
        },
        '&.MuiStandardInput-root': {
          minHeight: '36px',
        },
        '& .MuiInputLabel-root': {
          fontSize: '0.875rem',
          transform: 'translate(14px, 6px) scale(1)',
          '&[data-shrink="true"]': {
            transform: 'translate(14px, -7px) scale(0.75)',
          },
        },
      },
    },
  },
  MuiAutocomplete: {
    styleOverrides: {
      root: {
        '&.MuiOutlinedInput-root': {
          padding: '0px 0px 0px 0.5rem',
          minHeight: '36px',
          fontSize: '0.875rem',
          borderRadius: '8px',
          '& .MuiSelect-select': {
            minHeight: '36px',
            padding: '0.2rem',
          },
        },
        '& .MuiInputLabel-root': {
          fontSize: '0.875rem',
          transform: 'translate(14px, 6px) scale(1)',
          '&[data-shrink="true"]': {
            transform: 'translate(14px, -7px) scale(0.75)',
          },
        },
      },
      input: {
        padding: '0px 0px 0px 0.5rem',
      },
      inputRoot: {
        minHeight: '36px',
        padding: '0.2rem !important',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
      rounded: {
        borderRadius: '8px',
      },
    },
  },
}
