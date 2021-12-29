sap.ui.define([
    "./BaseController",
    "../model/formatter",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
], function (BaseController, formatter, History, JSONModel,  MessageToast, MessageBox,) {
    "use strict";

    return BaseController.extend("bookshop.freestyle.controller.Cart", {
        formatter: formatter,

        onInit: function () {
            const oComponent = this.getOwnerComponent();
            const oRouter = oComponent.getRouter();

            oRouter.getRoute("cart").attachPatternMatched(this.onPatternMatched, this);
        },

        onPatternMatched: function () {
            this.countTotalPrice();
        },

        onNavButtonPress: function () {
            const oHistory = History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();

            sPreviousHash !== undefined ? window.history.go(-1) : this.navigateTo("worklist");
        },

        onDeletePress: function (oEvent) {
            const oListItem = oEvent.getParameters().listItem;
            const oCtx = oListItem.getBindingContext("cart");
            const oBook = oCtx.getObject();
            const sMessage = this.getResourceBundle().getText("confirmDeletionMessage", oBook.title);

            this.confirmP(sMessage)
                .then(function () {
                    this.removeBookFromCart(oBook.ID);
                }.bind(this))
                .catch(() => { });
        },

        onStepInputValueChange: function (oEvent) {
            const oSourceControl = oEvent.getSource();
            const iValue = oSourceControl.getValue();
            const oCtx = oSourceControl.getBindingContext("cart");
            const iStock = oCtx.getObject("stock");
            let iTotalValue = iValue;

            if (iValue > iStock) {
                iTotalValue = iStock;
            }
            else if (iValue < 1) {
                iTotalValue = 1;
            }

            oSourceControl.setValue(iTotalValue);
            this.countTotalPrice();
        },

        countTotalPrice: function () {
            const oCartModel = this.getModel("cart");
            const aControls = this.getView().getControlsByFieldGroupId("stepInput").filter(oControl => oControl.isA("sap.m.StepInput"));
            const aCartBooks = oCartModel.getProperty("/cart");
            this.aBooksCount = aControls.map(oControl => oControl.getValue());
            const iTotalPrice = aCartBooks.reduce(function (totalPrice, oBook, index) {
                return totalPrice + (oBook.price * this.aBooksCount[index]);
            }.bind(this), 0);

            oCartModel.setProperty("/totalPrice", iTotalPrice);
        },

        onOpenProceedDialogPress: function () {
            const oView = this.getView();
            const oAddressModel = new JSONModel({
                address: { city:"", street:"", house:"", flat:"" }
            });
            const oODataModel = oView.getModel();
            const oCartModel = this.getModel("cart");
            const aCartBooks = oCartModel.getProperty("/cart");
            const oEntryCtx = oODataModel.createEntry("/Orders", {
                success: function (oData) {
                    aCartBooks.forEach(function (oBook, index) {
                        oODataModel.create("/Orders_items", {
                            up__ID: oData.ID,
                            quantity: this.aBooksCount[index],
                            book_ID: oBook.ID
                        });

                        oODataModel.update(`/Books(${oBook.ID})`, {
                            stock: oBook.stock - this.aBooksCount[index]
                        });
                    }.bind(this));
                }.bind(this)
            });

            this.setModel(oAddressModel, "address");

            if (!this.pOrderDialog) {
                this.pOrderDialog = this.loadFragment({
                    name: "bookshop.freestyle.view.fragments.CreateOrder"
                });

                this.pOrderDialog.then(function (oDialog) {
                    oView.addDependent(oDialog);
                });
            }

            this.pOrderDialog.then(function (oDialog) {
                oDialog.setBindingContext(oEntryCtx);
                oDialog.setModel(oODataModel);
                oDialog.open();
            });
        },

        onCheckoutPress: function () {
            this.pOrderDialog.then(function (oDialog) {
                const oODataModel = this.getModel();
                const oCtx = oDialog.getBindingContext();
                const sPath = oCtx.getPath();
                const oModel = oCtx.getModel();
                const oDate = new Date();
                const oAddress = this.getModel("address").getProperty("/address");
                const sAddress = `${oAddress.city}, ${oAddress.street} st., ${oAddress.house}/${oAddress.flat}`;
                const sMessage = this.getResourceBundle().getText("successOrderCreationMessage");
                const aControls = this.getView().getControlsByFieldGroupId("orderDialogControl").filter(function (oControl) {
                    if (oControl.isA("sap.m.Input")) {
                        return oControl;
                    }
                });
                let bValidationError = false;

                aControls.forEach(function (oControl) {
                    bValidationError = this.validateValue(oControl) || bValidationError;
                }, this);

                if (bValidationError) {
                    sMessage = this.getResourceBundle().getText("validationErrorMessage");
                    MessageBox.error(sMessage);

                    return;
                }

                oModel.setProperty(sPath + "/date", oDate);
                oModel.setProperty(sPath + "/address", sAddress);
                oODataModel.submitChanges();
                
                oDialog.close();
                MessageToast.show(sMessage);

                this.clearCart();
                this.navigateTo("worklist");
            }.bind(this));
        },

        onCancelPress: function (oEvent) {
            const sMessage = this.getResourceBundle().getText("confirmPageExitMessage");
            const oDialog = oEvent.getSource().getParent();
            
            this.confirmP(sMessage)
                .then(function () {
                    this.closeDialog(oDialog);
                }.bind(this))
                .catch(() => { });
        },

        onValidate: function (oEvent) {
            this.validateValue(oEvent.getSource());
        },

        onOpenKeyboardPress: function (oEvent) {
            const oButton = oEvent.getSource()

            if (!this.pPopover) {
                this.pPopover = this.loadFragment({
                    name: "bookshop.freestyle.view.fragments.EnterPhoneNumber"
                }).then(function (oPopover) {
                    this.getView().addDependent(oPopover);

                    return oPopover;
                }.bind(this));
            }

            this.pPopover.then(oPopover=>oPopover.openBy(oButton));
        },

        onNumberKeyPress: function (oEvent) {
            const phoneInput = this.byId("phoneInput");
            const numberValue = oEvent.getParameter("value");
            let phoneInputValue = phoneInput.getValue();

            phoneInputValue = phoneInputValue ? phoneInputValue + numberValue : numberValue;

            phoneInput.setValue(phoneInputValue);
        },

        onPlusKeyPress: function () {
            const phoneInput = this.byId("phoneInput");
            let phoneInputValue = phoneInput.getValue();

            if (phoneInputValue) {
                if (!phoneInputValue.includes("+")) {
                    phoneInputValue = "+" + phoneInputValue;
                }
            } else {
                phoneInputValue = "+";
            }

            phoneInput.setValue(phoneInputValue);
        },

        onRemoveKeyPress: function () {
            const phoneInput = this.byId("phoneInput");
            let phoneInputValue = phoneInput.getValue();

            if (phoneInputValue) {
                // TODO
                phoneInputValue = phoneInputValue.slice(0, phoneInputValue.length - 1);
                phoneInput.setValue(phoneInputValue);
            }
        },

    });

});