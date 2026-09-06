import { ProdutoDropDown } from '../../../components/DropDown/ProdutoDropDown'
import { PesoDropDown } from '../../../components/DropDown/PesoDropDown'
import { TamanhoDropDown } from '../../../components/DropDown/TamanhoDropDown'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { ButtonApp } from '../../../components/ButtonApp/ButtonApp'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { YupAdapter } from '../../../lib/YupAdapter'
import {
  TabelaDePrecoItemFormField,
  type TabelaDePrecoItem,
  type TabelaDePrecoItemFormValues,
} from '../../../types/TabelaDePrecoTypes'

const initialValues: TabelaDePrecoItemFormValues = {
  produtoId: '',
  valorUnitarioAtacado: 0,
  valorUnitarioVarejo: 0,
}

const validationSchema = new YupAdapter()
  .string(TabelaDePrecoItemFormField.ProdutoId, 'Selecione o produto')
  .number(TabelaDePrecoItemFormField.ValorUnitarioAtacado, 'Informe o valor de atacado')
  .number(TabelaDePrecoItemFormField.ValorUnitarioVarejo, 'Informe o valor de varejo')
  .build()

type Props = {
  bloquearIdentificacao?: boolean
  initialItem?: TabelaDePrecoItem
  loading?: boolean
  onConfirmar: (item: TabelaDePrecoItem) => Promise<boolean> | boolean
  textoButton: string
}

export function TabelaDePrecoItemEditor({ bloquearIdentificacao, initialItem, loading, onConfirmar, textoButton }: Props) {
  const form = useFormikAdapter<TabelaDePrecoItemFormValues>({
    initialValues: initialItem ?? initialValues,
    validationSchema,
    onSubmit: async (values) => {
      if (await onConfirmar(values)) await form.limpar()
    },
  })

  return (
    <>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={4} xs={12}>
          <ProdutoDropDown
            error={form.error(TabelaDePrecoItemFormField.ProdutoId)}
            helperText={form.helperText(TabelaDePrecoItemFormField.ProdutoId)}
            onChange={(_, produto) => form.setValue({ produto, produtoId: produto?.id ?? '' })}
            readonly={bloquearIdentificacao}
            required
            value={form.values.produto}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={4} xs={12}>
          <PesoDropDown
            onChange={(_, peso) =>
              form.setValue({ peso, pesoId: peso?.id ?? null, tamanho: undefined, tamanhoId: null })
            }
            readonly={bloquearIdentificacao}
            value={form.values.peso}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={4} xs={12}>
          <TamanhoDropDown
            onChange={(_, tamanho) =>
              form.setValue({
                peso: undefined,
                pesoId: null,
                tamanho,
                tamanhoId: tamanho?.id ?? null,
              })
            }
            readonly={bloquearIdentificacao}
            value={form.values.tamanho}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={4} xs={12}>
          <InputApp
            error={form.error(TabelaDePrecoItemFormField.ValorUnitarioAtacado)}
            helperText={form.helperText(TabelaDePrecoItemFormField.ValorUnitarioAtacado)}
            id={TabelaDePrecoItemFormField.ValorUnitarioAtacado}
            label="Valor de atacado"
            onBlur={form.onBlur}
            onChange={form.onChange}
            required
            startAdornment="R$"
            type={InputAppType.Currency}
            value={form.values.valorUnitarioAtacado}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={4} xs={12}>
          <InputApp
            error={form.error(TabelaDePrecoItemFormField.ValorUnitarioVarejo)}
            helperText={form.helperText(TabelaDePrecoItemFormField.ValorUnitarioVarejo)}
            id={TabelaDePrecoItemFormField.ValorUnitarioVarejo}
            label="Valor de varejo"
            onBlur={form.onBlur}
            onChange={form.onChange}
            required
            startAdornment="R$"
            type={InputAppType.Currency}
            value={form.values.valorUnitarioVarejo}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={4} xs={12}>
          <ButtonApp fullWidth loading={loading} onClick={form.onSubmit}>
            {textoButton}
          </ButtonApp>
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
    </>
  )
}
