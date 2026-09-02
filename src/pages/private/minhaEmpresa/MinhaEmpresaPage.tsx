import { useEffect, useState } from 'react'
import { useApiCep } from '../../../api/useApiCep'
import { useApiParceiro } from '../../../api/useApiParceiro'
import { BoxApp } from '../../../components/BoxApp/BoxApp'
import {
  BoxAppAlignItems,
  BoxAppDisplay,
  BoxAppJustifyContent,
} from '../../../components/BoxApp/boxAppTypes'
import {
  ButtonApp,
  ButtonAppColor,
  ButtonAppVariant,
} from '../../../components/ButtonApp/ButtonApp'
import { CepConsultaButton } from '../../../components/CepConsultaButton/CepConsultaButton'
import { DividerApp } from '../../../components/DividerApp/DividerApp'
import { RedeSocialDropDown } from '../../../components/DropDown/RedeSocialDropDown'
import { IconApp } from '../../../components/Icon/IconApp'
import { IconButtonComTolltip } from '../../../components/IconButtonComTolltip/IconButtonComTolltip'
import { ImageUploadApp } from '../../../components/ImageUploadApp/ImageUploadApp'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { ModalChildren } from '../../../components/Modal/ModalChildren'
import { ProgressApp } from '../../../components/ProgressApp/ProgressApp'
import { TextApp, TextAppWeight } from '../../../components/TextApp/TextApp'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useThemeApp } from '../../../hook/useThemeApp'
import { YupAdapter } from '../../../lib/YupAdapter'
import {
  EnderecoParceiroField,
  ParceiroFormField,
  type Parceiro,
  type RedeSocialTipo,
} from '../../../types/ParceiroTypes'
import { limparCnpj, limparTelefone } from '../../../utils/documentUtils'
import { imagemBase64Valida, removerPrefixoBase64 } from '../../../utils/imageUtils'

const valoresIniciais: Parceiro = {
  razaoSocial: '',
  nomeFantasia: '',
  cnpj: '',
  logo: '',
  telefones: [],
  redesSociais: [],
}

const validacao = new YupAdapter()
  .string(ParceiroFormField.Cnpj)
  .string(ParceiroFormField.RazaoSocial)
  .string(ParceiroFormField.NomeFantasia)
  .build()

function formatarLogo(logo?: string) {
  if (!logo || logo.startsWith('data:')) return logo ?? ''
  return `data:image/png;base64,${logo}`
}

enum TipoExclusao {
  RedeSocial = 'redeSocial',
  Telefone = 'telefone',
}

type ExclusaoPendente = {
  index: number
  tipo: TipoExclusao
}

export function MinhaEmpresaPage() {
  const { editar, excluirRedeSocial, excluirTelefone, obter } = useApiParceiro()
  const { consultar } = useApiCep()
  const { borderRadius, cores } = useThemeApp()
  const [exclusaoPendente, setExclusaoPendente] = useState<ExclusaoPendente>()
  const form = useFormikAdapter<Parceiro>({
    initialValues: valoresIniciais,
    validationSchema: validacao,
    onSubmit: async (values: Parceiro) => {
      if (!imagemBase64Valida(values.logo)) {
        form.setError(ParceiroFormField.Logo, 'Não foi possível processar a imagem selecionada.')
        return
      }

      const response = await editar.fetch({
        razaoSocial: values.razaoSocial,
        nomeFantasia: values.nomeFantasia,
        cnpj: limparCnpj(values.cnpj),
        logo: values.logo ? removerPrefixoBase64(values.logo) : undefined,
        enderecoParceiro: values.enderecoParceiro,
        telefones: values.telefones
          .filter((item) => item.telefone)
          .map((item) => ({ ...item, telefone: limparTelefone(item.telefone) ?? '' })),
        redesSociais: values.redesSociais.filter((item) =>
          Boolean(item.link && item.redeSocialEnum),
        ),
      })
      if (response) form.setValue({ ...response, logo: formatarLogo(response.logo) })
    },
  })

  useEffect(() => {
    async function carregar() {
      const response = await obter.fetch()
      if (!response) return
      form.setValue({
        ...response,
        logo: formatarLogo(response.logo),
        telefones: response.telefones ?? [],
        redesSociais: response.redesSociais ?? [],
      })
    }
    carregar()
    // Esta consulta pertence apenas à montagem da página.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function alterarEndereco(campo: string, valor?: string | number | boolean) {
    form.setValue({
      enderecoParceiro: {
        cep: '',
        logradouro: '',
        localidade: '',
        bairro: '',
        numero: '',
        complemento: '',
        uf: '',
        ...form.values.enderecoParceiro,
        [campo]: String(valor ?? ''),
      },
    })
  }

  async function consultarCep() {
    const cep = form.values.enderecoParceiro?.cep
    if (!cep) return
    const endereco = await consultar.fetch(cep)
    if (endereco) form.setValue({ enderecoParceiro: endereco })
  }

  async function removerTelefone(index: number) {
    const item = form.values.telefones[index]
    if (item.id && !(await excluirTelefone.fetch(item.id))) return false
    form.setValue({
      telefones: form.values.telefones.filter((_, itemIndex) => itemIndex !== index),
    })
    return true
  }

  async function removerRedeSocial(index: number) {
    const item = form.values.redesSociais[index]
    if (item.id && !(await excluirRedeSocial.fetch(item.id))) return false
    form.setValue({
      redesSociais: form.values.redesSociais.filter((_, itemIndex) => itemIndex !== index),
    })
    return true
  }

  async function confirmarExclusao() {
    if (!exclusaoPendente) return
    const sucesso = exclusaoPendente.tipo === TipoExclusao.Telefone
      ? await removerTelefone(exclusaoPendente.index)
      : await removerRedeSocial(exclusaoPendente.index)
    if (sucesso) setExclusaoPendente(undefined)
  }

  const loading = obter.loading || editar.loading

  return (
    <FormRoot.Form loading={loading} submit={form.onSubmit} textoButton="Salvar">
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12} sm={3}>
          <InputApp
            focus
            required
            id={ParceiroFormField.Cnpj}
            name={ParceiroFormField.Cnpj}
            label="CNPJ"
            maxLength={18}
            value={form.values.cnpj}
            onChange={form.onChange}
            onBlur={form.onBlur}
            error={form.error(ParceiroFormField.Cnpj)}
            helperText={form.helperText(ParceiroFormField.Cnpj)}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} sm={9}>
          <InputApp
            required
            id={ParceiroFormField.RazaoSocial}
            name={ParceiroFormField.RazaoSocial}
            label="Razão social"
            maxLength={255}
            value={form.values.razaoSocial}
            onChange={form.onChange}
            onBlur={form.onBlur}
            error={form.error(ParceiroFormField.RazaoSocial)}
            helperText={form.helperText(ParceiroFormField.RazaoSocial)}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12}>
          <InputApp
            required
            id={ParceiroFormField.NomeFantasia}
            name={ParceiroFormField.NomeFantasia}
            label="Nome fantasia"
            maxLength={255}
            value={form.values.nomeFantasia}
            onChange={form.onChange}
            onBlur={form.onBlur}
            error={form.error(ParceiroFormField.NomeFantasia)}
            helperText={form.helperText(ParceiroFormField.NomeFantasia)}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12} sm={6}>
          <BoxApp border={`1px solid ${cores.divider}`} borderRadius={borderRadius} p={2}>
            {excluirRedeSocial.loading && <ProgressApp />}
            <BoxApp
              display={BoxAppDisplay.Flex}
              alignItems={BoxAppAlignItems.Center}
              justifyContent={BoxAppJustifyContent.Center}
            >
              <TextApp weight={TextAppWeight.SemiBold}>Redes sociais</TextApp>
              <IconButtonComTolltip
                tooltip="Adicione redes sociais"
                aria-label="Adicionar rede social"
                onClick={() =>
                  form.setValue({ redesSociais: [...form.values.redesSociais, { link: '' }] })
                }
              >
                <IconApp color={cores.success} icon="solar:add-circle-linear" />
              </IconButtonComTolltip>
            </BoxApp>
            {form.values.redesSociais.map((redeSocial, index) => (
              <BoxApp
                key={redeSocial.id ?? index}
                display={BoxAppDisplay.Grid}
                gap={1}
                py={1}
                sx={{ gridTemplateColumns: 'minmax(120px, 1fr) minmax(160px, 2fr) auto' }}
              >
                <RedeSocialDropDown
                  id={`redeSocial${index}`}
                  value={redeSocial.redeSocialEnum}
                  onChange={(value?: RedeSocialTipo) =>
                    form.setValue({
                      redesSociais: form.values.redesSociais.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, redeSocialEnum: value } : item,
                      ),
                    })
                  }
                />
                <InputApp
                  id={`link${index}`}
                  label="Link"
                  maxLength={500}
                  type={InputAppType.Url}
                  value={redeSocial.link}
                  onChange={(_, value) =>
                    form.setValue({
                      redesSociais: form.values.redesSociais.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, link: String(value ?? '') } : item,
                      ),
                    })
                  }
                />
                <IconButtonComTolltip
                  tooltip="Excluir rede social"
                  aria-label="Excluir rede social"
                  onClick={() => setExclusaoPendente({ index, tipo: TipoExclusao.RedeSocial })}
                >
                  <IconApp color={cores.error} icon="solar:trash-bin-trash-linear" />
                </IconButtonComTolltip>
              </BoxApp>
            ))}
          </BoxApp>
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} sm={6}>
          <BoxApp border={`1px solid ${cores.divider}`} borderRadius={borderRadius} p={2}>
            {excluirTelefone.loading && <ProgressApp />}
            <BoxApp
              display={BoxAppDisplay.Flex}
              alignItems={BoxAppAlignItems.Center}
              justifyContent={BoxAppJustifyContent.Center}
            >
              <TextApp weight={TextAppWeight.SemiBold}>Telefones</TextApp>
              <IconButtonComTolltip
                tooltip="Adicione telefones"
                aria-label="Adicionar telefone"
                onClick={() =>
                  form.setValue({ telefones: [...form.values.telefones, { telefone: '' }] })
                }
              >
                <IconApp color={cores.success} icon="solar:add-circle-linear" />
              </IconButtonComTolltip>
            </BoxApp>
            {form.values.telefones.map((telefone, index) => (
              <BoxApp
                key={telefone.id ?? index}
                display={BoxAppDisplay.Grid}
                gap={1}
                py={1}
                sx={{ gridTemplateColumns: '1fr auto' }}
              >
                <InputApp
                  id={`telefone${index}`}
                  label="Telefone"
                  maxLength={20}
                  type={InputAppType.Tel}
                  value={telefone.telefone}
                  onChange={(_, value) =>
                    form.setValue({
                      telefones: form.values.telefones.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, telefone: String(value ?? '') } : item,
                      ),
                    })
                  }
                />
                <IconButtonComTolltip
                  tooltip="Excluir telefone"
                  aria-label="Excluir telefone"
                  onClick={() => setExclusaoPendente({ index, tipo: TipoExclusao.Telefone })}
                >
                  <IconApp color={cores.error} icon="solar:trash-bin-trash-linear" />
                </IconButtonComTolltip>
              </BoxApp>
            ))}
          </BoxApp>
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <DividerApp sx={{ my: 2 }}>Endereço</DividerApp>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12} sm={3}>
          <BoxApp display={BoxAppDisplay.Flex} alignItems={BoxAppAlignItems.Center}>
            <InputApp
              id={EnderecoParceiroField.Cep}
              label="CEP"
              maxLength={8}
              value={form.values.enderecoParceiro?.cep}
              onChange={alterarEndereco}
            />
            <CepConsultaButton loading={consultar.loading} onClick={consultarCep} />
          </BoxApp>
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} sm={6}>
          <InputApp
            id={EnderecoParceiroField.Logradouro}
            label="Rua"
            maxLength={255}
            value={form.values.enderecoParceiro?.logradouro}
            onChange={alterarEndereco}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} sm={3}>
          <InputApp
            id={EnderecoParceiroField.Numero}
            label="N°"
            maxLength={10}
            value={form.values.enderecoParceiro?.numero}
            onChange={alterarEndereco}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12} sm={6}>
          <InputApp
            id={EnderecoParceiroField.Localidade}
            label="Cidade"
            maxLength={255}
            value={form.values.enderecoParceiro?.localidade}
            onChange={alterarEndereco}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} sm={3}>
          <InputApp
            id={EnderecoParceiroField.Bairro}
            label="Bairro"
            maxLength={255}
            value={form.values.enderecoParceiro?.bairro}
            onChange={alterarEndereco}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} sm={3}>
          <InputApp
            id={EnderecoParceiroField.Uf}
            label="UF"
            maxLength={2}
            value={form.values.enderecoParceiro?.uf}
            onChange={alterarEndereco}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12}>
          <InputApp
            id={EnderecoParceiroField.Complemento}
            label="Complemento"
            maxLength={255}
            value={form.values.enderecoParceiro?.complemento}
            onChange={alterarEndereco}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <DividerApp sx={{ my: 2 }}>Logo</DividerApp>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12} sm={3}>
          <ImageUploadApp
            alt={
              form.values.nomeFantasia ? `Logo da ${form.values.nomeFantasia}` : 'Logo da empresa'
            }
            buttonLabel="Selecione sua logo"
            error={form.error(ParceiroFormField.Logo)}
            helperText={form.helperText(ParceiroFormField.Logo)}
            onChange={(logo) => form.onChange(ParceiroFormField.Logo, logo)}
            value={form.values.logo}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <ModalChildren
        close={() => setExclusaoPendente(undefined)}
        footerChildren={(
          <>
            <ButtonApp
              variant={ButtonAppVariant.Outlined}
              onClick={() => setExclusaoPendente(undefined)}
            >
              Cancelar
            </ButtonApp>
            <ButtonApp
              color={ButtonAppColor.Error}
              loading={excluirTelefone.loading || excluirRedeSocial.loading}
              onClick={confirmarExclusao}
            >
              Excluir
            </ButtonApp>
          </>
        )}
        fullWidth
        maxWidth="xs"
        open={Boolean(exclusaoPendente)}
        titulo="Confirmar exclusão"
      >
        <TextApp>
          {exclusaoPendente?.tipo === TipoExclusao.Telefone
            ? 'Deseja realmente excluir este telefone?'
            : 'Deseja realmente excluir esta rede social?'}
        </TextApp>
      </ModalChildren>
    </FormRoot.Form>
  )
}
