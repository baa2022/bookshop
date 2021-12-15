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
            const oViewModel = new JSONModel({
                totalPrice: 0,
            });

            this.setModel(oViewModel, "cartView");
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
    });

});