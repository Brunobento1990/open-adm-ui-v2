export enum LinkBioConfiguracaoFormField {
  Ativo = 'ativo',
  CorDeFundo = 'corDeFundo',
  CorPrincipal = 'corPrincipal',
  Descricao = 'descricao',
  BackgroundImage = 'backgroundImage',
  Titulo = 'titulo',
}

export enum LinkBioItemFormField {
  Ativo = 'ativo',
  Icone = 'icone',
  Ordem = 'ordem',
  Titulo = 'titulo',
  Url = 'url',
}

export enum LinkBioEventosFormField {
  DataFinal = 'dataFinal',
  DataInicial = 'dataInicial',
}

export enum TipoEventoLinkBio {
  Visualizacao = 1,
  Clique = 2,
}

export interface LinkBioConfiguracao {
  id: string
  titulo: string
  descricao?: string
  corDeFundo?: string
  corPrincipal?: string
  ativo: boolean
  backgroundImage?: string
  links: LinkBioItem[]
}

export type LinkBioConfiguracaoForm = Omit<LinkBioConfiguracao, 'links'>

export type LinkBioConfiguracaoPayload = Pick<
  LinkBioConfiguracaoForm,
  'titulo' | 'descricao' | 'corDeFundo' | 'corPrincipal' | 'ativo' | 'backgroundImage'
>

export interface LinkBioItem {
  id: string
  titulo: string
  url: string
  ordem: number
  ativo: boolean
  icone?: string
}

export type LinkBioItemCreatePayload = Omit<LinkBioItem, 'id'>
export type LinkBioItemUpdatePayload = LinkBioItem

export interface LinkBioEvento {
  id: string
  linkId?: string
  tipo: TipoEventoLinkBio
  dataHora: string
}

export interface LinkBioMaisClicado {
  linkId: string
  titulo: string
  quantidade: number
}

export interface LinkBioIndicadores {
  visualizacoes: number
  cliques: number
  eventos: LinkBioEvento[]
  linksMaisClicados: LinkBioMaisClicado[]
}

export interface LinkBioEventosFiltro {
  dataInicial: string
  dataFinal: string
}
