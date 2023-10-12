/// <reference types="react" />
import { LazyQueryResult } from '../../../js/model/LazyQueryResult/LazyQueryResult';
export declare const useCustomReadOnlyCheck: () => {
    loading: boolean;
    isNotWritable: ({ attribute, lazyResult, }: {
        attribute: string;
        lazyResult: LazyQueryResult;
    }) => boolean;
};
declare const _default: ({ startingLeft, startingRight, startingHideEmpty, lazyResult, onSave, }: {
    startingLeft: string[];
    startingRight: string[];
    startingHideEmpty?: boolean | undefined;
    lazyResult?: LazyQueryResult | undefined;
    onSave: (arg: string[], hideEmpty: boolean | undefined) => void;
}) => JSX.Element;
export default _default;
