/*global logger*/
/*
    ListenListviewSetter
    ========================

    @file      : ListenListviewSetter.js
    @version   : 1.0.0
    @author    : Willem Gorisse
    @date      : 2018-7-9
    @copyright : Mendix 2018
    @license   : Apache 2

    Documentation
    ========================
    Setting the selected state on a listen to listview when loaded. Hence offering the visual feedback to the user that an element is indeed selected.
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
    "dojo/query",
    "dojo/NodeList-traverse",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",

    "dojo/text!ListenListviewSetter/widget/template/ListenListviewSetter.html"
], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoQuery, dojoTraverse, dojoStyle, dojoConstruct, dojoArray, dojoLang, dojoText, dojoHtml, dojoEvent, widgetTemplate) {
    "use strict";

    // Declare widget's prototype.
    return declare("ListenListviewSetter.widget.ListenListviewSetter", [ _WidgetBase, _TemplatedMixin ], {
        // _TemplatedMixin will create our dom node using this HTML template.
        templateString: widgetTemplate,

        // DOM elements
        inputNodes: null,
        colorSelectNode: null,
        colorInputNode: null,
        infoTextNode: null,

        // Parameters configured in the Modeler.
        targetName: "",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _targetNameNode: null,
        _targetListNode: null,
        _pageloadListener: null,
        _targetFirstChildNode: null,
        _contextObj: null,
        _selectedClass: "selected",

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            logger.debug(this.id + ".constructor");
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            this.targetName = ".mx-name-" + this.targetName;
            this.targetName = this.targetName.trim();

            this._setupEvents();
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            logger.debug(this.id + ".update");

            this._contextObj = obj;

            // we don't need the callback as we're only starting to work after the page is done via the onNavigate
            this._executeCallback(callback, "update");
        },

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function () {
            logger.debug(this.id + ".uninitialize");
            this.disconnect(this._pageloadListener);
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        },

        // method for starting up the widget after the page has been created
        _onNavigate: function() { 
            this._findDomNodes();
        },

        _findDomNodes: function() {
            this._targetNameNode = dojoQuery(this.targetName);
            this._targetNameNode = this._targetNameNode[0];

            if (this._targetNameNode !== null && this._targetNameNode !== undefined) {
                this._targetFirstChildNode = this._selectFirstElement(this._targetNameNode);
                if (this._targetFirstChildNode !== false) {
                    this._resetSubscriptions();
                    this._updateRendering();
                } else {
                    logger.debug(this.id + "listview items were not found");
                }
            } else {
                logger.debug(this.id + "listview was not found");
            }
        },

        // method for selecting the first child of the listview
        _selectFirstElement: function(listview) {
            var listNode, listviewItemNode;
            
            listNode = dojoQuery("ul.mx-list", listview)[0]; 
            if (listNode !== null && listNode !== undefined) {
                this._targetListNode = listNode;
                listviewItemNode = dojoTraverse(listNode).children();

                if (listviewItemNode !== null && listviewItemNode !== undefined && listviewItemNode.length > 0) {
                    listviewItemNode = listviewItemNode[0];
                    return listviewItemNode;
                } else {
                    return false;
                }
            }
            // search has failed so it returns false
            return false;
        },

        
        // Attach events to HTML dom elements
        _setupEvents: function () {
            this._pageloadListener = this.connect(this.mxform, "onNavigation", dojoLang.hitch(this,this._onNavigate));
        },

        // Rerender the interface.
        _updateRendering: function () {
            logger.debug(this.id + "._updateRendering");
            this._setNodeSelected(this._targetFirstChildNode);
            // get rid of domnode as we don't need it
            if (this.domNode) {
                dojoConstruct.destroy(this.domNode);
            }
        },

        // sets the selected class on the node
        _setNodeSelected: function(node) {
            dojoClass.add(node,this._selectedClass);
        },

        // Reset subscriptions.
        _resetSubscriptions: function () {
            logger.debug(this.id + "._resetSubscriptions");
            // Release handles on previous object, if any.
            //this.disconnect(this._pageloadListener);
            this.unsubscribeAll();

            // When a mendix object exists create subscribtions.
            if (this._contextObj) {
                this.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: dojoLang.hitch(this, function (guid) {
                        //this._updateRendering();
                    })
                });
            }
        },

        _executeCallback: function (cb, from) {
            logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});

require(["ListenListviewSetter/widget/ListenListviewSetter"]);
