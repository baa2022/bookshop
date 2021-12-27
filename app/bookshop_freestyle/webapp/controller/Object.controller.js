sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
], function (BaseController, JSONModel, MessageBox, ) {
    "use strict";

    return BaseController.extend("bookshop.freestyle.controller.Object", {

        onInit: function () {
            const oViewModel = new JSONModel({
                isEditingMode: false,
                sortStateOrder: 0,
            });
            const oMessageManager = sap.ui.getCore().getMessageManager();

            this.setModel(oViewModel, "objectView");
            this.getRouter().getRoute("object").attachPatternMatched(this.onPatternMatched, this);

            oMessageManager.registerObject(this.getView(), true);
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
                name: "bookshop.freestyle.view.fragments.EditBook"
            });
            const pDisplayFragment = this.loadFragment({
                name: "bookshop.freestyle.view.fragments.DisplayBook"
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

        onSavePress: function () {
            const oODataModel = this.getModel();
            const oView = this.getView();
            const oViewModel = this.getModel("objectView");
            const aControls = oView.getControlsByFieldGroupId("editBookControl").filter(function (oControl) {
                if (oControl.isA("sap.m.Input") || oControl.isA("sap.m.TextArea")) {
                    return oControl;
                }
            });
            const bRatingError = this.validateRatingIndicator(this.byId("ratingIndicator"));
            let bValidationError = false;

            aControls.forEach(function (oControl) {
                bValidationError = this.validateValue(oControl) || bValidationError;
            }, this);

            if (bValidationError || bRatingError) {
                const sMessage = this.getResourceBundle().getText("validationErrorMessage");
                MessageBox.error(sMessage);

                return;
            }

            oViewModel.setProperty("/isEditingMode", false);
            oODataModel.submitChanges();
            this.showFormFragment();
        },

        onValidate: function (oEvent) {
            this.validateValue(oEvent.getSource());
        },

        onValidateRatingIndicator: function (oEvent) {
            this.validateRatingIndicator(oEvent.getSource());
        },

        onCancelPress: function (oEvent, sFieldGroupId) {
            const sMessage = this.getResourceBundle().getText("confirmPageExitMessage");
            const oDialog = oEvent.getSource().getParent();
            const editModeCallback = this.discardChanges.bind(this);
            const authorCallback = this.closeDialog.bind(this, oDialog, sFieldGroupId);
            const isEditModeClosing = sFieldGroupId === "editBookControl";

            this.confirmP(sMessage)
                .then(function () {
                    isEditModeClosing ? editModeCallback() : authorCallback();
                })
                .catch(() => { });
        },

        discardChanges: function () {
            const oODataModel = this.getModel();
            const oViewModel = this.getModel("objectView");

            oViewModel.setProperty("/isEditingMode", false);
            oODataModel.resetChanges();
            this.showFormFragment();
        },

        onDeletePress: async function (oEvent) {
            const oCtx = oEvent.getSource().getBindingContext();

            this.onAfterDeletePress(oCtx)
                .then(function (bIsBookDeleted) {
                    if (bIsBookDeleted) this.navigateTo("worklist");
                }.bind(this));

        },

        onOpenAuthorDialogPress: function () {
            this.openAuthorDialog();
        },

        onCreateAuthorPress: function () {
            this.createAuthor();
        },

    });

});