import { useEffect, useState } from 'react'
import { useApiLinkBio } from '../../../api/useApiLinkBio'
import { useApiParceiro } from '../../../api/useApiParceiro'
import { BoxApp } from '../../../components/BoxApp/BoxApp'
import {
  BoxAppAlignItems,
  BoxAppDisplay,
  BoxAppFlexDirection,
  BoxAppJustifyContent,
} from '../../../components/BoxApp/boxAppTypes'
import { ButtonApp, ButtonAppVariant } from '../../../components/ButtonApp/ButtonApp'
import { IconApp } from '../../../components/Icon/IconApp'
import { IconButtonComTolltip } from '../../../components/IconButtonComTolltip/IconButtonComTolltip'
import { ImageUploadApp } from '../../../components/ImageUploadApp/ImageUploadApp'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { LinkBioItemForm } from '../../../components/LinkBio/LinkBioItemForm'
import { LinkBioPreview } from '../../../components/LinkBio/LinkBioPreview'
import { ModalChildren } from '../../../components/Modal/ModalChildren'
import { PaperApp } from '../../../components/PaperApp/PaperApp'
import { SkeletonApp } from '../../../components/SkeletonApp/SkeletonApp'
import { TextApp, TextAppColor, TextAppWeight } from '../../../components/TextApp/TextApp'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useThemeApp } from '../../../hook/useThemeApp'
import { YupAdapter } from '../../../lib/YupAdapter'
import {
  LinkBioConfiguracaoFormField,
  type LinkBioConfiguracao,
  type LinkBioConfiguracaoForm,
  type LinkBioItem,
  type LinkBioItemCreatePayload,
} from '../../../types/LinkBioTypes'

const initialValues: LinkBioConfiguracaoForm = {
  ativo: true,
  corDeFundo: '',
  corPrincipal: '',
  descricao: '',
  id: '',
  titulo: '',
}

const validationSchema = new YupAdapter()
  .string(LinkBioConfiguracaoFormField.Titulo, 'Informe o título')
  .build()

export function LinkBioPage() {
  const api = useApiLinkBio()
  const { obter: obterParceiro } = useApiParceiro()
  const { isCelular } = useThemeApp()
  const [links, setLinks] = useState<LinkBioItem[]>([])
  const [logo, setLogo] = useState<string>()
  const [nomeEmpresa, setNomeEmpresa] = useState<string>()
  const [itemModal, setItemModal] = useState<LinkBioItem | null>()
  const [previewAberta, setPreviewAberta] = useState(false)
  const [itemParaExcluir, setItemParaExcluir] = useState<LinkBioItem>()

  const form = useFormikAdapter<LinkBioConfiguracaoForm>({
    initialValues,
    validationSchema,
    onSubmit: async (values: LinkBioConfiguracaoForm) => {
      const response = await api.salvarConfiguracao.fetch({
        ativo: values.ativo,
        corDeFundo: values.corDeFundo || undefined,
        corPrincipal: values.corPrincipal || undefined,
        descricao: values.descricao || undefined,
        backgroundImage: values.backgroundImage || undefined,
        titulo: values.titulo,
      })
      if (response)
        form.setValue({
          ...response,
          descricao: response.descricao ?? '',
          corDeFundo: response.corDeFundo ?? '',
          corPrincipal: response.corPrincipal ?? '',
          backgroundImage: response.backgroundImage ?? '',
        })
    },
  })

  function aplicarConfiguracao(configuracao: LinkBioConfiguracao) {
    const { links: linksDaConfiguracao, ...dadosDaConfiguracao } = configuracao
    form.setValue({
      ...dadosDaConfiguracao,
      corDeFundo: configuracao.corDeFundo ?? '',
      corPrincipal: configuracao.corPrincipal ?? '',
      descricao: configuracao.descricao ?? '',
      backgroundImage: configuracao.backgroundImage ?? '',
    })
    setLinks([...linksDaConfiguracao].sort((a, b) => a.ordem - b.ordem))
  }

  useEffect(() => {
    async function carregar() {
      const [configuracao, parceiro] = await Promise.all([
        api.obterConfiguracao.fetch(),
        obterParceiro.fetch(),
      ])
      if (configuracao) aplicarConfiguracao(configuracao)
      if (parceiro) {
        setLogo(parceiro.logo)
        setNomeEmpresa(parceiro.nomeFantasia)
      }
    }
    carregar()
    // Consultas exclusivas da montagem da página.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function recarregarConfiguracao() {
    const configuracao = await api.obterConfiguracao.fetch()
    if (configuracao) aplicarConfiguracao(configuracao)
  }

  async function salvarItem(values: LinkBioItemCreatePayload | LinkBioItem) {
    const response =
      'id' in values
        ? await api.editarLink.fetch(values)
        : await api.criarLink.fetch({
            ...values,
            ordem: Math.max(-1, ...links.map((link) => link.ordem)) + 1,
          })
    if (!response) return false
    setLinks((current) =>
      'id' in values
        ? current
            .map((link) => (link.id === response.id ? response : link))
            .sort((a, b) => a.ordem - b.ordem)
        : [...current, response].sort((a, b) => a.ordem - b.ordem),
    )
    setItemModal(undefined)
    return true
  }

  async function confirmarExclusao() {
    if (!itemParaExcluir || !(await api.excluirLink.fetch(itemParaExcluir.id))) return
    setLinks((current) => current.filter((link) => link.id !== itemParaExcluir.id))
    setItemParaExcluir(undefined)
  }

  async function alterarStatus(item: LinkBioItem, ativo: boolean) {
    if (await api.alterarStatus.fetch(item.id, ativo)) {
      setLinks((current) =>
        current.map((link) => (link.id === item.id ? { ...link, ativo } : link)),
      )
    }
  }

  async function moverItem(index: number, deslocamento: -1 | 1) {
    const destino = index + deslocamento
    if (destino < 0 || destino >= links.length) return
    const atual = links[index]
    const outro = links[destino]
    const primeiraAlteracao = await api.alterarOrdem.fetch(atual.id, outro.ordem)
    const segundaAlteracao =
      primeiraAlteracao && (await api.alterarOrdem.fetch(outro.id, atual.ordem))
    if (!segundaAlteracao) {
      await recarregarConfiguracao()
      return
    }
    setLinks((current) =>
      current
        .map((link) => {
          if (link.id === atual.id) return { ...link, ordem: outro.ordem }
          if (link.id === outro.id) return { ...link, ordem: atual.ordem }
          return link
        })
        .sort((a, b) => a.ordem - b.ordem),
    )
  }

  const preview = (
    <LinkBioPreview
      ativo={form.values.ativo}
      corDeFundo={form.values.corDeFundo}
      corPrincipal={form.values.corPrincipal}
      descricao={form.values.descricao}
      backgroundImage={form.values.backgroundImage}
      links={links}
      logo={logo}
      nomeEmpresa={nomeEmpresa}
      titulo={form.values.titulo}
    />
  )
  const linksLoading =
    api.criarLink.loading ||
    api.editarLink.loading ||
    api.excluirLink.loading ||
    api.alterarStatus.loading ||
    api.alterarOrdem.loading

  if (api.obterConfiguracao.loading) {
    return <SkeletonApp height="100%" variant="rounded" width="100%" />
  }

  return (
    <FormRoot.Form
      footer={{
        children: (
          <ButtonApp onClick={() => setPreviewAberta(true)} variant={ButtonAppVariant.Outlined}>
            Visualizar
          </ButtonApp>
        ),
      }}
      loading={api.salvarConfiguracao.loading}
      responsiveMobileActions
      submit={form.onSubmit}
    >
      <BoxApp
        display={BoxAppDisplay.Grid}
        gap={2.5}
        sx={{ gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 390px' } }}
      >
        <BoxApp
          display={BoxAppDisplay.Flex}
          flexDirection={BoxAppFlexDirection.Column}
          gap={2}
          minWidth={0}
        >
          <PaperApp sx={{ boxShadow: 'none' }} variant="outlined">
            <TextApp fontSize="1.1rem" gutterBottom weight={TextAppWeight.SemiBold}>
              Configuração
            </TextApp>
            <FormRoot.FormRow>
              <FormRoot.FormItemRow sm={8} xs={12}>
                <InputApp
                  error={form.error(LinkBioConfiguracaoFormField.Titulo)}
                  focus
                  helperText={form.helperText(LinkBioConfiguracaoFormField.Titulo)}
                  id={LinkBioConfiguracaoFormField.Titulo}
                  label="Título"
                  maxLength={255}
                  onBlur={form.onBlur}
                  onChange={form.onChange}
                  required
                  value={form.values.titulo}
                />
              </FormRoot.FormItemRow>
              <FormRoot.FormItemRow sm={4} xs={12}>
                <InputApp
                  checked={form.values.ativo}
                  id={LinkBioConfiguracaoFormField.Ativo}
                  label="Página ativa"
                  onChange={form.onChange}
                  type={InputAppType.Checkbox}
                />
              </FormRoot.FormItemRow>
            </FormRoot.FormRow>
            <FormRoot.FormRow>
              <FormRoot.FormItemRow xs={12}>
                <InputApp
                  id={LinkBioConfiguracaoFormField.Descricao}
                  label="Descrição"
                  maxLength={500}
                  multiline
                  onBlur={form.onBlur}
                  onChange={form.onChange}
                  rows={3}
                  value={form.values.descricao}
                />
              </FormRoot.FormItemRow>
            </FormRoot.FormRow>
            <FormRoot.FormRow>
              <FormRoot.FormItemRow sm={6} xs={12}>
                <InputApp
                  id={LinkBioConfiguracaoFormField.CorDeFundo}
                  label="Cor de fundo"
                  onChange={form.onChange}
                  type={InputAppType.Color}
                  value={form.values.corDeFundo || '#ffffff'}
                />
              </FormRoot.FormItemRow>
              <FormRoot.FormItemRow sm={6} xs={12}>
                <InputApp
                  id={LinkBioConfiguracaoFormField.CorPrincipal}
                  label="Cor principal"
                  onChange={form.onChange}
                  type={InputAppType.Color}
                  value={form.values.corPrincipal || '#1976d2'}
                />
              </FormRoot.FormItemRow>
            </FormRoot.FormRow>
            <FormRoot.FormRow>
              <FormRoot.FormItemRow xs={12}>
                <ImageUploadApp
                  alt="Imagem de fundo da Link da Bio"
                  onChange={(backgroundImage) => form.setValue({ backgroundImage })}
                  previewLabel="Imagem de fundo"
                  value={form.values.backgroundImage}
                />
              </FormRoot.FormItemRow>
            </FormRoot.FormRow>
          </PaperApp>

          <PaperApp sx={{ boxShadow: 'none' }} variant="outlined">
            <BoxApp
              alignItems={BoxAppAlignItems.Center}
              display={BoxAppDisplay.Flex}
              justifyContent={BoxAppJustifyContent.SpaceBetween}
              mb={2}
            >
              <BoxApp>
                <TextApp fontSize="1.1rem" weight={TextAppWeight.SemiBold}>
                  Links
                </TextApp>
                <TextApp color={TextAppColor.Secondary}>
                  Use as setas para definir a ordem de exibição.
                </TextApp>
              </BoxApp>
              {isCelular ? (
                <IconButtonComTolltip
                  aria-label="Adicionar link"
                  disabled={!form.values.id}
                  onClick={() => setItemModal(null)}
                  sx={{ flexShrink: 0 }}
                  tooltip="Adicionar link"
                >
                  <IconApp icon="solar:add-circle-linear" />
                </IconButtonComTolltip>
              ) : (
                <ButtonApp
                  disabled={!form.values.id}
                  onClick={() => setItemModal(null)}
                  startIcon={<IconApp icon="solar:add-circle-linear" />}
                >
                  Adicionar
                </ButtonApp>
              )}
            </BoxApp>
            {!form.values.id && (
              <TextApp color={TextAppColor.Secondary}>
                Salve a configuração antes de adicionar o primeiro link.
              </TextApp>
            )}
            {form.values.id && links.length === 0 && (
              <TextApp color={TextAppColor.Secondary}>Nenhum link cadastrado.</TextApp>
            )}
            <BoxApp display={BoxAppDisplay.Flex} flexDirection={BoxAppFlexDirection.Column} gap={1}>
              {links.map((link, index) => (
                <BoxApp
                  alignItems={BoxAppAlignItems.Center}
                  border="1px solid"
                  borderColor="divider"
                  borderRadius="8px"
                  display={BoxAppDisplay.Flex}
                  gap={1}
                  key={link.id}
                  p={1.25}
                  sx={{
                    alignItems: { xs: 'stretch', sm: 'center' },
                    flexDirection: { xs: 'column', sm: 'row' },
                  }}
                >
                  <BoxApp
                    alignItems={BoxAppAlignItems.Center}
                    display={BoxAppDisplay.Flex}
                    flex={1}
                    gap={1}
                    minWidth={0}
                  >
                    {link.icone && <IconApp icon={link.icone} />}
                    <BoxApp minWidth={0}>
                      <TextApp noWrap weight={TextAppWeight.SemiBold}>
                        {link.titulo}
                      </TextApp>
                      <TextApp color={TextAppColor.Secondary} noWrap>
                        {link.url}
                      </TextApp>
                    </BoxApp>
                  </BoxApp>
                  <BoxApp
                    alignItems={BoxAppAlignItems.Center}
                    display={BoxAppDisplay.Flex}
                    gap={0.5}
                    sx={{
                      justifyContent: { xs: 'space-between', sm: 'flex-end' },
                      width: { xs: '100%', sm: 'auto' },
                    }}
                  >
                    <IconButtonComTolltip
                      aria-label="Mover link para cima"
                      disabled={index === 0 || linksLoading}
                      onClick={() => moverItem(index, -1)}
                      tooltip="Mover para cima"
                    >
                      <IconApp icon="solar:alt-arrow-up-linear" />
                    </IconButtonComTolltip>
                    <IconButtonComTolltip
                      aria-label="Mover link para baixo"
                      disabled={index === links.length - 1 || linksLoading}
                      onClick={() => moverItem(index, 1)}
                      tooltip="Mover para baixo"
                    >
                      <IconApp icon="solar:alt-arrow-down-linear" />
                    </IconButtonComTolltip>
                    <IconButtonComTolltip
                      aria-label={link.ativo ? 'Desativar link' : 'Ativar link'}
                      disabled={linksLoading}
                      onClick={() => alterarStatus(link, !link.ativo)}
                      tooltip={link.ativo ? 'Desativar' : 'Ativar'}
                    >
                      <IconApp
                        icon={link.ativo ? 'solar:eye-linear' : 'solar:eye-closed-linear'}
                      />
                    </IconButtonComTolltip>
                    <IconButtonComTolltip
                      aria-label="Editar link"
                      disabled={linksLoading}
                      onClick={() => setItemModal(link)}
                      tooltip="Editar"
                    >
                      <IconApp icon="solar:pen-linear" />
                    </IconButtonComTolltip>
                    <IconButtonComTolltip
                      aria-label="Excluir link"
                      color="error"
                      disabled={linksLoading}
                      onClick={() => setItemParaExcluir(link)}
                      tooltip="Excluir"
                    >
                      <IconApp icon="solar:trash-bin-trash-linear" />
                    </IconButtonComTolltip>
                  </BoxApp>
                </BoxApp>
              ))}
            </BoxApp>
          </PaperApp>
        </BoxApp>
        {!isCelular && (
          <PaperApp sx={{ boxShadow: 'none' }} variant="outlined">
            <TextApp fontSize="1.1rem" gutterBottom weight={TextAppWeight.SemiBold}>
              Pré-visualização
            </TextApp>
            {preview}
          </PaperApp>
        )}
      </BoxApp>

      <ModalChildren
        close={() => setItemModal(undefined)}
        fullWidth
        maxWidth="sm"
        open={itemModal !== undefined}
        retirarFooter
        titulo={itemModal ? 'Editar link' : 'Adicionar link'}
      >
        <LinkBioItemForm
          initialItem={itemModal ?? undefined}
          loading={api.criarLink.loading || api.editarLink.loading}
          onConfirmar={salvarItem}
        />
      </ModalChildren>
      <ModalChildren
        close={() => setPreviewAberta(false)}
        fullWidth
        maxWidth="sm"
        open={previewAberta}
        retirarFooter
        titulo="Pré-visualização"
      >
        {preview}
      </ModalChildren>
      <ModalChildren
        close={() => setItemParaExcluir(undefined)}
        footerChildren={
          <>
            <ButtonApp
              onClick={() => setItemParaExcluir(undefined)}
              variant={ButtonAppVariant.Outlined}
            >
              Cancelar
            </ButtonApp>
            <ButtonApp loading={api.excluirLink.loading} onClick={confirmarExclusao}>
              Excluir
            </ButtonApp>
          </>
        }
        maxWidth="xs"
        open={Boolean(itemParaExcluir)}
        titulo="Confirmar exclusão"
      >
        <TextApp>Deseja excluir o link “{itemParaExcluir?.titulo}”?</TextApp>
      </ModalChildren>
    </FormRoot.Form>
  )
}
