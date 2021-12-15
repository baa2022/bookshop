sap.ui.define([
    "./BaseController",
    "../model/formatter",
    "sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
], function (BaseController, formatter, JSONModel, History,) {
    "use strict";

    return BaseController.extend("bookshop.freestyle.bookshopfreestyle.controller.Cart", {
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

        onDeletePress: function(oEvent) {
            const oListItem = oEvent.getParameters().listItem;
            const oCtx = oListItem.getBindingContext("cart");
            const sID = oCtx.getObject("ID");

            this.removeBookFromCart(sID);
        },

        onStepInputValueChange: function (oEvent) {
            const oSourceControl = oEvent.getSource();
            const nValue = oSourceControl.getValue();
            const oCtx = oSourceControl.getBindingContext("cart");
            const nStock = oCtx.getObject("stock");
            const iTotalValue = nValue > nStock ? nStock : nValue;

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

        onOpenProceedDialogPress: function() {
            const oView = this.getView();
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

                    this.clearCart();
                }.bind(this)
            });

            if (!this.pOrderDialog) {
                this.pOrderDialog = this.loadFragment({
                    name: "bookshop.freestyle.bookshopfreestyle.view.fragments.CreateOrder"
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

        
    });

});