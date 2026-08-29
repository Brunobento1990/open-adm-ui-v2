import { Box, IconButton, Tooltip } from '@mui/material';
import type { ReactNode } from 'react';
import { BoxApp } from '../components/BoxApp/BoxApp';
import {
    BoxAppAlignItems,
    BoxAppFlexDirection,
    BoxAppDisplay,
    BoxAppJustifyContent,
    BoxAppOverflow,
} from '../components/BoxApp/boxAppTypes';
import { ButtonApp, ButtonAppVariant } from '../components/ButtonApp/ButtonApp';
import { IconApp } from '../components/Icon/IconApp';
import { useNavigationApp } from '../hook/useNavigationApp';
import { useThemeApp } from '../hook/useThemeApp';
import { FormAction, type FormAction as FormActionType } from '../types/Form';

interface propsForm {
    children: ReactNode;
    submit: () => Promise<any>;
    tituloBotaoSalvar?: string;
    loading?: boolean;
    urlVoltar?: string;
    padding?: string;
    width?: string;
    widthButtonGravar?: string;
    action?: FormActionType;
    maxWidth?: string;
    heigth?: string;
    footer?: IFooterForm;
    textoButton?: string;
    paddingFooter?: string;
    marginTop?: string;
    buttonSalvarDisabled?: boolean;
    iconButtonSalvar?: string;
    corIconButtonSalvar?: string;
    toolTipButtonSalvar?: string | string[];
    stopPropagation?: boolean;
    overflowYContent?: BoxAppOverflow;
    responsiveMobileActions?: boolean;
    readonly?: boolean;
}

interface IFooterForm {
    children?: ReactNode;
    justifyContent?: BoxAppJustifyContent;
    height?: string;
}

export function FormApp(props: propsForm) {
    const { navigate } = useNavigationApp();
    const { backgroundColor, borderRadius, cores, isCelular } = useThemeApp();
    const readonly = props.readonly ?? props.action === FormAction.View;
    const mobileActions = Boolean(props.responsiveMobileActions && isCelular);

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                if (props.stopPropagation) {
                    e.stopPropagation();
                }
                await props.submit();
            }}
            style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: backgroundColor.card,
                borderRadius,
                boxSizing: 'border-box',
                height: mobileActions ? 'fit-content' : '100%',
                maxHeight: '100%',
                width: '100%',
                maxWidth: props.maxWidth,
                minHeight: 0,
                overflow: mobileActions ? 'auto' : 'hidden',
            }}
        >
            <BoxApp
                display={BoxAppDisplay.Flex}
                flex={mobileActions ? '0 0 auto' : 1}
                flexDirection={BoxAppFlexDirection.Column}
                p={props.padding ?? (mobileActions ? '0 1rem 1.25rem' : '0px 1rem 1rem 1rem')}
                boxShadow='none'
                mt={props.marginTop ?? '10px'}
                height={props.heigth}
                minHeight={0}
                overflow={mobileActions ? BoxAppOverflow.Visible : (props.overflowYContent ?? BoxAppOverflow.Auto)}
                width={props.width}
            >
                {props.children}
            </BoxApp>
            <Box
                sx={{
                    alignItems: 'center',
                    backgroundColor: backgroundColor.card,
                    borderTop: mobileActions ? `1px solid ${cores.divider}` : undefined,
                    bottom: mobileActions ? 0 : undefined,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flex: '0 0 auto',
                    flexDirection: 'row',
                    gap: mobileActions ? 1 : '20px',
                    height: mobileActions ? 'auto' : (props.footer?.height ?? '64px'),
                    justifyContent: props.footer?.justifyContent ?? BoxAppJustifyContent.End,
                    p: props.paddingFooter ?? (mobileActions ? '12px 16px 16px' : '1rem'),
                    position: mobileActions ? 'sticky' : 'static',
                    width: '100%',
                    zIndex: mobileActions ? 2 : undefined,
                }}
            >
                {props.footer?.children}
                <BoxApp
                    display={BoxAppDisplay.Flex}
                    justifyContent={BoxAppJustifyContent.End}
                    gap={mobileActions ? 1 : '20px'}
                    height={mobileActions ? 'auto' : '30px'}
                    alignItems={BoxAppAlignItems.Center}
                    flex={mobileActions ? 1 : undefined}
                    width={mobileActions ? undefined : (readonly || !props.urlVoltar ? '150px' : '300px')}
                >
                    {props.urlVoltar && mobileActions && (
                        <Tooltip title="Voltar">
                            <IconButton
                                aria-label="Voltar"
                                onClick={() => navigate(props.urlVoltar as string)}
                            >
                                <IconApp icon="solar:arrow-left-linear" />
                            </IconButton>
                        </Tooltip>
                    )}
                    {props.urlVoltar && !mobileActions && (
                        <ButtonApp
                            fullWidth
                            variant={ButtonAppVariant.Outlined}

                            onClick={() => navigate(props.urlVoltar)}
                        >Voltar</ButtonApp>
                    )}
                    {!readonly && (
                        <>
                            <ButtonApp
                                fullWidth
                                loading={props.loading}
                                type='submit'
                            >
                                {props.textoButton ?? 'Gravar'}
                            </ButtonApp>
                        </>
                    )}
                </BoxApp>
            </Box>
        </form>
    );
}
