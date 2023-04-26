export declare const CesiumImageryProviderTypes: {
    [key: string]: any;
};
import { Subscribable } from '../model/Base/base-classes';
import { Layers } from './layers';
type MakeMapType = {
    cesiumOptions: any;
    element: HTMLElement;
};
export declare class CesiumLayers extends Subscribable<''> {
    layers: Layers;
    map: any;
    isMapCreated: boolean;
    layerForCid: any;
    backboneModel: any;
    layerOrder: Array<any>;
    constructor();
    makeMap(options: MakeMapType): any;
    initLayer(model: any): void;
    addLayer(): void;
    removeLayer(): void;
    setAlpha(model: any): void;
    setShow(model: any): void;
    reIndexLayers(): void;
}
export {};
