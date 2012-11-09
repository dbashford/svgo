var intersectAttrs = require('../lib/svgo/tools').intersectAttrs;

/**
 * Collapse content's intersected attributes to the existing group wrapper.
 *
 * @example
 * <g attr1="val1">
 *     <g attr2="val2">
 *         text
 *     </g>
 *     <circle attr2="val2" attr3="val3"/>
 * </g>
 *              ⬇
 * <g attr1="val1" attr2="val2">
 *     <g>
 *         text
 *     </g>
 *    <circle attr3="val3"/>
 * </g>
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.moveElemsAttrsToGroup = function(item, params) {

    if (item.isElem('g') && !item.isEmpty() && item.content.length > 1) {

        var intersection = {},
            hasTransform = false,
            every = item.content.every(function(g) {
                if (g.elem && g.attrs) {
                    if (!Object.keys(intersection).length) {
                        intersection = g.attrs;
                    } else {
                        intersection = intersectAttrs(intersection, g.attrs);

                        if (!intersection) return false;
                    }

                    return true;
                }
            });


        if (every) {
            item.content.forEach(function(g) {
                for (var name in intersection) {
                    g.removeAttr(name);

                    if (name === 'transform') {
                        if (!hasTransform) {
                            item.attr('transform').value += ' ' + intersection[name].value;
                            hasTransform = true;
                        }
                    } else {
                        item.addAttr(intersection[name]);
                    }
                }
            });
        }

    }

};
