declare function generateAnyGeoFilter(property: any, model: any): any;
declare function sanitizeGeometryCql(cqlString: any): any;
declare function getProperty(filter: any): any;
declare function generateIsEmptyFilter(property: any): {
    type: string;
    property: any;
    value: null;
};
declare function generateFilter(type: any, property: any, value: any, metacardDefinitions?: any): any;
declare function generateFilterForFilterFunction(filterFunctionName: any, params: any): {
    type: string;
    value: boolean;
    property: {
        type: string;
        filterFunctionName: any;
        params: any;
    };
};
declare function isGeoFilter(type: any): boolean;
declare function isPointRadiusFilter(filter: any): any;
declare function buildIntersectCQL(this: any, locationGeometry: any): string | undefined;
declare function arrayFromPolygonWkt(wkt: any): any;
declare const _default: {
    sanitizeGeometryCql: typeof sanitizeGeometryCql;
    getProperty: typeof getProperty;
    generateIsEmptyFilter: typeof generateIsEmptyFilter;
    generateAnyGeoFilter: typeof generateAnyGeoFilter;
    generateFilter: typeof generateFilter;
    generateFilterForFilterFunction: typeof generateFilterForFilterFunction;
    isGeoFilter: typeof isGeoFilter;
    isPolygonFilter: (filter: any) => any;
    isLineFilter: (filter: any) => any;
    isPointRadiusFilter: typeof isPointRadiusFilter;
    buildIntersectCQL: typeof buildIntersectCQL;
    arrayFromPolygonWkt: typeof arrayFromPolygonWkt;
};
export default _default;
