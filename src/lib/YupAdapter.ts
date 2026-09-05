import * as yup from 'yup';

export class YupAdapter {
    private shape: any;
    private message = 'Este campo é obrigatório!';
    constructor() {
        this.shape = {};
    }

    string(fieldName: string, message?: string, label?: string) {
        this.shape[fieldName] = yup
            .string()
            .required(message ?? this.message)
            .label(label ?? '');
        return this;
    }

    stringRequiredWhenEmpty(
        fieldName: string,
        dependencyFieldName: string,
        message?: string,
    ) {
        this.shape[fieldName] = yup.string().when(dependencyFieldName, {
            is: (value?: string) => !value,
            then: (schema) => schema.required(message ?? this.message),
            otherwise: (schema) => schema.notRequired(),
        });
        return this;
    }

    stringWithTests(
        fieldName: string,
        tests: Array<{
            name: string;
            message: string;
            test: (val?: string) => boolean;
        }>,
        message?: string,
    ) {
        let field = yup.string().required(message ?? this.message);
        tests.forEach(({ name, message: testMessage, test }) => {
            field = field.test(name, testMessage, (val) =>
                test(val ?? undefined),
            );
        });
        this.shape[fieldName] = field;
        return this;
    }

    number(fieldName: string, message?: string, min?: number) {
        this.shape[fieldName] = yup
            .number()
            .typeError(message ?? this.message)
            .min(min ?? 1, message ?? this.message)
            .required(message ?? this.message);
        return this;
    }

    email(fieldName: string, message?: string) {
        this.shape[fieldName] = yup
            .string()
            .email('E-mail inválido')
            .required(message ?? this.message);
        return this;
    }

    arrayOfObjectsOptional(fieldName: string, objectShape: any) {
        this.shape[fieldName] = yup.array().of(objectShape);
        return this;
    }

    object(obj: string, schema: any) {
        this.shape[obj] = schema;
        return this;
    }

    build() {
        return yup.object().shape(this.shape);
    }
}
