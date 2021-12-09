sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/model/Sorter",
], function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("bookshop.freestyle.bookshopfreestyle.controller.Object", {

        onInit: function () {
            const oViewModel = new JSONModel({
                isEditingMode: false,
                sortStateOrder: 0
            });

            this.setModel(oViewModel, "objectView");
            this.getRouter().getRoute("object").attachPatternMatched(this.onObjectMatched, this);

            this._oFragmentsMap = this.createFragmentsMap();
            this.showFormFragment();
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

        createFragmentsMap: function () {
            const pEditFragment = this.loadFragment({
                name: "bookshop.freestyle.bookshopfreestyle.view.fragments.EditBook"
            });
            const pDisplayFragment = this.loadFragment({
                name: "bookshop.freestyle.bookshopfreestyle.view.fragments.DisplayBook"
            });

            const oFragmentsMap = new Map([
                [true, pEditFragment],
                [false, pDisplayFragment]
            ]);

            return oFragmentsMap;
        },

        showFormFragment: function () {
            const isEditingMode = this.getModel("objectView").getProperty("/isEditingMode");
            const oFormShell = this.byId("formShell");

            this._oFragmentsMap.get(isEditingMode)
                .then(function (oForm) {
                    oFormShell.removeAllContent();
                    oFormShell.addContent(oForm);
                });
        },

        onEditBookPress: function () {
            const oViewModel = this.getModel("objectView");
            const isEditingMode = oViewModel.getProperty("/isEditingMode");

            oViewModel.setProperty("/isEditingMode", !isEditingMode);
            this.showFormFragment();
        },

    });

});