import { Box, Tab, Tabs, Tooltip } from '@mui/material'
import { IconApp } from '../Icon/IconApp'

type TabsAppItem = {
  label: string
  value: number
  warning?: boolean
  warningMessage?: string
}

type TabsAppProps = {
  ariaLabel: string
  items: TabsAppItem[]
  onChange: (value: number) => void
  value: number
}

export function TabsApp({ ariaLabel, items, onChange, value }: TabsAppProps) {
  return (
    <Tabs
      aria-label={ariaLabel}
      onChange={(_, newValue: number) => onChange(newValue)}
      sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      value={value}
    >
      {items.map((item) => (
        <Tab
          key={item.value}
          label={(
            <Box sx={{ alignItems: 'center', display: 'flex', gap: 0.75 }}>
              {item.label}
              {item.warning && (
                <Tooltip title={item.warningMessage ?? 'Há uma pendência nesta seção'}>
                  <Box component="span" sx={{ color: 'warning.main', display: 'inline-flex' }}>
                    <IconApp icon="solar:danger-triangle-bold" width="1rem" />
                  </Box>
                </Tooltip>
              )}
            </Box>
          )}
          value={item.value}
        />
      ))}
    </Tabs>
  )
}
