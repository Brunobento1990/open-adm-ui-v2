import axios, { type GenericAbortSignal } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useSnackbarApp } from '../components/Snackbar/useSnackbar';
import { keysLocalStorage } from '../configs/keysLocalStorage';
import { useAuth } from './useAuth';
import { useLocalStorageApp } from './useLocalStorageApp';

export enum ApiMethod {
    Get = 'GET',
    Post = 'POST',
    Put = 'PUT',
    Delete = 'DELETE',
}

export type TypeMethod = `${ApiMethod}`;
export type StatusRequisicao = 'loading' | 'erro' | 'sucesso';

export interface propsUseApi {
    method: TypeMethod;
    url: string;
    naoRenderizarErro?: boolean;
    naoRenderizarResposta?: boolean;
    naoDeslogarAoReceber401?: boolean;
    naoEnviarToken?: boolean;
    header?: any;
    statusInicial?: StatusRequisicao;
}

export interface propsFecth {
    body?: any;
    urlParams?: string;
    message?: string;
    signal?: GenericAbortSignal;
    desativarSignal?: boolean;
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}

export const URL_API = import.meta.env.VITE_API_URL;
const errorResponseKeys = {
    description: 'descricao',
    errors: 'erros',
    errorsPascal: 'Erros',
};

function getErrorMessages(errors: any): string | string[] {
    if (!Array.isArray(errors)) {
        return 'Ocorreu um erro interno, tente novamente mais tarde!';
    }

    return errors.map((error) => {
        if (typeof error === 'string') return error;
        return (
            error?.[errorResponseKeys.description] ??
            'Ocorreu um erro interno, tente novamente mais tarde!'
        );
    });
}

function getMessage(method: TypeMethod): string {
    switch (method) {
        case ApiMethod.Delete:
            return 'Registro excluido com sucesso!';
        case ApiMethod.Put:
            return 'Registro editado com sucesso!';
        default:
            return 'Registro criado com sucesso!';
    }
}

export function useApi(props: propsUseApi) {
    const [statusRequisicao, setStatusRequisicao] = useState<
        StatusRequisicao | undefined
    >(props.statusInicial);
    const snack = useSnackbarApp();
    const abortControllerRef = useRef<any>(null);
    const { logout } = useAuth();
    const { getItem, setItem } = useLocalStorageApp();

    const api = axios.create({
        baseURL: URL_API,
    });

    useEffect(() => {
        return () => {
            setStatusRequisicao(undefined);
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    function erro(error: any) {
        if (error?.code === 'ERR_NETWORK') {
            snack.show(
                `Erro de conexão com nossos servidores, tente novamente, ou entre em contato com o suporte.`,
                'error',
            );
            return;
        }

        let errors =
            error?.response?.data?.[errorResponseKeys.errors] ??
            error?.response?.data?.[errorResponseKeys.errorsPascal];
        if (!errors) {
            errors = error?.response?.data;
        }

        if (Array.isArray(errors)) {
            snack.show(getErrorMessages(errors), 'error');
        } else {
            snack.show(
                'Ocorreu um erro interno, tente novamente mais tarde!',
                'error',
            );
        }

        if (error?.response?.status === 401 && !props.naoDeslogarAoReceber401) {
            logout();
        }
    }

    async function action<T = unknown>(
        propsFecth?: propsFecth,
    ): Promise<T | undefined> {
        try {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (!statusRequisicao || statusRequisicao !== 'loading') {
                setStatusRequisicao('loading');
            }
            abortControllerRef.current = new AbortController();
            const { signal } = abortControllerRef.current;
            const jwt = getItem(keysLocalStorage.jwt);

            const headers = {
                ...(!props.naoEnviarToken && {
                    Authorization: `Bearer ${jwt || ''}`,
                }),
                ...(props.header ?? {}),
            };

            const response = await api.request({
                url: propsFecth?.urlParams
                    ? `${props.url}${propsFecth?.urlParams}`
                    : props.url,
                data: propsFecth?.body,
                method: props.method,
                headers,
                signal: !propsFecth?.desativarSignal ? signal : undefined,
            });
            const message = propsFecth?.message ?? getMessage(props.method);
            if (
                message &&
                !props.naoRenderizarResposta &&
                props.method !== ApiMethod.Get
            ) {
                snack.show(message, 'success');
            }
            const responseHeader = response.headers as any;
            if (responseHeader['novotoken']) {
                setItem(
                    keysLocalStorage.jwt,
                    responseHeader['novotoken']?.toString(),
                );
            }
            setStatusRequisicao('sucesso');
            propsFecth?.onSuccess?.();
            return response?.data as T;
        } catch (err: any) {
            setStatusRequisicao('erro');
            if (err?.code === 'ERR_CANCELED') {
                return undefined;
            }
            propsFecth?.onError?.(err);
            if (!props.naoRenderizarErro) {
                erro(err);
            }
            return undefined;
        }
    }

    return {
        action,
        statusRequisicao,
        loading: statusRequisicao === 'loading',
    };
}
