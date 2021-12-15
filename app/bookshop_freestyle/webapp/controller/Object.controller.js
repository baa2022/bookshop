sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
], function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("bookshop.freestyle.bookshopfreestyle.controller.Object", {

        onInit: function () {
            const oViewModel = new JSONModel({
                isEditingMode: false,
                sortStateOrder: 0,
            });

            this.setModel(oViewModel, "objectView");
            this.getRouter().getRoute("object").attachPatternMatched(this.onPatternMatched, this);

            this._oFragmentsMap = this.createFragmentsMap();
            this.showFormFragment();
        },

        onPatternMatched: function (oEvent) {
            const sObjectId = oEvent.getParameter("arguments").objectId;
            this.bindView("/Books" + sObjectId);
        },

        bindView: function (sObjectPath) {
            this.getView().bindElement({
                path: sObjectPath,
                parameters: {
                    expand: 'author'
                },
                events: {
                    dataReceived: function () {
                        const aControls = this.getAddToCartBtns();
                        this.setPressedStateOfToggleBtn.call(this, aControls);
                    }.bind(this)
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

            oViewModel.setProperty("/isEditingMode", true);
            this.showFormFragment();
        },

        onOpenCartPress: function () {
            this.navigateTo("cart");
        },

        onAddToCartPress: function (oEvent) {
            const oCtx = oEvent.getSource().getBindingContext();

            this.onAfterAddToCartPress(oCtx);
        },

        onSavePress: function() {
            const oODataModel = this.getModel();
            const oViewModel = this.getModel("objectView");

            oViewModel.setProperty("/isEditingMode", false);
            oODataModel.submitChanges();
            this.showFormFragment();
        },

        onCancelPress: function () {
            this.discardChanges();
        },

        discardChanges: function () {
            const oODataModel = this.getModel();
            const oViewModel = this.getModel("objectView");

            oViewModel.setProperty("/isEditingMode", false);
            oODataModel.resetChanges();
            this.showFormFragment();
        },

        onDeletePress: function (oEvent) {
            const oCtx = oEvent.getSource().getBindingContext();

            this.onAfterDeletePress(oCtx);
            this.navigateTo("worklist");
        },

    });

});