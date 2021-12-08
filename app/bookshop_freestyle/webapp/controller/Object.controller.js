sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/model/Sorter",
], function (BaseController, JSONModel, MessageBox, Sorter) {
    "use strict";

    return BaseController.extend("bs.bookstore.controller.Object", {
        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the booklist controller is instantiated.
         * @public
         */
        onInit: function () {
            const oViewModel = new JSONModel({
                isEditingMode: false,
                sortStateOrder: 0
            });
            

            this.setModel(oViewModel, "objectView");
            this.getRouter().getRoute("object").attachPatternMatched(this.onObjectMatched, this);
        },

        onObjectMatched: function (oEvent) {
            const sObjectId = oEvent.getParameter("arguments").objectId;
            this.bindView("/Books" + sObjectId);
        },

        bindView: function (sObjectPath) {
            this.getView().bindElement({
                path: sObjectPath,
                parameters: {
                    expand: 'author'
                }
            });
        },

        onBookLinkPress: function () {
            this.navigateTo("worklist");
        },

    });

});