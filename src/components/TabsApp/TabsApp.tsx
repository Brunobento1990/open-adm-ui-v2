import { Tab, Tabs } from '@mui/material'

type TabsAppItem = {
  label: string
  value: number
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
        <Tab key={item.value} label={item.label} value={item.value} />
      ))}
    </Tabs>
  )
}
