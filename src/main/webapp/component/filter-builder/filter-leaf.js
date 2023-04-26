import { __assign, __read } from "tslib";
import * as React from 'react';
import { hot } from 'react-hot-loader';
import Button from '@material-ui/core/Button';
import useTheme from '@material-ui/core/styles/useTheme';
import { HoverButton } from '../button/hover';
import { FilterClass } from './filter.structure';
import Filter from '../../react-component/filter/filter';
import { Memo } from '../memo/memo';
var FilterLeaf = function (_a) {
    var filter = _a.filter, setFilter = _a.setFilter;
    var _b = __read(React.useState(false), 2), hover = _b[0], setHover = _b[1];
    var theme = useTheme();
    return (React.createElement("div", { className: "relative", onMouseOver: function () {
            setHover(true);
        }, onMouseOut: function () {
            setHover(false);
        } },
        filter.negated ? (React.createElement(HoverButton, { "data-id": "remove-not-button", className: "absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 py-0 px-1 text-xs z-10", color: "primary", variant: "contained", onClick: function () {
                setFilter(new FilterClass(__assign(__assign({}, filter), { negated: !filter.negated })));
            } }, function (_a) {
            var hover = _a.hover;
            if (hover) {
                return React.createElement(React.Fragment, null, "Remove Not");
            }
            else {
                return React.createElement(React.Fragment, null, "NOT");
            }
        })) : (React.createElement(Button, { "data-id": "not-field-button", className: "".concat(hover ? 'opacity-25' : 'opacity-0', " hover:opacity-100 focus:opacity-100 transition-opacity duration-200 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 py-0 px-1 text-xs z-10"), color: "primary", variant: "contained", onClick: function () {
                setFilter(new FilterClass(__assign(__assign({}, filter), { negated: !filter.negated })));
            } }, "+ Not Field")),
        React.createElement("div", { className: "".concat(filter.negated ? 'border px-3 py-4 mt-2' : '', " transition-all duration-200"), style: {
                borderColor: theme.palette.primary.main
            } },
            React.createElement(Memo, { dependencies: [filter, setFilter] },
                React.createElement(Filter, { filter: filter, setFilter: setFilter })))));
};
export default hot(module)(FilterLeaf);
//# sourceMappingURL=filter-leaf.js.map