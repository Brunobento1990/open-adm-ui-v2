import { CircularProgress, Paper, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useApi, type TypeMethod } from '../../hook/useApi';
import { useDebounce } from '../../hook/useDebounce';
import { ButtonApp } from '../ButtonApp/ButtonApp';

interface propsDropDown {
    value: any;
    onChange?: (id: string, newValue?: any) => void;
    onBlur?: (e: any) => void;
    label: string;
    keyLabel: string | string[];
    url: string;
    size?: 'small' | 'medium';
    id: string;
    required?: boolean;
    helperText?: any;
    error?: boolean;
    method?: TypeMethod;
    readonly?: boolean;
    orderBy?: string;
    autoFocus?: boolean;
    renderOption?: (props: any, value: any) => React.ReactNode;
    asc?: boolean;
    textoBotaoNovoRegistro?: string;
    onClickBotaoNovoRegistro?: (search?: string) => void;
    textoNaoEncontrado?: string;
    startAdornment?: React.ReactNode;
    body?: any;
    utilizarURLSearch?: boolean;
    tooltipBotaoNovoRegistro?: string;
    headerApi?: any;
}

interface propsCustomListbox
    extends React.HTMLAttributes<HTMLUListElement> {
    textoBotaoNovoRegistro?: string;
    onClickBotaoNovoRegistro?: (search?: string) => void;
    valorDigitado?: string;
}

function CustomListbox(props: propsCustomListbox) {
    const {
        children,
        textoBotaoNovoRegistro,
        onClickBotaoNovoRegistro,
        valorDigitado,
        ...other
    } = props;

    const handleClickNovoRegistro = () => {
        if (!onClickBotaoNovoRegistro) return;
        onClickBotaoNovoRegistro(valorDigitado);
    };

    const buttonContent = (
        <div
            onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClickNovoRegistro();
            }}
            style={{ width: '100%' }}
        >
            <ButtonApp
                fullWidth
                startIcon={'ic:round-plus'}
            >{textoBotaoNovoRegistro}</ButtonApp>
        </div>
    );

    return (
        <Paper
            style={{
                margin: 0,
                padding: 0,
                listStyle: 'none',
            }}
            component='ul'
            {...other}
        >
            {children}
            {onClickBotaoNovoRegistro && (
                <li
                    style={{
                        borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                        padding: '8px',
                    }}
                >
                    {buttonContent}
                </li>
            )}
        </Paper>
    );
}

export function DropDownAutoFetchOpenApp(props: propsDropDown) {
    const { action, loading } = useApi({
        method: props.method ?? 'POST',
        url: props.url,
        naoRenderizarResposta: true,
        header: props.headerApi,
    });
    const [valuesOriginais, setValuesOriginais] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const pesquisaDebounce = useDebounce(search);
    const textoNaoEncontrado = props.textoNaoEncontrado ?? 'S/R';
    const labelValueSelecionado = getLabel(props?.value);

    function getLabel(value: any) {
        if (!value) return '';

        const labels = Array.isArray(props.keyLabel)
            ? props.keyLabel
            : [props.keyLabel];

        return labels
            .map((key) => {
                if (key?.includes('.')) {
                    const keys = key.split('.');
                    let valorFinal = value;
                    // Corrigido o loop para percorrer do início ao fim
                    for (let i = 0; i < keys.length; i++) {
                        valorFinal = valorFinal?.[keys[i]];
                        // Adicionado verificação de null/undefined
                        if (valorFinal == null) break;
                    }
                    return valorFinal;
                }

                return value[key];
            })
            .filter(Boolean)
            .join(' - ');
    }

    async function init() {
        if (props.readonly || !open) {
            return;
        }

        const response = await action<any>({
            body: {
                orderBy: props.orderBy,
                search:
                    pesquisaDebounce && pesquisaDebounce.length > 0
                        ? pesquisaDebounce
                        : undefined,
                ...props.body,
            },
            urlParams:
                props.method === 'GET' && props.utilizarURLSearch
                    ? `?${new URLSearchParams({
                        search: pesquisaDebounce,
                    }).toString()}`
                    : undefined,
        });

        if (Array.isArray(response?.values)) {
            setValuesOriginais(response?.values ?? []);
        } else if (Array.isArray(response)) {
            setValuesOriginais(response ?? []);
        }
    }

    function renderOptions(params: any, value: any) {
        if (props.renderOption) {
            return props.renderOption(
                params,
                valuesOriginais.find((x) => x.id === value.id),
            );
        }

        return null;
    }

    const idSelecionado = props?.value?.id;

    const value = useMemo(() => {
        if (props.value === undefined) return null;
        if (typeof props.value === 'string' && props.value.length === 0) {
            return null;
        }

        return {
            id: idSelecionado,
            label: labelValueSelecionado
                ? labelValueSelecionado
                : idSelecionado
                    ? textoNaoEncontrado
                    : '',
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idSelecionado, labelValueSelecionado, textoNaoEncontrado]);

    useEffect(() => {
        // A abertura e a pesquisa disparam o carregamento remoto das opções.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pesquisaDebounce, open]);

    return (
        <Autocomplete
            noOptionsText={'Não há registros'}
            id={props.id}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
                setSearch('');
            }}
            value={value}
            loading={loading}
            loadingText='Carregando...'
            getOptionLabel={(opt) => `${opt?.label || ''}`}
            onInputChange={(_, novoValor, reason) => {
                if (reason === 'reset') return;
                setSearch(novoValor);
            }}
            onChange={(_, newValue: any, reason) => {
                const newV = reason !== 'clear' ? newValue : undefined;
                if (props.onChange) {
                    props.onChange(
                        props.id,
                        valuesOriginais.find((x) => x?.id === newV?.id),
                    );
                }
            }}
            onBlur={props.onBlur}
            renderOption={props.renderOption ? renderOptions : undefined}
            slotProps={{
                paper: {
                    component: (props2) => (
                        <CustomListbox
                            {...props2}
                            textoBotaoNovoRegistro={props.textoBotaoNovoRegistro}
                            onClickBotaoNovoRegistro={props.onClickBotaoNovoRegistro}
                            valorDigitado={search}
                        />
                    ),
                },
            }}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            readOnly={props.readonly}
            fullWidth
            options={valuesOriginais.map((value: any) => {
                const newLabel = getLabel(value);
                return {
                    id: value?.id,
                    label: newLabel ? newLabel : textoNaoEncontrado,
                };
            })}
            size={props.size ?? 'small'}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={props.label}
                    autoFocus={props.autoFocus}
                    required={props.required}
                    helperText={props.helperText}
                    error={props.error}
                    disabled={props.readonly}
                    slotProps={{
                        input: {
                            ...params.slotProps.input,
                            startAdornment: (
                                <Fragment>
                                    {props.startAdornment}
                                    {params.slotProps.input.startAdornment}
                                </Fragment>
                            ),
                            endAdornment: (
                                <Fragment>
                                    {loading ? (
                                        <CircularProgress color='inherit' size={20} />
                                    ) : null}
                                    {params.slotProps.input.endAdornment}
                                </Fragment>
                            ),
                        },
                        inputLabel: params.slotProps.inputLabel,
                        htmlInput: params.slotProps.htmlInput,
                    }}
                />
            )}
        />
    );
}
