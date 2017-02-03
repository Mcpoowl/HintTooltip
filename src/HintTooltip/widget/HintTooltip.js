/*global logger*/
/*
    HintTooltip
    ========================

    @file      : HintTooltip.js
    @version   : 1.1.0
    @author    : Paul Ketelaars
    @date      : 2016-07-15
    @copyright : TimeSeries 2016
    @license   : Apache 2

    Documentation
    ========================
    Show a tooltip which some flair
*/

define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",

    "dojo/dom-class",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/query",
    "dojo/dom-attr",

    "dojo/text!HintTooltip/widget/template/HintTooltip.html"
], function(declare, _WidgetBase, _TemplatedMixin, dojoClass, dojoArray, lang, query, attr, widgetTemplate) {
    "use strict";

    return declare("HintTooltip.widget.HintTooltip", [_WidgetBase, _TemplatedMixin], {

        templateString: widgetTemplate,

        // Parameters configured in the Modeler.
        tooltipClass: "",
        tooltipMessage: "",
        tooltipDataSource: "",
        tooltipLocation: "",
        tooltipModifier: "",
        tooltipSize: "",
        tooltipShow: "",
        tooltipEdges: "",
        tooltipAnimation: "",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _tooltip: "",
        _contextObj: null,
        _ttText: "No text here",

        update: function(obj, callback) {
            logger.debug(this.id + ".update");

            this._contextObj = obj;
            this._tooltip = this.tooltipClass;

            if (this.tooltipDataSource !== "" && this._contextObj) {
                logger.debug(this.id + ".update microflowSource");
                this._getTooltipMessage(this.tooltipDataSource, this._contextObj.getGuid(), lang.hitch(this, function(string) {
                    this._ttText = string;
                    this._setTooltip(callback);
                }));
            } else if (this.tooltipMessage !== "") {
                logger.debug(this.id + ".update TextStringSource");
                this._ttText = this.tooltipMessage;
                this._setTooltip(callback);
            } else {
                this._setTooltip(callback);
            }
        },

        _setTooltip: function(callback) {
            logger.debug(this.id + "._setTooltip :: this is my tooltip now: " + this._tooltip);
            var nodeList = dojo.query("." + this._tooltip); //.addClass(this._tooltip.replace(/_/g,"-") + " " + this.tooltipLocation.replace(/_/g,"-") + " " + this.tooltipSize.replace(/_/g,"-") + " " + this.tooltipAnimation.replace(/_/g,"-") + " " + this.tooltipModifier.replace(/_/g,"-"))

            nodeList.forEach(lang.hitch(this, function(node, index, arr) {
                attr.set(node, "class", this._tooltip.replace(/_/g, "-")
                    + " " + this.tooltipLocation.replace(/_/g, "-")
                    + " " + this.tooltipSize.replace(/_/g, "-")
                    + " " + this.tooltipAnimation.replace(/_/g, "-")
                    + " " + this.tooltipModifier.replace(/_/g, "-"));

                attr.set(node, "aria-label", this._ttText);
                if (this.tooltipShow) {
                    dojoClass.add(node, "hint--always");
                }
                if (this.tooltipEdges) {
                    dojoClass.add(node, "hint--rounded");
                }
            }));

            if (callback && typeof callback === "function") {
                callback();
            }

        },

        _getTooltipMessage: function(mf, guid, cb) {
            logger.debug(this.id + "._getTooltipMessage");

            var mfParams = {};
            if (guid) {
                mfParams.applyto = "selection";
                mfParams.guids = [guid];
            }

            mx.ui.action(mf, {
                params: mfParams,
                callback: lang.hitch(this, function(res) {
                    if (cb && typeof cb === "function") {
                        cb(res);
                    }
                }),
                error: lang.hitch(this, function(error) {
                    console.warn(this.id + "._getTooltipMessage error: " + error.description);
                })
            }, this);
        },

        resize: function(box) {
            // Keep the method in here
            // logger.debug(this.id + ".resize");
        }
    });
});

require(["HintTooltip/widget/HintTooltip"]);
