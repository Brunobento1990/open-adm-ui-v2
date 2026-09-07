import { ButtonApp } from '../ButtonApp/ButtonApp'
import { IconApp } from '../Icon/IconApp'
import { IconButtonComTolltip } from '../IconButtonComTolltip/IconButtonComTolltip'
import { InputApp } from '../InputApp/InputApp'
import { InputAppType } from '../InputApp/inputAppTypes'
import { StackApp } from '../StackApp/StackApp'
import { TextApp, TextAppColor } from '../TextApp/TextApp'
import { useFormikAdapter } from '../../hook/useFormikAdapter'
import { YupAdapter } from '../../lib/YupAdapter'
import {
  LinkBioItemFormField,
  type LinkBioItem,
  type LinkBioItemCreatePayload,
} from '../../types/LinkBioTypes'

type LinkBioItemFormProps = {
  initialItem?: LinkBioItem
  loading?: boolean
  onConfirmar: (item: LinkBioItemCreatePayload | LinkBioItem) => Promise<boolean>
}

const opcoesIcone = [
  { id: 'mdi:whatsapp', label: 'WhatsApp' },
  { id: 'mdi:instagram', label: 'Instagram' },
  { id: 'mdi:facebook', label: 'Facebook' },
  { id: 'mdi:youtube', label: 'YouTube' },
  { id: 'mdi:web', label: 'Site' },
  { id: 'mdi:shopping', label: 'Loja' },
  { id: 'mdi:map-marker', label: 'Localização' },
  { id: 'mdi:phone', label: 'Telefone' },
  { id: 'mdi:email', label: 'E-mail' },
  { id: 'mdi:link-variant', label: 'Link externo' },
] as const

const validationSchema = new YupAdapter()
  .string(LinkBioItemFormField.Titulo, 'Informe o título')
  .stringWithTests(LinkBioItemFormField.Url, [{
    name: 'url-http',
    message: 'Informe uma URL HTTP ou HTTPS válida',
    test: (value) => {
      try {
        const url = new URL(value ?? '')
        return url.protocol === 'http:' || url.protocol === 'https:'
      } catch {
        return false
      }
    },
  }], 'Informe a URL')
  .build()

export function LinkBioItemForm({ initialItem, loading, onConfirmar }: LinkBioItemFormProps) {
  const form = useFormikAdapter<LinkBioItemCreatePayload | LinkBioItem>({
    initialValues: initialItem ?? { ativo: true, icone: '', ordem: 0, titulo: '', url: '' },
    validationSchema,
    onSubmit: async (values: LinkBioItemCreatePayload | LinkBioItem) => { await onConfirmar(values) },
  })

  return (
    <StackApp component="form" onSubmit={(event) => { event.preventDefault(); form.onSubmit() }} spacing={2}>
      <InputApp
        error={form.error(LinkBioItemFormField.Titulo)}
        focus
        helperText={form.helperText(LinkBioItemFormField.Titulo)}
        id={LinkBioItemFormField.Titulo}
        label="Título"
        maxLength={255}
        onBlur={form.onBlur}
        onChange={form.onChange}
        required
        value={form.values.titulo}
      />
      <InputApp
        error={form.error(LinkBioItemFormField.Url)}
        helperText={form.helperText(LinkBioItemFormField.Url)}
        id={LinkBioItemFormField.Url}
        label="URL"
        onBlur={form.onBlur}
        onChange={form.onChange}
        required
        type={InputAppType.Url}
        value={form.values.url}
      />
      <StackApp spacing={1}>
        <TextApp>Ícone (opcional)</TextApp>
        <StackApp direction="row" sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <IconButtonComTolltip
            aria-label="Sem ícone"
            onClick={() => form.setValue({ icone: '' })}
            sx={{ border: '1px solid', borderColor: !form.values.icone ? 'primary.main' : 'divider', borderRadius: 1 }}
            tooltip="Sem ícone"
          >
            <TextApp color={TextAppColor.Secondary} fontSize="1rem">∅</TextApp>
          </IconButtonComTolltip>
          {opcoesIcone.map((opcao) => (
            <IconButtonComTolltip
              aria-label={opcao.label}
              key={opcao.id}
              onClick={() => form.setValue({ icone: opcao.id })}
              sx={{ border: '1px solid', borderColor: form.values.icone === opcao.id ? 'primary.main' : 'divider', borderRadius: 1 }}
              tooltip={opcao.label}
            >
              <IconApp icon={opcao.id} />
            </IconButtonComTolltip>
          ))}
        </StackApp>
        <TextApp color={TextAppColor.Secondary} fontSize="0.8rem">
          {opcoesIcone.find((opcao) => opcao.id === form.values.icone)?.label ?? 'Sem ícone'}
        </TextApp>
      </StackApp>
      <InputApp
        checked={form.values.ativo}
        id={LinkBioItemFormField.Ativo}
        label="Ativo"
        onChange={form.onChange}
        type={InputAppType.Checkbox}
      />
      <ButtonApp fullWidth loading={loading} type="submit">
        {initialItem ? 'Salvar alterações' : 'Adicionar link'}
      </ButtonApp>
    </StackApp>
  )
}
