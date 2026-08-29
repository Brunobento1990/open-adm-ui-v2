import * as signalR from '@microsoft/signalr';
import { useEffect, useRef } from 'react';
import { hubConfig } from '../configs/hubConfig';
import { keysLocalStorage } from '../configs/keysLocalStorage';
import type { EnviarMensagemChatResponse } from '../types/AtendimentoChatTypes';
import type { AtualizarConexaoWhatsAppResponse, ConexaoWhatsAppResponse } from '../types/ConexaoWhatsAppTypes';
import { URL_API } from './useApi';
import { useLocalStorageApp } from './useLocalStorageApp';

interface IConfig {
    ativo?: boolean;
    falhaDeConexao?: () => void;
    iniciouConexao?: () => void;
    fechouConexao?: () => void;
    updateQrcode?: (body: ConexaoWhatsAppResponse) => void;
    atualizacaoStatusConexaoWhatsApp?: (body: AtualizarConexaoWhatsAppResponse) => void;
    atualizacaoMensagemWhatsApp?: (body: EnviarMensagemChatResponse) => void
}

let connection: signalR.HubConnection;
let subscribers = 0;

export function useSignalR(config: IConfig) {
    const { getItem } = useLocalStorageApp();
    const configRef = useRef(config);
    const ativo = config.ativo ?? true;

    useEffect(() => {
        configRef.current = config;
    }, [config]);

    function registrarEventos(
        updateQrcode: (body: ConexaoWhatsAppResponse) => void,
        atualizacaoStatusConexaoWhatsApp: (body: AtualizarConexaoWhatsAppResponse) => void,
        atualizacaoMensagemWhatsApp: (body: EnviarMensagemChatResponse) => void,
    ) {
        connection.on(hubConfig.keyQrCode, updateQrcode);
        connection.on(hubConfig.keyAtualizacaoStatusConexaoWhatsApp, atualizacaoStatusConexaoWhatsApp);
        connection.on(hubConfig.keyAtualizacaoMensagemWhatsApp, atualizacaoMensagemWhatsApp);
    }

    function removerEventos(
        updateQrcode: (body: ConexaoWhatsAppResponse) => void,
        atualizacaoStatusConexaoWhatsApp: (body: AtualizarConexaoWhatsAppResponse) => void,
        atualizacaoMensagemWhatsApp: (body: EnviarMensagemChatResponse) => void,
    ) {
        connection?.off(hubConfig.keyQrCode, updateQrcode);
        connection?.off(hubConfig.keyAtualizacaoStatusConexaoWhatsApp, atualizacaoStatusConexaoWhatsApp);
        connection?.off(hubConfig.keyAtualizacaoMensagemWhatsApp, atualizacaoMensagemWhatsApp);
    }

    async function conexaoWebSocket() {
        try {
            if (connection?.state === signalR.HubConnectionState.Connected) {
                return;
            }
            const jwt = getItem(keysLocalStorage.jwt) ?? '';
            connection = new signalR.HubConnectionBuilder()
                .withUrl(`${URL_API}${hubConfig.urlChat}`, {
                    accessTokenFactory: () =>
                        Promise.resolve(jwt) as Promise<string>,
                    skipNegotiation: true,
                    transport: signalR.HttpTransportType.WebSockets,
                })
                .withAutomaticReconnect([0, 2000, 10000, 30000])
                .configureLogging(signalR.LogLevel.Information)
                .build();
            await connection
                .start()
                .then(() => {
                    if (configRef.current.iniciouConexao) {
                        configRef.current.iniciouConexao();
                    }
                })
                .catch(() => {
                    if (configRef.current.falhaDeConexao) {
                        configRef.current.falhaDeConexao();
                    }
                });

            connection.onclose(() => {
                if (configRef.current.fechouConexao) {
                    configRef.current.fechouConexao();
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (!ativo) {
            return;
        }

        const updateQrcode = (body: ConexaoWhatsAppResponse) => {
            if (configRef.current.updateQrcode) {
                configRef.current.updateQrcode(body);
            }
        };
        const atualizacaoStatusConexaoWhatsApp = (body: AtualizarConexaoWhatsAppResponse) => {
            if (configRef.current.atualizacaoStatusConexaoWhatsApp) {
                configRef.current.atualizacaoStatusConexaoWhatsApp(body);
            }
        };
        const atualizacaoMensagemWhatsApp = (body: EnviarMensagemChatResponse) => {
            if (configRef.current.atualizacaoMensagemWhatsApp) {
                configRef.current.atualizacaoMensagemWhatsApp(body);
            }
        };

        subscribers += 1;
        conexaoWebSocket();
        if (connection) {
            registrarEventos(updateQrcode, atualizacaoStatusConexaoWhatsApp, atualizacaoMensagemWhatsApp);
        }

        return () => {
            removerEventos(updateQrcode, atualizacaoStatusConexaoWhatsApp, atualizacaoMensagemWhatsApp);
            subscribers = Math.max(subscribers - 1, 0);
            if (subscribers === 0) {
                connection?.stop();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ativo]);
}
