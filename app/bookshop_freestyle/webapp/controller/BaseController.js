sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/library"
], function (Controller, UIComponent, ) {
    "use strict";

    return Controller.extend("bookshop.freestyle.bookshopfreestyle.controller.BaseController", {

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

        isBookInCart: function (sID) {
            const oCartModel = this.getModel("cart");
            const aCartEntries = oCartModel.getProperty("/cart");

            return aCartEntries.find(oBook => oBook.ID === sID);
        },

        addBookToCart: function (oBook) {
            const oCartModel = this.getModel("cart");
            const aCart = oCartModel.getProperty("/cart");

            aCart.push(oBook);
            oCartModel.setProperty("/cart", aCart);
        },

        removeBookFromCart: function (sID) {
            const oCartModel = this.getModel("cart");

            const aCartEntries = oCartModel.getProperty("/cart");
            const index = aCartEntries.findIndex(oBook => oBook.ID === sID)
            aCartEntries.splice(index, 1)
            oCartModel.setProperty("/cart", aCartEntries);
        },

        getItemsCountInCart: function () {
            const oCartModel = this.getModel("cart");
            const aCartEntries = oCartModel.getProperty("/cart");

            return aCartEntries.length;
        },

        getAddToCartBtns: function () {
            const aControls = this.getView().getControlsByFieldGroupId("toggleButton").filter(oControl => oControl.isA("sap.m.ToggleButton"));

            return aControls;
        },

        setPressedStateOfToggleBtn: function (aControls) {
            aControls.map(function (oControl) {
                const oCtx = oControl.getBindingContext();
                const sID = oCtx.getObject("ID");
                const bIsBookInCart = this.isBookInCart(sID);

                oControl.setPressed(bIsBookInCart);

            }.bind(this));
        },

        readP: function (sPath, sFilter) {
            const oODataModel = this.getModel();

            return new Promise(function (resolve, reject) {
                let mParameters = {
                    success: oData => resolve.call(this, oData.fullName),
                    error: reject
                }

                if(sFilter) {
                    mParameters["urlParameters"] = {
                        "$filter": sFilter
                    }
                }

                oODataModel.read(sPath, mParameters);
            });
        },

    })
});