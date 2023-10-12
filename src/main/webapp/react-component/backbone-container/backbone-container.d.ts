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
import * as React from 'react';
import { Subtract } from '../../typescript';
export type WithBackboneProps = {
    listenTo: (object: any, events: string, callback: Function) => any;
    stopListening: (object?: any, events?: string | undefined, callback?: Function | undefined) => any;
    listenToOnce: (object: any, events: string, callback: Function) => any;
};
declare const withListenTo: <P extends WithBackboneProps>(Component: React.ComponentType<React.PropsWithChildren<P>>) => {
    new (props: Subtract<P, WithBackboneProps> | Readonly<Subtract<P, WithBackboneProps>>): {
        backbone: any;
        componentWillUnmount(): void;
        render(): JSX.Element;
        context: unknown;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Subtract<P, WithBackboneProps>>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Subtract<P, WithBackboneProps>>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Subtract<P, WithBackboneProps>>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Subtract<P, WithBackboneProps>>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Subtract<P, WithBackboneProps>>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Subtract<P, WithBackboneProps>>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Subtract<P, WithBackboneProps>>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Subtract<P, WithBackboneProps>>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Subtract<P, WithBackboneProps>>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Subtract<P, WithBackboneProps>, context: any): {
        backbone: any;
        componentWillUnmount(): void;
        render(): JSX.Element;
        context: unknown;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Subtract<P, WithBackboneProps>>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Subtract<P, WithBackboneProps>>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Subtract<P, WithBackboneProps>>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Subtract<P, WithBackboneProps>>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Subtract<P, WithBackboneProps>>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Subtract<P, WithBackboneProps>>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Subtract<P, WithBackboneProps>>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Subtract<P, WithBackboneProps>>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Subtract<P, WithBackboneProps>>, nextState: Readonly<{}>, nextContext: any): void;
    };
    contextType?: React.Context<any> | undefined;
};
export default withListenTo;
