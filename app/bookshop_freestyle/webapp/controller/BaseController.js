sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
], function (Controller, UIComponent, Filter, FilterOperator, MessageBox, MessageToast, ) {
    "use strict";

    return Controller.extend("bookshop.freestyle.controller.BaseController", {

        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        getModel: function (sName) {
            return this.getView().getModel(sName);
        },

        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        navigateTo: function (sName, oParameters) {
            this.getOwnerComponent().getRouter().navTo(sName, oParameters);
        },

        onAfterAddToCartPress: function (oCtx) {
            const oBook = oCtx.getObject();
            const isBookInCart = this.isBookInCart(oBook.ID);

            isBookInCart ? this.removeBookFromCart(oBook.ID) : this.addBookToCart(oBook);
        },

        isBookInCart: function (sID) {
            const oCartModel = this.getModel("cart");
            const aCartBooks = oCartModel.getProperty("/cart");

            return aCartBooks.find(oBook => oBook.ID === sID);
        },

        addBookToCart: function (oBook) {
            const oCartModel = this.getModel("cart");
            const aCart = oCartModel.getProperty("/cart");

            aCart.push(oBook);
            oCartModel.setProperty("/cart", aCart);
            oCartModel.setProperty("/booksInCart", this.getItemsCountInCart());
        },

        removeBookFromCart: function (sID) {
            const oCartModel = this.getModel("cart");
            const aCartBooks = oCartModel.getProperty("/cart");
            const index = aCartBooks.findIndex(oBook => oBook.ID === sID)

            aCartBooks.splice(index, 1)
            oCartModel.setProperty("/cart", aCartBooks);
            oCartModel.setProperty("/booksInCart", this.getItemsCountInCart());
        },

        clearCart: function () {
            console.log("clear");
            const oCartModel = this.getModel("cart");

            oCartModel.setProperty("/cart", []);
            oCartModel.setProperty("/booksInCart", 0);
            oCartModel.setProperty("/totalPrice", 0);
        },

        getItemsCountInCart: function () {
            const oCartModel = this.getModel("cart");
            const aCartBooks = oCartModel.getProperty("/cart");

            return aCartBooks.length;
        },

        getAddToCartBtns: function () {
            const aControls = this.getView().getControlsByFieldGroupId("toggleButton").filter(oControl => oControl.isA("sap.m.ToggleButton"));

            return aControls;
        },

        rerenderCartButtons: function() {
            const aControls = this.getAddToCartBtns();

            if (aControls.length > 0) {
                this.setPressedStateOfToggleBtn(aControls);
                this.setDisabilityOfToggleBtn(aControls);
            }
        },

        setPressedStateOfToggleBtn: function (aControls) {
            aControls.map(function (oControl) {
                const oCtx = oControl.getBindingContext();
                const sID = oCtx.getObject("ID");
                const bIsBookInCart = this.isBookInCart(sID);

                oControl.setPressed(bIsBookInCart);

            }.bind(this));
        },

        setDisabilityOfToggleBtn: function (aControls) {
            aControls.map(function (oControl) {
                const oCtx = oControl.getBindingContext();
                const iStock = oCtx.getObject("stock");
                const bIsBookAvailable = iStock > 0 ? true : false;

                oControl.setEnabled(bIsBookAvailable);
            });
        },

        readP: function (sPath, aFilters) {
            const oODataModel = this.getModel();

            return new Promise(function (resolve, reject) {
                let mParameters = {
                    success: oData => resolve.call(this, oData),
                    error: reject
                }

                if (aFilters) {
                    mParameters["filters"] = aFilters;
                }

                oODataModel.read(sPath, mParameters);
            });
        },

        confirmP: function (sMessage) {
            return new Promise(function (resolve, reject) {
                MessageBox.confirm(sMessage, oAction => oAction === MessageBox.Action.OK ? resolve() : reject());
            });
        },

        onAfterDeletePress: function (oCtx) {
            const oBook = oCtx.getObject();
            const sMessage = this.getResourceBundle().getText("confirmDeletionMessage", oBook.title);

            // if user press ok, functions call and we return true;
            return this.confirmP(sMessage)
                .then(function () {
                    this.deleteBook(oBook);
                    this.removeBookFromCart(oBook.ID);

                    return true;
                }.bind(this), () => false)
                .catch(() => { });
        },

        deleteBook: async function (oBook) {
            const oODataModel = this.getModel();
            const sKey = oODataModel.createKey("/Books", oBook);
            const aFilters = [
                new Filter({
                    path: "book_ID",
                    operator: FilterOperator.EQ,
                    value1: oBook.ID
                })
            ];
            const oData = await this.readP("/Orders_items", aFilters);

            await oODataModel.remove(sKey);
            oData.results.forEach(oOrder => oODataModel.remove(`/Orders(${oOrder.up__ID})`));
        },

        closeDialog: function (oDialog, sFieldGroupId) {
            const oODataModel = this.getModel();
            const sPath = oDialog.getBindingContext().getPath();

            oODataModel.resetChanges([sPath]);
            oDialog.close();
            this.afterDialogClose(sFieldGroupId);
        },

        afterDialogClose: function (sFieldGroupId) {
            const sValueState = "None";
            const aControls = this.getView().getControlsByFieldGroupId(sFieldGroupId).filter(function (oControl) {
                if (oControl.isA("sap.m.Input") || oControl.isA("sap.m.TextArea")) {
                    return oControl;
                }
            });

            aControls.forEach(oControl => oControl.setValueState(sValueState));
        },

        validateValue: function (oControl) {
            const oBinding = oControl.getBinding("value");
            let sValueState = "None";
            let bValidationError = false;

            try {
                if (oControl.getValue().trim().length < 1) {
                    throw new Error;
                }

                oBinding.getType().validateValue(oControl.getValue());
            } catch (oException) {
                sValueState = "Error";
                bValidationError = true;
            }

            oControl.setValueState(sValueState);

            return bValidationError;
        },

        validateRatingIndicator: function (oControl) {
            if (oControl.getValue() < 1) {
                oControl.setValue(1);
                return true;
            }

            return false;
        },

        openAuthorDialog: function () {
            const oView = this.getView();
            const oODataModel = oView.getModel();
            const oEntryCtx = oODataModel.createEntry("/Authors", {
                groupId: "authorGroup",
            });

            if (!this.pAuthorDialog) {
                this.pAuthorDialog = this.loadFragment({
                    name: "bookshop.freestyle.view.fragments.CreateAuthor"
                });

                this.pAuthorDialog.then(oDialog => oView.addDependent(oDialog));
            }

            this.pAuthorDialog.then(function (oDialog) {
                oDialog.setBindingContext(oEntryCtx);
                oDialog.setModel(oODataModel);
                oDialog.open();
            });
        },

        createAuthor: function () {
            const oODataModel = this.getView().getModel();

            this.pAuthorDialog.then(function (oDialog) {
                const oCtx = oDialog.getBindingContext();
                const sPath = oCtx.getPath();
                const oModel = oCtx.getModel();
                const oDateTime = new Date();
                const aControls = this.getView().getControlsByFieldGroupId("authorDialogControl").filter(control => control.isA("sap.m.Input"));
                let bValidationError = false;

                aControls.forEach(function (oControl) {
                    bValidationError = this.validateValue(oControl) || bValidationError;
                }, this);

                if (bValidationError) {
                    const sMessage = this.getResourceBundle().getText("validationErrorMessage");
                    MessageBox.error(sMessage);

                    return;
                }

                oModel.setProperty(sPath + "/creationDateTime", oDateTime);

                this.updateSelectededAuthor(oDateTime);

                oODataModel.submitChanges({
                    groupId: "authorGroup"
                });
                oDialog.close();

                const sAuthorName = oModel.getProperty(sPath + "/fullName");
                const sInstanceName = this.getResourceBundle().getText("authorEntityTitle");
                const sMessage = this.getResourceBundle().getText("successCreationMessage", [sInstanceName, sAuthorName]);

                MessageToast.show(sMessage);

            }.bind(this));
        },

        updateSelectededAuthor: function (oDateTime) {
            const oSelectControl = this.byId("author");
            const oItemsBinding = oSelectControl.getBinding("items");
            const oFilter = new Filter("creationDateTime", FilterOperator.EQ, oDateTime);
            const oItem = oItemsBinding.filter(oFilter);

            oItemsBinding.filter();
            oSelectControl.setSelectedKey(oItem);
        },

    })
});