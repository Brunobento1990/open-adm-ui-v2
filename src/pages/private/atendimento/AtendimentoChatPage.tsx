import { Box } from '@mui/material'
import { useState } from 'react'
import { useThemeApp } from '../../../hook/useThemeApp'
import type { ChatViewModel } from '../../../types/AtendimentoChatTypes'
import { ContatoContextSidebar } from './ContatoContextSidebar'
import { EnviarMensagemChat } from './EnviarMensagemChat'
import { HeaderChat } from './HeaderChat'
import { MensagensChat } from './MensagensChat'
import { ModalConexaoWhatsApp } from './ModalConexaoWhatsApp'
import { SidebarChat } from './SidebarChat'
import { useAtendimentoChatController } from './useAtendimentoChatController'

export function AtendimentoChatPage() {
  const [detalhesContatoAberto, setDetalhesContatoAberto] = useState(false)
  const {
    atualizarChatMensagem,
    apagarMensagem,
    cancelarMensagemResposta,
    cancelarEdicaoMensagem,
    chats,
    conexaoWhatsApp,
    fecharModalConexaoWhatsApp,
    mensagens,
    mensagemEdicao,
    mensagemResposta,
    modalConexaoWhatsAppAberto,
    obterChatsLoading,
    obterMensagensLoading,
    perfilWhatsApp,
    selectedChat,
    selecionarChat,
    editarMensagemLoading,
    iniciarEdicaoMensagem,
    responderMensagem,
    salvarEdicaoMensagem,
  } = useAtendimentoChatController()
  const { backgroundColor, cores } = useThemeApp()
  const detalhesContatoVisivel = detalhesContatoAberto && Boolean(selectedChat)

  function selecionarChatAtendimento(chat: ChatViewModel) {
    setDetalhesContatoAberto(false)
    selecionarChat(chat)
  }

  return (
    <>
      <Box
        sx={{
          backgroundColor: backgroundColor.card,
          borderTop: `1px solid ${cores.dividerSoft}`,
          display: 'grid',
          flex: 1,
          gridTemplateColumns: {
            xs: '1fr',
            lg: '328px minmax(0, 1fr)',
            xl: detalhesContatoVisivel ? '328px minmax(0, 1fr) 280px' : '328px minmax(0, 1fr)',
          },
          height: '100%',
          minHeight: 0,
          overflow: 'hidden',
          transition: 'grid-template-columns 180ms ease',
        }}
      >
        <SidebarChat
          chats={chats}
          loading={obterChatsLoading}
          perfilWhatsApp={perfilWhatsApp}
          selectedChat={selectedChat}
          onSelectChat={selecionarChatAtendimento}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <HeaderChat
            detalhesContatoAberto={detalhesContatoVisivel}
            selectedChat={selectedChat}
            onToggleDetalhesContato={() => setDetalhesContatoAberto((abertoAtual) => !abertoAtual)}
          />
          <Box
            sx={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              minHeight: 0,
              overflow: 'hidden',
            }}
          >
            <MensagensChat
              loading={obterMensagensLoading}
              mensagens={mensagens}
              onApagarMensagem={apagarMensagem}
              onEditarMensagem={iniciarEdicaoMensagem}
              onResponderMensagem={responderMensagem}
              selectedChat={selectedChat}
            />
            <EnviarMensagemChat
              chatId={selectedChat?.id}
              chatSelecionado={selectedChat}
              atualizarChatMensagem={atualizarChatMensagem}
              editarMensagemLoading={editarMensagemLoading}
              mensagemEdicao={mensagemEdicao}
              mensagemResposta={mensagemResposta}
              onCancelarEdicaoMensagem={cancelarEdicaoMensagem}
              onCancelarMensagemResposta={cancelarMensagemResposta}
              onSalvarEdicaoMensagem={salvarEdicaoMensagem}
            />
          </Box>
        </Box>

        {detalhesContatoVisivel && (
          <ContatoContextSidebar
            selectedChat={selectedChat}
            onClose={() => setDetalhesContatoAberto(false)}
          />
        )}
      </Box>

      <ModalConexaoWhatsApp
        base64={conexaoWhatsApp?.base64}
        open={modalConexaoWhatsAppAberto}
        pairingCode={conexaoWhatsApp?.pairingCode}
        onClose={fecharModalConexaoWhatsApp}
      />
    </>
  )
}
