import { useState } from 'react'
import { BoxApp } from '../../../components/BoxApp/BoxApp'
import {
  BoxAppAlignItems,
  BoxAppComponent,
  BoxAppDisplay,
  BoxAppJustifyContent,
} from '../../../components/BoxApp/boxAppTypes'
import {
  ButtonApp,
  ButtonAppColor,
  ButtonAppVariant,
} from '../../../components/ButtonApp/ButtonApp'
import { IconApp } from '../../../components/Icon/IconApp'
import { IconButtonComTolltip } from '../../../components/IconButtonComTolltip/IconButtonComTolltip'
import { ModalChildren } from '../../../components/Modal/ModalChildren'
import { PaperApp } from '../../../components/PaperApp/PaperApp'
import { TextApp, TextAppColor, TextAppWeight } from '../../../components/TextApp/TextApp'
import { useThemeApp } from '../../../hook/useThemeApp'
import type { TabelaDePrecoItem } from '../../../types/TabelaDePrecoTypes'
import { formatMoney } from '../../../utils/moneyUtils'

type Props = {
  item: TabelaDePrecoItem
  loading?: boolean
  onEditar?: () => void
  onExcluir?: () => Promise<boolean> | boolean
}

export function TabelaDePrecoItemCard({ item, loading, onEditar, onExcluir }: Props) {
  const [confirmarExclusao, setConfirmarExclusao] = useState(false)
  const { cores } = useThemeApp()
  const variacao = item.peso?.descricao ?? item.tamanho?.descricao ?? 'Sem peso/tamanho'

  async function excluir() {
    if (await onExcluir?.()) setConfirmarExclusao(false)
  }

  return (
    <>
      <PaperApp padding={1.5} sx={{ boxShadow: 'none' }} variant="outlined">
        <BoxApp
          alignItems={BoxAppAlignItems.Center}
          display={BoxAppDisplay.Flex}
          justifyContent={BoxAppJustifyContent.SpaceBetween}
          gap={1}
        >
          <BoxApp
            alignItems={BoxAppAlignItems.Center}
            display={BoxAppDisplay.Flex}
            gap={1.5}
            minWidth={0}
          >
            {item.produto?.foto ? (
              <BoxApp
                alt={item.produto.descricao}
                borderRadius={1}
                component={BoxAppComponent.Img}
                height={48}
                objectFit="cover"
                src={item.produto.foto}
                width={48}
              />
            ) : (
              <IconApp color={cores.primary} icon="solar:box-linear" width="2rem" />
            )}
            <BoxApp minWidth={0}>
              <TextApp weight={TextAppWeight.Bold}>
                {item.produto?.descricao ?? item.produtoId}
              </TextApp>
              {item.produto?.categoria?.descricao && (
                <TextApp color={TextAppColor.Secondary}>{item.produto.categoria.descricao}</TextApp>
              )}
              <TextApp color={TextAppColor.Secondary}>{variacao}</TextApp>
              <TextApp>
                Atacado: {formatMoney(item.valorUnitarioAtacado)} · Varejo:{' '}
                {formatMoney(item.valorUnitarioVarejo)}
              </TextApp>
            </BoxApp>
          </BoxApp>
          {(onEditar || onExcluir) && (
            <BoxApp display={BoxAppDisplay.Flex}>
              {onEditar && (
                <IconButtonComTolltip disabled={loading} onClick={onEditar} tooltip="Editar item">
                  <IconApp icon="solar:pen-linear" />
                </IconButtonComTolltip>
              )}
              {onExcluir && (
                <IconButtonComTolltip
                  disabled={loading}
                  onClick={() => setConfirmarExclusao(true)}
                  tooltip="Excluir item"
                >
                  <IconApp color={cores.error} icon="solar:trash-bin-trash-linear" />
                </IconButtonComTolltip>
              )}
            </BoxApp>
          )}
        </BoxApp>
      </PaperApp>
      <ModalChildren
        close={() => setConfirmarExclusao(false)}
        footerChildren={
          <>
            <ButtonApp
              disabled={loading}
              onClick={() => setConfirmarExclusao(false)}
              variant={ButtonAppVariant.Outlined}
            >
              Cancelar
            </ButtonApp>
            <ButtonApp color={ButtonAppColor.Error} loading={loading} onClick={excluir}>
              Confirmar exclusão
            </ButtonApp>
          </>
        }
        fullWidth
        maxWidth="sm"
        open={confirmarExclusao}
        titulo="Confirmar exclusão do item"
      >
        <TextApp>
          Deseja realmente excluir “{item.produto?.descricao ?? 'este produto'}” da tabela de preço?
        </TextApp>
      </ModalChildren>
    </>
  )
}
