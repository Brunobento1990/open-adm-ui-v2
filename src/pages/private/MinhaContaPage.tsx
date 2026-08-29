import { Box, Paper, Tab, Tabs } from '@mui/material'
import { useState } from 'react'
import { MinhaContaTab } from './minhaConta/MinhaContaTab'
import { MinhasSessoesTab } from './minhaConta/MinhasSessoesTab'

enum MinhaContaPageTab {
  Conta = 'conta',
  Sessoes = 'sessoes',
}

export function MinhaContaPage() {
  const [tab, setTab] = useState(MinhaContaPageTab.Conta)

  return (
    <Box
      sx={{
        height: '100%',
        minWidth: 0,
        overflowY: 'auto',
        width: '100%',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
          p: { xs: 2, md: 2.5 },
          width: '100%',
        }}
      >
        <Box sx={{ mb: { xs: 2.5, md: 3 }, width: { xs: '100%', md: 'fit-content' } }}>
          <Tabs
            value={tab}
            onChange={(_, value: MinhaContaPageTab) => setTab(value)}
            sx={{
              width: { xs: '100%', md: 'auto' },
              '& .MuiTab-root': {
                flex: { xs: 1, md: '0 0 auto' },
                minWidth: { xs: 0, md: 120 },
                px: { xs: 1, md: 2 },
              },
            }}
          >
            <Tab label="Minha conta" value={MinhaContaPageTab.Conta} />
            <Tab label="Minhas sessões" value={MinhaContaPageTab.Sessoes} />
          </Tabs>
        </Box>

        {tab === MinhaContaPageTab.Conta && <MinhaContaTab />}
        {tab === MinhaContaPageTab.Sessoes && <MinhasSessoesTab />}
      </Paper>
    </Box>
  )
}
