/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
import { LazyQueryResult } from './model/LazyQueryResult/LazyQueryResult';
declare const _default_1: {
    getClassByMetacardObject(metacard: LazyQueryResult['plain']): string;
    getUnicode(): string | {
        class: string;
        style: {
            code: string;
            font: string;
            size: string;
        };
    };
    getFont(): string | {
        class: string;
        style: {
            code: string;
            font: string;
            size: string;
        };
    };
    getSize(): string | {
        class: string;
        style: {
            code: string;
            font: string;
            size: string;
        };
    };
    getFullByMetacardObject(metacard: LazyQueryResult['plain']): {
        class: string;
        style: {
            code: string;
            font: string;
            size: string;
        };
    };
    getClassByName(name: string): string;
};
export default _default_1;
