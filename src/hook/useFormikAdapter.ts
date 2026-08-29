import { useFormik } from 'formik';

interface propsUseFormikAdapter {
    initialValues?: any;
    validationSchema?: any;
    onSubmit?: (value: any) => void;
}

export interface IFormikAdapter<T = any> {
    setValue: (value: Partial<T>) => void;
    onSubmit: () => Promise<any>;
    value: (key: string) => any;
    onBlur: {
        (e: React.FocusEvent<any, Element>): void;
        <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
    };
    onChange: (id: string, newValue?: any) => Promise<void>;
    helperText: (key: string) => any;
    error: (key: string) => boolean;
    values: T;
    limpar: () => void;
    limparFiltros: (valoresPadrao: Partial<T>) => void;
    helperTextObj: (obj: string, key: string) => string | undefined;
    errorObject: (obj: string, key: string) => boolean;
    setError: (field: string, mensagem?: string) => void;
    setErroObject: (obj: string, field: string, mensagem?: string) => void;
    helperTextArray: (index: number, key: string, keyObject: string) => any;
    errorArray: (index: number, key: string, keyObject: string) => boolean;
    restartErros: () => void;
    getRequiredFields: () => string[];
}

export function useFormikAdapter<T = any>(
    props: propsUseFormikAdapter,
): IFormikAdapter<T> {
    const formik = useFormik({
        initialValues: props.initialValues ?? {},
        validationSchema: props.validationSchema,
        onSubmit: props.onSubmit!,
    });

    function touchedFromErrors(errors: any): any {
        return Object.keys(errors).reduce((acc, key) => {
            acc[key] =
                errors[key] && typeof errors[key] === 'object'
                    ? touchedFromErrors(errors[key])
                    : true;
            return acc;
        }, {} as any);
    }

    async function onSubmit() {
        const errors = await formik.validateForm();

        if (Object.keys(errors).length) {
            formik.setTouched(touchedFromErrors(errors), false);
            return;
        }

        await formik.submitForm();
    }

    function setValue(value: any) {
        formik.setValues({
            ...formik.values,
            ...value,
        });
    }

    async function onChange(id: string, newValue?: any) {
        if (id?.includes('.')) {
            const ids = id.split('.');
            let valorFinal = newValue;
            for (let i = ids.length - 1; i > 0; i--) {
                const currentValues = ids
                    .slice(0, i)
                    .reduce(
                        (acc, key) => formik.values[key] || acc[key] || {},
                        formik.values,
                    );

                valorFinal = {
                    ...currentValues,
                    [ids[i]]: valorFinal,
                };
            }

            await formik.setValues({
                ...formik.values,
                [ids[0]]: valorFinal,
            });
            return;
        }

        await formik.setValues({
            ...formik.values,
            [id]: newValue,
        });
    }

    async function limpar() {
        await formik.setValues(props.initialValues ?? {});
        formik.setErrors({});
        formik.setTouched({}, false);
    }

    function limparFiltros(valoresPadrao: Partial<T>) {
        formik.setValues(valoresPadrao);
        formik.setErrors({});
        formik.setTouched({}, false);
    }

    function helperTextObj(obj: string, key: string): string | undefined {
        const touched = formik.touched[obj] as any;
        const errors = formik.errors[obj] as any;

        if (touched && errors) {
            return touched[key] && errors[key];
        }
        return '';
    }

    function errorObject(obj: string, key: string): boolean {
        const touched = formik.touched[obj] as any;
        const errors = formik.errors[obj] as any;

        if (touched && errors) {
            return !!(touched[key] && errors[key]);
        }
        return false;
    }

    function setError(field: string, mensagem?: string) {
        formik.setFieldTouched(field, true, false);
        formik.setFieldError(field, mensagem ?? 'Este campo é obrigatório!');
    }

    function setErroObject(obj: string, field: string, mensagem?: string) {
        const touched = formik.touched[obj] as any;
        const errors = formik.errors[obj] as any;

        if (touched && errors) {
            formik.setTouched(
                {
                    ...formik.touched,
                    [obj]: {
                        ...touched,
                        [field]: true,
                    },
                },
                false,
            );
            formik.setErrors({
                ...formik.errors,
                [obj]: {
                    ...errors,
                    [field]: mensagem ?? 'Este campo é obrigatório!',
                },
            });
        } else {
            formik.setTouched(
                {
                    ...formik.touched,
                    [obj]: {
                        [field]: true,
                    },
                },
                false,
            );
            formik.setErrors({
                ...formik.errors,
                [obj]: {
                    [field]: mensagem ?? 'Este campo é obrigatório!',
                },
            });
        }
    }

    function getRequiredFields(): string[] {
        if (!props.validationSchema) return [];

        try {
            const description = props.validationSchema.describe();
            if (description.fields) {
                return Object.keys(description.fields)
                    .filter((fieldName) => {
                        return !description.fields[fieldName]?.optional;
                    })
                    .map((field) => {
                        return description.fields[field]?.label;
                    });
            }
        } catch {
            console.warn('Fallback para detecção manual de campos obrigatórios');
        }
        return [];
    }

    function helperTextArray(
        index: number,
        key: string,
        keyObject: string,
    ): any {
        const arrTouched = formik.touched[key] as Array<any>;
        const arrErrors = formik.errors[key] as Array<any>;

        if (arrTouched && arrErrors) {
            return (
                arrTouched[index]?.[keyObject] && arrErrors[index]?.[keyObject]
            );
        }
        return '';
    }

    function errorArray(
        index: number,
        key: string,
        keyObject: string,
    ): boolean {
        const touched = formik.touched[key] as Array<any>;
        const errors = formik.errors[key] as Array<any>;

        if (touched && errors) {
            return !!(touched[index]?.[keyObject] && errors[index]?.[keyObject]);
        }
        return false;
    }

    function restartErros() {
        formik.setErrors({});
        formik.setTouched({}, false);
    }

    return {
        setValue,
        onSubmit,
        value: (key: string) => formik.values[key],
        onBlur: formik.handleBlur,
        onChange,
        helperText: (key: string): any =>
            formik.touched[key] && formik.errors[key],
        error: (key: string) => !!(formik.touched[key] && formik.errors[key]),
        values: formik.values as T,
        limpar,
        limparFiltros,
        helperTextObj,
        errorObject,
        setError,
        setErroObject,
        restartErros,
        getRequiredFields,
        errorArray,
        helperTextArray,
    };
}
