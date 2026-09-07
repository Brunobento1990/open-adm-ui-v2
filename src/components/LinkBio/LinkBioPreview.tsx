import { useThemeApp } from '../../hook/useThemeApp'
import type { LinkBioItem } from '../../types/LinkBioTypes'
import { AvatarApp } from '../AvatarApp/AvatarApp'
import { BoxApp } from '../BoxApp/BoxApp'
import {
  BoxAppAlignItems,
  BoxAppDisplay,
  BoxAppFlexDirection,
  BoxAppOverflow,
} from '../BoxApp/boxAppTypes'
import { ButtonApp } from '../ButtonApp/ButtonApp'
import { IconApp } from '../Icon/IconApp'
import { TextApp, TextAppAlign, TextAppColor, TextAppWeight } from '../TextApp/TextApp'

type LinkBioPreviewProps = {
  ativo: boolean
  corDeFundo?: string
  corPrincipal?: string
  descricao?: string
  backgroundImage?: string
  links: LinkBioItem[]
  logo?: string
  nomeEmpresa?: string
  titulo: string
}

function formatarLogo(logo?: string) {
  if (!logo || logo.startsWith('data:')) return logo
  return `data:image/png;base64,${logo}`
}

export function LinkBioPreview({
  ativo,
  corDeFundo,
  corPrincipal,
  descricao,
  backgroundImage,
  links,
  logo,
  nomeEmpresa,
  titulo,
}: LinkBioPreviewProps) {
  const { backgroundColor, borderRadius, cores } = useThemeApp()
  const fundo = corDeFundo || backgroundColor.default
  const principal = corPrincipal || cores.primary
  const linksAtivos = links.filter((link) => link.ativo).sort((a, b) => a.ordem - b.ordem)

  return (
    <BoxApp
      backgroundColor={fundo}
      border={`8px solid ${cores.divider}`}
      borderRadius="32px"
      boxSizing="border-box"
      minHeight="560px"
      mx="auto"
      overflow={BoxAppOverflow.Hidden}
      p={3}
      sx={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        maxWidth: 360,
      }}
      width="100%"
    >
      <BoxApp
        alignItems={BoxAppAlignItems.Center}
        display={BoxAppDisplay.Flex}
        flexDirection={BoxAppFlexDirection.Column}
        gap={1.5}
        minHeight="100%"
        pt={2}
      >
        <AvatarApp
          alt={nomeEmpresa || 'Empresa'}
          src={formatarLogo(logo)}
          sx={{ bgcolor: principal, height: 80, width: 80 }}
        />
        {nomeEmpresa && (
          <TextApp align={TextAppAlign.Center} fontSize="1.05rem" weight={TextAppWeight.Bold}>
            {nomeEmpresa}
          </TextApp>
        )}
        <TextApp align={TextAppAlign.Center} fontSize="1.35rem" weight={TextAppWeight.Bold}>
          {titulo || 'Título da página'}
        </TextApp>
        {descricao && <TextApp align={TextAppAlign.Center}>{descricao}</TextApp>}
        {!ativo && (
          <TextApp align={TextAppAlign.Center} color={TextAppColor.Secondary}>
            Página inativa
          </TextApp>
        )}
        <BoxApp
          display={BoxAppDisplay.Flex}
          flexDirection={BoxAppFlexDirection.Column}
          gap={1.25}
          mt={2}
          width="100%"
        >
          {linksAtivos.length === 0 ? (
            <TextApp align={TextAppAlign.Center} color={TextAppColor.Secondary}>
              Nenhum link ativo
            </TextApp>
          ) : (
            linksAtivos.map((link) => (
              <ButtonApp
                fullWidth
                key={link.id}
                startIcon={link.icone ? <IconApp icon={link.icone} width="1.2rem" /> : undefined}
                sx={{
                  backgroundColor: principal,
                  borderRadius,
                  cursor: 'pointer',
                  color: 'common.white',
                  minHeight: 44,
                  '&:hover': {
                    backgroundColor: principal,
                    filter: 'brightness(0.9)',
                  },
                }}
              >
                {link.titulo}
              </ButtonApp>
            ))
          )}
        </BoxApp>
        <TextApp
          align={TextAppAlign.Center}
          color={TextAppColor.Secondary}
          fontSize="0.75rem"
          sx={{ mt: 'auto', pt: 3 }}
        >
          © {new Date().getFullYear()} {nomeEmpresa || 'Sua empresa'}. Todos os direitos reservados.
        </TextApp>
      </BoxApp>
    </BoxApp>
  )
}
