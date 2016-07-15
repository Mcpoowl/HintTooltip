/*global logger*/
/*
    HintTooltip
    ========================

    @file      : HintTooltip.js
    @version   : 1.0.0
    @author    : Paul Ketelaars
    @date      : 2016-07-15
    @copyright : TimeSeries 2016
    @license   : Apache 2

    Documentation
    ========================
    Show a tooltip which some flair
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",
    "dojo/query",
    "dojo/dom-attr",

    "dojo/text!HintTooltip/widget/template/HintTooltip.html"
], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, dojoLang, dojoText, dojoHtml, dojoEvent, query, attr, widgetTemplate) {
    "use strict";


    // Declare widget's prototype.
    return declare("HintTooltip.widget.HintTooltip", [ _WidgetBase, _TemplatedMixin ], {
        // _TemplatedMixin will create our dom node using this HTML template.
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
        _handles: null,
        _contextObj: null,
        _ttText: "No text here",

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            //logger.level(logger.DEBUG);
            logger.debug(this.id + ".constructor");
            this._handles = [];
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            logger.debug(this.id + ".postCreate");

            this._updateRendering();
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            logger.debug(this.id + ".update");

            this._contextObj = obj;
            logger.debug(this.tooltipMessage);
            this._tooltip = this.tooltipClass;
            logger.debug(this.id+ '_tooltip' + this._tooltip)


            if (this.tooltipDataSource !== "") {
                logger.debug(this.id + "microflowSource")
                this._getTooltipMessage(this.tooltipDataSource, this._contextObj.getGuid(), dojoLang.hitch(this, function (string) {
                    this._ttText = string;
                    logger.debug("ttText: " + this._ttText)
                    this._setTooltip(callback);
                }));
            } else if (this.tooltipMessage !== "") {
                logger.debug(this.id + "TextStringSource")
                this._ttText = this.tooltipMessage;
                logger.debug("ttText: " + this._ttText)
                this._setTooltip(callback);
            } else {
                this._setTooltip(callback);
            }



            this._updateRendering(callback); // We're passing the callback to updateRendering to be called after DOM-manipulation
        },

        _setTooltip: function(obj, callback) {
            logger.debug("this is my tooltip now: " + this._tooltip);
              var nodeList = dojo.query('.'+this._tooltip)//.addClass(this._tooltip.replace(/_/g,'-') + " " + this.tooltipLocation.replace(/_/g,'-') + " " + this.tooltipSize.replace(/_/g,'-') + " " + this.tooltipAnimation.replace(/_/g,'-') + " " + this.tooltipModifier.replace(/_/g,'-'))
              logger.debug("nodeList: " + nodeList);
                              nodeList.forEach(dojoLang.hitch(this, function(node, index, arr) {
                    logger.debug("Node: " + node)
                     attr.set(node, "class", this._tooltip.replace(/_/g,'-') + " " + this.tooltipLocation.replace(/_/g,'-') + " " + this.tooltipSize.replace(/_/g,'-') + " " + this.tooltipAnimation.replace(/_/g,'-') + " " + this.tooltipModifier.replace(/_/g,'-'))
                     attr.set(node, "aria-label", this._ttText);
                     if(this.tooltipShow) {
                         dojoClass.add(node, "hint--always")
                     }
                     if(this.tooltipEdges)
                     {
                         dojoClass.add(node, "hint--rounded")
                     }


                 }));          

        },

         _getTooltipMessage: function (mf, guid, cb) {
            logger.debug(this.id + "._getTooltipMessage");

             var mfParams = {
                 actionname: mf
             };

             if (guid) {
                 mfParams.applyto = "selection";
                 mfParams.guids = [ guid ];
             }

             mx.data.action({
                 params: mfParams,
                 store: {
                     caller: this.mxform
                 },
                 callback: dojoLang.hitch(this, function (res) {
                     if (cb && typeof cb === "function") {
                         cb(res);
                     }
                 }),
                 error: dojoLang.hitch(this, function (error) {
                    console.warn(this.id + "._getTooltipMessage error: " + error.description);
                })
             }, this);

        },


        // mxui.widget._WidgetBase.enable is called when the widget should enable editing. Implement to enable editing if widget is input widget.
        enable: function () {
          logger.debug(this.id + ".enable");
        },

        // mxui.widget._WidgetBase.enable is called when the widget should disable editing. Implement to disable editing if widget is input widget.
        disable: function () {
          logger.debug(this.id + ".disable");
        },

        // mxui.widget._WidgetBase.resize is called when the page's layout is recalculated. Implement to do sizing calculations. Prefer using CSS instead.
        resize: function (box) {
          logger.debug(this.id + ".resize");
        },

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function () {
          logger.debug(this.id + ".uninitialize");
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        },

        // Rerender the interface.
        _updateRendering: function (callback) {
            logger.debug(this.id + "._updateRendering");


            // The callback, coming from update, needs to be executed, to let the page know it finished rendering
            mendix.lang.nullExec(callback);
        }
    });
});

require(["HintTooltip/widget/HintTooltip"]);
