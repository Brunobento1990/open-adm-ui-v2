import { ButtonApp, ButtonAppVariant } from '../ButtonApp/ButtonApp'
import { useSnackbarApp } from '../Snackbar/useSnackbar'

type ButtonCopyAppProps = {
  label: string
  value: string
}

export function ButtonCopyApp({ label, value }: ButtonCopyAppProps) {
  const snack = useSnackbarApp()

  async function copiar() {
    try {
      await navigator.clipboard.writeText(value)
      snack.show('Conteúdo copiado com sucesso', 'success')
    } catch {
      snack.show('Não foi possível copiar o conteúdo', 'error')
    }
  }

  return (
    <ButtonApp disabled={!value} onClick={copiar} variant={ButtonAppVariant.Outlined}>
      {label}
    </ButtonApp>
  )
}
