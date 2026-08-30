import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import type { ReactNode } from 'react';
import { ButtonApp } from '../ButtonApp/ButtonApp';
import { IconApp } from '../Icon/IconApp';
import { TextApp } from '../TextApp/TextApp';
import { BootstrapDialog } from './BootstrapDialog';

interface propsHeaderModalChildren {
    height?: string;
    padding?: string;
    fontSize?: string;
}

interface propsModalChildren {
    open: boolean;
    children: ReactNode;
    action?: () => void;
    titulo?: string;
    close?: () => void;
    fullWidth?: boolean;
    loading?: boolean;
    maxWidth?: 'lg' | 'md' | 'sm' | 'xs' | 'xl';
    textoButton?: string;
    retirarFooter?: boolean;
    padding?: string;
    header?: propsHeaderModalChildren;
    overflowY?: boolean;
    disabledAction?: boolean;
    bloquearFecharModalClickFora?: boolean;
    footerChildren?: ReactNode;
    retirarHeader?: boolean;
}

export function ModalChildren(props: propsModalChildren) {
    return (
        <BootstrapDialog
            onClose={(_, reason) => {
                if (
                    props.bloquearFecharModalClickFora &&
                    reason === 'backdropClick'
                ) {
                    return;
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                props.close && props.close();
            }}
            aria-labelledby='customized-dialog-title'
            open={props.open}
            fullWidth={props.fullWidth}
            maxWidth={props.maxWidth}
            onClick={(e) => e.stopPropagation()}
        >
            {!props.retirarHeader && (
                <DialogTitle
                    sx={{
                        m: 0,
                        p: props.header?.padding ?? '2',
                        height: props.header?.height,
                    }}
                    id='customized-dialog-title'
                >
                    <TextApp
                        fontSize={props.header?.fontSize ?? '22px'}
                        fontWeight={600}
                    >{props.titulo ?? 'Bludata Despachante'}</TextApp>
                </DialogTitle>
            )}
            {props.close && (
                <IconButton
                    aria-label='close'
                    onClick={props.close}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <IconApp icon='mdi:close' />
                </IconButton>
            )}
            <DialogContent
                dividers
                sx={{
                    padding: props.padding,
                    overflowY: props.overflowY === false ? 'hidden' : undefined,
                    '&.MuiDialogContent-root': {
                        padding: props.padding,
                    },
                }}
            >
                {props.children}
            </DialogContent>
            {!props.retirarFooter && (
                <DialogActions>
                    {props.footerChildren || (
                        <ButtonApp
                            onClick={props.action}
                            loading={props.loading}
                            disabled={props.disabledAction}
                        >
                            {props.textoButton}
                        </ButtonApp>
                    )}
                </DialogActions>
            )}
        </BootstrapDialog>
    );
}
