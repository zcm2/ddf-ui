import { __assign, __read, __rest } from "tslib";
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
import LocationOldModel from '../../component/location-old/location-old';
import wreqr from '../../js/wreqr';
import { Drawing, useIsDrawing } from '../../component/singletons/drawing';
import { useBackbone } from '../../component/selection-checkbox/useBackbone.hook';
import { hot } from 'react-hot-loader';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Line from './line';
import Polygon from './polygon';
import PointRadius from './point-radius';
import BoundingBox from './bounding-box';
import Gazetteer from './gazetteer';
import ShapeUtils from '../../js/ShapeUtils';
import ExtensionPoints from '../../extension-points/extension-points';
var BaseInputs = {
    line: {
        label: 'Line',
        Component: Line
    },
    poly: {
        label: 'Polygon',
        Component: Polygon
    },
    circle: {
        label: 'Point-Radius',
        Component: PointRadius
    },
    bbox: {
        label: 'Bounding Box',
        Component: BoundingBox
    },
    keyword: {
        label: 'Keyword',
        Component: function (_a) {
            var setState = _a.setState, keywordValue = _a.keywordValue, props = __rest(_a, ["setState", "keywordValue"]);
            return (
            // Offsets className="form-group flow-root" below
            React.createElement("div", null,
                React.createElement(Gazetteer, __assign({}, props, { value: keywordValue, setState: function (_a) {
                        var value = _a.value, data = __rest(_a, ["value"]);
                        setState(__assign({ keywordValue: value }, data));
                    }, setBufferState: function (key, value) {
                        var _a;
                        return setState((_a = {}, _a[key] = value, _a));
                    }, variant: "outlined" }))));
        }
    }
};
var drawTypes = ['line', 'poly', 'circle', 'bbox'];
function getCurrentValue(_a) {
    var locationModel = _a.locationModel;
    var modelJSON = locationModel.toJSON();
    var type;
    if (modelJSON.polygon !== undefined) {
        type = ShapeUtils.isArray3D(modelJSON.polygon) ? 'MULTIPOLYGON' : 'POLYGON';
    }
    else if (modelJSON.lat !== undefined &&
        modelJSON.lon !== undefined &&
        modelJSON.radius !== undefined) {
        type = 'POINTRADIUS';
    }
    else if (modelJSON.line !== undefined &&
        modelJSON.lineWidth !== undefined) {
        type = 'LINE';
    }
    else if (modelJSON.north !== undefined &&
        modelJSON.south !== undefined &&
        modelJSON.east !== undefined &&
        modelJSON.west !== undefined) {
        type = 'BBOX';
    }
    return Object.assign(modelJSON, {
        type: type,
        lineWidth: modelJSON.lineWidth,
        radius: modelJSON.radius
    });
}
function updateMap(_a) {
    var locationModel = _a.locationModel;
    var mode = locationModel.get('mode');
    if (mode !== undefined && Drawing.isDrawing() !== true) {
        ;
        wreqr.vent.trigger('search:' + mode + 'display', locationModel);
    }
}
export var LocationContext = React.createContext({
    filterInputPredicate: function (_name) {
        return true;
    }
});
var LocationInput = function (_a) {
    var onChange = _a.onChange, value = _a.value;
    var inputs = React.useMemo(function () {
        return ExtensionPoints.locationTypes(BaseInputs);
    }, [ExtensionPoints.locationTypes]);
    var locationContext = React.useContext(LocationContext);
    var _b = __read(React.useState(new LocationOldModel(value)), 1), locationModel = _b[0];
    var _c = __read(React.useState(locationModel.toJSON()), 2), state = _c[0], setState = _c[1];
    var isDrawing = useIsDrawing();
    var _d = useBackbone(), listenTo = _d.listenTo, stopListening = _d.stopListening;
    React.useEffect(function () {
        return function () {
            setTimeout(function () {
                // This is to facilitate clearing out the map, it isn't about the value, but we don't want the changeCallback to fire!
                locationModel.set(locationModel.defaults());
                wreqr.vent.trigger('search:drawend', [locationModel]);
            }, 0);
        };
    }, []);
    React.useEffect(function () {
        var onChangeCallback = function () {
            setState(locationModel.toJSON());
            updateMap({ locationModel: locationModel });
            onChange(getCurrentValue({ locationModel: locationModel }));
        };
        listenTo(locationModel, 'change', onChangeCallback);
        return function () {
            stopListening(locationModel, 'change', onChangeCallback);
        };
    }, [onChange]);
    var ComponentToRender = inputs[state.mode]
        ? inputs[state.mode].Component
        : function () { return null; };
    var options = Object.entries(inputs)
        .map(function (entry) {
        var _a = __read(entry, 2), key = _a[0], value = _a[1];
        return {
            label: value.label,
            value: key
        };
    })
        .filter(function (value) {
        return locationContext.filterInputPredicate(value.value);
    });
    return (React.createElement("div", null,
        React.createElement("div", null,
            React.createElement(Autocomplete, { className: "mb-2", "data-id": "filter-type-autocomplete", fullWidth: true, size: "small", options: options, getOptionLabel: function (option) { return option.label; }, getOptionSelected: function (option, value) {
                    return option.value === value.value;
                }, onChange: function (_e, newValue) {
                    locationModel.set('mode', newValue.value);
                }, disableClearable: true, value: options.find(function (opt) { return opt.value === state.mode; }) || {
                    value: '',
                    label: ''
                }, renderInput: function (params) { return (React.createElement(TextField, __assign({}, params, { variant: "outlined", placeholder: "Select Location Option" }))); } }),
            React.createElement("div", { className: "form-group flow-root" },
                React.createElement(ComponentToRender, __assign({}, state, { setState: function (args) {
                        locationModel.set(args); // always update the locationModel, that's our "source of truth", above we map this back into state by listening to changes
                    } })),
                drawTypes.includes(state.mode) ? (isDrawing && locationModel === Drawing.getDrawModel() ? (React.createElement(Button, { className: "location-draw mt-2", onClick: function () {
                        ;
                        wreqr.vent.trigger('search:drawcancel', locationModel);
                    }, color: "secondary", fullWidth: true },
                    React.createElement("span", { className: "ml-2" }, "Cancel Drawing"))) : (React.createElement(Button, { className: "location-draw mt-2", onClick: function () {
                        ;
                        wreqr.vent.trigger('search:draw' + state.mode, locationModel);
                    }, color: "primary", fullWidth: true },
                    React.createElement("span", { className: "fa fa-globe" }),
                    React.createElement("span", { className: "ml-2" }, "Draw")))) : null))));
};
export default hot(module)(LocationInput);
//# sourceMappingURL=location.js.map