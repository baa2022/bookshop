sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
], function (BaseController, JSONModel, History,) {
    "use strict";

    return BaseController.extend("bookshop.freestyle.bookshopfreestyle.controller.Cart", {
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
    });

});