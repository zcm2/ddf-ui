import { TextFieldProps } from '@material-ui/core/TextField';
type CustomInputOrDefaultType = {
    value: string;
    onChange: (e: string) => void;
    props?: Partial<TextFieldProps>;
};
export declare const CustomInputOrDefaultPostValidation: ({ value, onChange, props, }: CustomInputOrDefaultType) => JSX.Element;
export declare const CustomInputOrDefault: (props: CustomInputOrDefaultType) => JSX.Element | null;
export {};
