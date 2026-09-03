import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useApiCep } from '../../../api/useApiCep'
import { useApiClienteVenda } from '../../../api/useApiClienteVenda'
import { useApiCnpj } from '../../../api/useApiCnpj'
import { BoxApp } from '../../../components/BoxApp/BoxApp'
import { BoxAppAlignItems, BoxAppDisplay } from '../../../components/BoxApp/boxAppTypes'
import { CepConsultaButton } from '../../../components/CepConsultaButton/CepConsultaButton'
import { CnpjConsultaButton } from '../../../components/CnpjConsultaButton/CnpjConsultaButton'
import { DividerApp } from '../../../components/DividerApp/DividerApp'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useNavigationApp } from '../../../hook/useNavigationApp'
import { YupAdapter } from '../../../lib/YupAdapter'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import {
  ClienteVendaFormField,
  EnderecoClienteVendaField,
  type ClienteVenda,
} from '../../../types/ClienteVendaTypes'
import { FormAction, type FormAction as FormActionType } from '../../../types/Form'
import { limparCnpj, limparCpf, limparTelefone } from '../../../utils/documentUtils'

type ClienteVendaFormPageProps = { action: FormActionType }

const initialValues: Partial<ClienteVenda> = {
  cnpj: '',
  cpf: '',
  email: '',
  nome: '',
  reSenha: '',
  senha: '',
  telefone: '',
  enderecoUsuario: {},
}

const validationSchema = new YupAdapter()
  .string(ClienteVendaFormField.Nome, 'Informe o nome')
  .string(ClienteVendaFormField.Telefone, 'Informe o telefone')
  .build()

export function ClienteVendaFormPage({ action }: ClienteVendaFormPageProps) {
  const { id } = useParams<{ id: string }>()
  const { navigate } = useNavigationApp()
  const { criar, obter } = useApiClienteVenda()
  const { consultar: consultarCnpjApi } = useApiCnpj()
  const { consultar: consultarCepApi } = useApiCep()
  const readonly = action === FormAction.View
  const form = useFormikAdapter<Partial<ClienteVenda>>({
    initialValues,
    validationSchema,
    onSubmit: async (values: Partial<ClienteVenda>) => {
      if (values.senha && values.reSenha && values.senha !== values.reSenha) {
        form.setError(ClienteVendaFormField.ReSenha, 'As senhas não conferem')
        return
      }
      const response = await criar.fetch({
        ...values,
        cnpj: limparCnpj(values.cnpj),
        cpf: limparCpf(values.cpf),
        telefone: limparTelefone(values.telefone),
      })
      if (response) navigate(PrivateRoutePath.ClienteVenda)
    },
  })

  function setEndereco(field: EnderecoClienteVendaField, value?: string | number | boolean) {
    form.setValue({
      enderecoUsuario: {
        ...form.values.enderecoUsuario,
        [field]: String(value ?? ''),
      },
    })
  }

  async function consultarCnpj() {
    if (!form.values.cnpj) return
    const response = await consultarCnpjApi.fetch(form.values.cnpj)
    if (!response) return
    form.setValue({
      nome: response.nome_fantasia,
      telefone: response.ddd_telefone_1,
      enderecoUsuario: {
        bairro: response.bairro,
        cep: response.cep,
        complemento: response.complemento,
        localidade: response.municipio,
        logradouro: response.logradouro,
        numero: response.numero,
        uf: response.uf,
      },
    })
  }

  async function consultarCep() {
    const cep = form.values.enderecoUsuario?.cep
    if (!cep) return
    const response = await consultarCepApi.fetch(cep)
    if (!response) return
    form.setValue({
      enderecoUsuario: {
        ...form.values.enderecoUsuario,
        bairro: response.bairro,
        cep: response.cep,
        complemento: response.complemento,
        localidade: response.localidade,
        logradouro: response.logradouro,
        uf: response.uf,
      },
    })
  }

  useEffect(() => {
    if (action !== FormAction.View || !id) return
    async function carregar() {
      const response = await obter.fetch(id as string)
      if (response) form.setValue(response)
    }
    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, id])

  return (
    <FormRoot.Form
      action={action}
      loading={criar.loading || obter.loading}
      responsiveMobileActions
      submit={form.onSubmit}
      urlVoltar={PrivateRoutePath.ClienteVenda}
    >
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <InputApp
            disabled={readonly}
            id={ClienteVendaFormField.Cpf}
            label="CPF"
            maxLength={14}
            onChange={form.onChange}
            value={form.values.cpf ?? ''}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <BoxApp alignItems={BoxAppAlignItems.Center} display={BoxAppDisplay.Flex}>
            <InputApp
              disabled={readonly}
              id={ClienteVendaFormField.Cnpj}
              label="CNPJ"
              maxLength={18}
              onChange={form.onChange}
              value={form.values.cnpj ?? ''}
            />
            {!readonly && (
              <CnpjConsultaButton
                disabled={!form.values.cnpj}
                loading={consultarCnpjApi.loading}
                onClick={consultarCnpj}
              />
            )}
          </BoxApp>
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <InputApp
            disabled={readonly}
            error={form.error(ClienteVendaFormField.Nome)}
            helperText={form.helperText(ClienteVendaFormField.Nome)}
            id={ClienteVendaFormField.Nome}
            label="Nome"
            maxLength={255}
            onBlur={form.onBlur}
            onChange={form.onChange}
            required
            value={form.values.nome ?? ''}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <InputApp
            disabled={readonly}
            id={ClienteVendaFormField.Email}
            label="E-mail"
            maxLength={255}
            onChange={form.onChange}
            type={InputAppType.Email}
            value={form.values.email ?? ''}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      {action === FormAction.Create && (
        <FormRoot.FormRow>
          <FormRoot.FormItemRow sm={6} xs={12}>
            <InputApp
              id={ClienteVendaFormField.Senha}
              label="Senha"
              maxLength={255}
              onChange={form.onChange}
              type={InputAppType.Password}
              value={form.values.senha ?? ''}
            />
          </FormRoot.FormItemRow>
          <FormRoot.FormItemRow sm={6} xs={12}>
            <InputApp
              error={form.error(ClienteVendaFormField.ReSenha)}
              helperText={form.helperText(ClienteVendaFormField.ReSenha)}
              id={ClienteVendaFormField.ReSenha}
              label="Confirme a senha"
              maxLength={255}
              onChange={form.onChange}
              type={InputAppType.Password}
              value={form.values.reSenha ?? ''}
            />
          </FormRoot.FormItemRow>
        </FormRoot.FormRow>
      )}
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <InputApp
            disabled={readonly}
            error={form.error(ClienteVendaFormField.Telefone)}
            helperText={form.helperText(ClienteVendaFormField.Telefone)}
            id={ClienteVendaFormField.Telefone}
            label="Telefone"
            maxLength={255}
            onBlur={form.onBlur}
            onChange={form.onChange}
            required
            type={InputAppType.Tel}
            value={form.values.telefone ?? ''}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <DividerApp sx={{ my: 2 }}>Endereço</DividerApp>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={3} xs={12}>
          <BoxApp alignItems={BoxAppAlignItems.Center} display={BoxAppDisplay.Flex}>
            <InputApp
              disabled={readonly}
              id={EnderecoClienteVendaField.Cep}
              label="CEP"
              maxLength={9}
              onChange={(_, value) =>
                setEndereco(
                  EnderecoClienteVendaField.Cep,
                  String(value ?? '')
                    .replace(/\D/g, '')
                    .slice(0, 8),
                )
              }
              value={form.values.enderecoUsuario?.cep ?? ''}
            />
            {!readonly && (
              <CepConsultaButton
                disabled={!form.values.enderecoUsuario?.cep}
                loading={consultarCepApi.loading}
                onClick={consultarCep}
              />
            )}
          </BoxApp>
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <InputApp
            disabled={readonly}
            id={EnderecoClienteVendaField.Logradouro}
            label="Rua"
            maxLength={255}
            onChange={(_, value) => setEndereco(EnderecoClienteVendaField.Logradouro, value)}
            value={form.values.enderecoUsuario?.logradouro ?? ''}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={3} xs={12}>
          <InputApp
            disabled={readonly}
            id={EnderecoClienteVendaField.Numero}
            label="N°"
            maxLength={10}
            onChange={(_, value) => setEndereco(EnderecoClienteVendaField.Numero, value)}
            value={form.values.enderecoUsuario?.numero ?? ''}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <InputApp
            disabled={readonly}
            id={EnderecoClienteVendaField.Localidade}
            label="Cidade"
            maxLength={255}
            onChange={(_, value) => setEndereco(EnderecoClienteVendaField.Localidade, value)}
            value={form.values.enderecoUsuario?.localidade ?? ''}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={3} xs={12}>
          <InputApp
            disabled={readonly}
            id={EnderecoClienteVendaField.Bairro}
            label="Bairro"
            maxLength={255}
            onChange={(_, value) => setEndereco(EnderecoClienteVendaField.Bairro, value)}
            value={form.values.enderecoUsuario?.bairro ?? ''}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={3} xs={12}>
          <InputApp
            disabled={readonly}
            id={EnderecoClienteVendaField.Uf}
            label="UF"
            maxLength={2}
            onChange={(_, value) => setEndereco(EnderecoClienteVendaField.Uf, value)}
            value={form.values.enderecoUsuario?.uf ?? ''}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12}>
          <InputApp
            disabled={readonly}
            id={EnderecoClienteVendaField.Complemento}
            label="Complemento"
            maxLength={255}
            onChange={(_, value) => setEndereco(EnderecoClienteVendaField.Complemento, value)}
            value={form.values.enderecoUsuario?.complemento ?? ''}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
    </FormRoot.Form>
  )
}
