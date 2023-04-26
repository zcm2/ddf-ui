import { __assign, __read } from "tslib";
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
import React from 'react';
import DistanceUtils from '../../../../js/DistanceUtils';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'cesi... Remove this comment to see the full error message
import Cesium from 'cesium/Build/Cesium/Cesium';
import _ from 'underscore';
import * as Turf from '@turf/turf';
import { validateGeo } from '../../../../react-component/utils/validation';
import { useListenTo } from '../../../selection-checkbox/useBackbone.hook';
import { useRender } from '../../../hooks/useRender';
import { removeOldDrawing } from './drawing-and-display';
import { getIdFromModelForDisplay } from '../drawing-and-display';
import DrawHelper from '../../../../lib/cesium-drawhelper/DrawHelper';
import utility from './utility';
var toDeg = Cesium.Math.toDegrees;
var CAMERA_MAGNITUDE_THRESHOLD = 8000000;
var getCurrentMagnitudeFromMap = function (_a) {
    var map = _a.map;
    return map.getMap().camera.getMagnitude();
};
var needsRedraw = function (_a) {
    var map = _a.map, drawnMagnitude = _a.drawnMagnitude;
    var currentMagnitude = getCurrentMagnitudeFromMap({ map: map });
    if (currentMagnitude < CAMERA_MAGNITUDE_THRESHOLD &&
        drawnMagnitude > CAMERA_MAGNITUDE_THRESHOLD) {
        return true;
    }
    if (currentMagnitude > CAMERA_MAGNITUDE_THRESHOLD &&
        drawnMagnitude < CAMERA_MAGNITUDE_THRESHOLD) {
        return true;
    }
    return false;
};
export var constructSolidLinePrimitive = function (_a) {
    var coordinates = _a.coordinates, model = _a.model, id = _a.id, color = _a.color, buffer = _a.buffer;
    var _color = color || model.get('color');
    return {
        width: 4,
        material: Cesium.Material.fromType('Color', {
            color: _color
                ? Cesium.Color.fromCssColorString(_color)
                : Cesium.Color.KHAKI
        }),
        id: id,
        positions: Cesium.Cartesian3.fromDegreesArray(_.flatten(coordinates)),
        buffer: buffer
    };
};
export var constructOutlinedLinePrimitive = function (_a) {
    var coordinates = _a.coordinates, model = _a.model, id = _a.id, color = _a.color, buffer = _a.buffer;
    var _color = color || model.get('color');
    return __assign(__assign({}, constructSolidLinePrimitive({ coordinates: coordinates, model: model, id: id, color: color, buffer: buffer })), { width: 8, material: Cesium.Material.fromType('PolylineOutline', {
            color: _color
                ? Cesium.Color.fromCssColorString(_color)
                : Cesium.Color.KHAKI,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 4
        }) });
};
var positionsToLine = function (positions, ellipsoid) {
    return {
        line: positions.map(function (cartPos) {
            var latLon = ellipsoid.cartesianToCartographic(cartPos);
            var lon = toDeg(latLon.longitude);
            var lat = toDeg(latLon.latitude);
            return [
                DistanceUtils.coordinateRound(lon),
                DistanceUtils.coordinateRound(lat),
            ];
        })
    };
};
var drawGeometry = function (_a) {
    var _b;
    var model = _a.model, map = _a.map, id = _a.id, setDrawnMagnitude = _a.setDrawnMagnitude, onDraw = _a.onDraw;
    var json = model.toJSON();
    var linePoints = json.line;
    if (linePoints === undefined ||
        ((_b = validateGeo('line', JSON.stringify(linePoints))) === null || _b === void 0 ? void 0 : _b.error)) {
        map.getMap().scene.requestRender();
        return;
    }
    // Create a deep copy since we may modify some of these positions for display purposes
    linePoints = JSON.parse(JSON.stringify(json.line));
    linePoints.forEach(function (point) {
        point[0] = DistanceUtils.coordinateRound(point[0]);
        point[1] = DistanceUtils.coordinateRound(point[1]);
    });
    var setArr = _.uniq(linePoints);
    if (setArr.length < 2) {
        return;
    }
    var turfLine = Turf.lineString(setArr);
    var lineWidth = DistanceUtils.getDistanceInMeters(json.lineWidth, model.get('lineUnits'));
    var cameraMagnitude = map.getMap().camera.getMagnitude();
    setDrawnMagnitude(cameraMagnitude);
    removeOldDrawing({ map: map, id: id });
    var primitive;
    if (onDraw) {
        primitive = new DrawHelper.PolylinePrimitive(constructSolidLinePrimitive({
            coordinates: turfLine.geometry.coordinates,
            model: model,
            id: id,
            color: 'blue',
            buffer: lineWidth
        }));
        primitive.setEditable();
        primitive.addListener('onEdited', function (event) {
            var line = positionsToLine(event.positions, map.getMap().scene.globe.ellipsoid);
            onDraw(line);
        });
    }
    else {
        var bufferedLine = turfLine;
        var isBuffered = lineWidth > 0;
        if (isBuffered) {
            utility.adjustGeoCoords(turfLine);
            bufferedLine = Turf.buffer(turfLine, Math.max(lineWidth, 1), {
                units: 'meters'
            });
            if (!bufferedLine) {
                return;
            }
            // need to adjust the points again AFTER buffering, since buffering undoes the antimeridian adjustments
            utility.adjustGeoCoords(bufferedLine);
        }
        primitive = new Cesium.PolylineCollection();
        primitive.id = id;
        primitive.add(constructOutlinedLinePrimitive({
            coordinates: bufferedLine.geometry.coordinates,
            model: model,
            id: id
        }));
    }
    map.getMap().scene.primitives.add(primitive);
    map.getMap().scene.requestRender();
};
var useCameraMagnitude = function (_a) {
    var map = _a.map;
    var _b = __read(React.useState(0), 2), cameraMagnitude = _b[0], setCameraMagnitude = _b[1];
    var _c = __read(React.useState(false), 2), isMoving = _c[0], setIsMoving = _c[1];
    var render = useRender();
    React.useEffect(function () {
        var startListener = function () { return setIsMoving(true); };
        var endListener = function () { return setIsMoving(false); };
        map === null || map === void 0 ? void 0 : map.getMap().scene.camera.moveStart.addEventListener(startListener);
        map === null || map === void 0 ? void 0 : map.getMap().scene.camera.moveEnd.addEventListener(endListener);
        return function () {
            map === null || map === void 0 ? void 0 : map.getMap().scene.camera.moveStart.removeEventListener(startListener);
            map === null || map === void 0 ? void 0 : map.getMap().scene.camera.moveEnd.removeEventListener(endListener);
        };
    }, [map]);
    React.useEffect(function () {
        if (isMoving) {
            var animationId_1 = window.requestAnimationFrame(function () {
                setCameraMagnitude(getCurrentMagnitudeFromMap({ map: map }));
            });
            return function () {
                window.cancelAnimationFrame(animationId_1);
            };
        }
        return function () { };
    }, [isMoving, render]);
    return [cameraMagnitude, setCameraMagnitude];
};
var useListenToLineModel = function (_a) {
    var model = _a.model, map = _a.map, onDraw = _a.onDraw, newLine = _a.newLine;
    var _b = __read(useCameraMagnitude({ map: map }), 1), cameraMagnitude = _b[0];
    var _c = __read(React.useState(0), 2), drawnMagnitude = _c[0], setDrawnMagnitude = _c[1];
    var callback = React.useMemo(function () {
        return function () {
            if (map) {
                if (newLine) {
                    // Clone the model to display the new line drawn because we don't
                    // want to update the existing model unless the user clicks Apply.
                    var newModel = model.clone();
                    newModel.set(newLine);
                    drawGeometry({
                        map: map,
                        model: newModel,
                        id: getIdFromModelForDisplay({ model: model }),
                        setDrawnMagnitude: setDrawnMagnitude,
                        onDraw: onDraw
                    });
                }
                else if (model) {
                    drawGeometry({
                        map: map,
                        model: model,
                        id: getIdFromModelForDisplay({ model: model }),
                        setDrawnMagnitude: setDrawnMagnitude,
                        onDraw: onDraw
                    });
                }
            }
        };
    }, [model, map, newLine]);
    useListenTo(model, 'change:line change:lineWidth change:lineUnits', callback);
    React.useEffect(function () {
        if (map && needsRedraw({ map: map, drawnMagnitude: drawnMagnitude })) {
            callback();
        }
    }, [cameraMagnitude, drawnMagnitude, callback, map]);
    React.useEffect(function () {
        callback();
    }, [callback]);
};
var useStartMapDrawing = function (_a) {
    var map = _a.map, model = _a.model, setNewLine = _a.setNewLine, onDraw = _a.onDraw;
    React.useEffect(function () {
        if (map && model) {
            map.getMap().drawHelper["startDrawingPolyline"]({
                callback: function (positions) {
                    var drawnLine = positionsToLine(positions, map.getMap().scene.globe.ellipsoid);
                    var line = drawnLine.line;
                    //this shouldn't ever get hit because the draw library should protect against it, but just in case it does, remove the point
                    if (line.length > 3 &&
                        line[line.length - 1][0] === line[line.length - 2][0] &&
                        line[line.length - 1][1] === line[line.length - 2][1]) {
                        line.pop();
                    }
                    setNewLine(drawnLine);
                    onDraw(drawnLine);
                },
                material: Cesium.Material.fromType('Color', {
                    color: Cesium.Color.BLUE
                })
            });
        }
    }, [map, model]);
};
export var CesiumLineDisplay = function (_a) {
    var map = _a.map, model = _a.model, onDraw = _a.onDraw;
    // Use state to store the line drawn by the user before they click Apply or Cancel.
    // When the user clicks Draw, they are allowed to edit the existing line (if it
    // exists), or draw a new line. If they draw a new line, save it to state then show
    // it instead of the draw model because we don't want to update the draw model
    // unless the user clicks Apply.
    var _b = __read(React.useState(null), 2), newLine = _b[0], setNewLine = _b[1];
    if (onDraw) {
        useStartMapDrawing({ map: map, model: model, onDraw: onDraw, setNewLine: setNewLine });
    }
    useListenToLineModel({ map: map, model: model, onDraw: onDraw, newLine: newLine });
    React.useEffect(function () {
        return function () {
            if (model && map) {
                removeOldDrawing({ map: map, id: getIdFromModelForDisplay({ model: model }) });
                map.getMap().drawHelper.stopDrawing();
            }
        };
    }, [map, model]);
    return React.createElement(React.Fragment, null);
};
//# sourceMappingURL=line-display.js.map