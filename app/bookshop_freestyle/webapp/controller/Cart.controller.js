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
            const aControls = this.getView().getControlsByFieldGroupId("stepInput").filter(control => control.isA("sap.m.StepInput"));
            const aCartBooks = oCartModel.getProperty("/cart");
            const aBooksCount = aControls.map(control => control.getValue());
            const iTotalPrice = aCartBooks.reduce(function (totalPrice, oBook, index) {
                return totalPrice + (oBook.price * aBooksCount[index]);
            }.bind(this), 0);

            oCartModel.setProperty("/totalPrice", iTotalPrice);
        },
    });

});