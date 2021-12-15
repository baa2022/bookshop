sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function (Controller, UIComponent, Filter, FilterOperator,) {
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

        clearCart: function() {
            const oCartModel = this.getModel("cart");

            oCartModel.setProperty("/cart", []);
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

        setPressedStateOfToggleBtn: function (aControls) {
            aControls.map(function (oControl) {
                const oCtx = oControl.getBindingContext();
                const sID = oCtx.getObject("ID");
                const bIsBookInCart = this.isBookInCart(sID);

                oControl.setPressed(bIsBookInCart);

            }.bind(this));
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

        onAfterDeletePress: function (oCtx) {
            const oODataModel = this.getModel();
            const oBook = oCtx.getObject();
            const sKey = oODataModel.createKey("/Books", oBook);

            this.deleteBook(sKey, oBook.ID);
            this.removeBookFromCart(oBook.ID);
        },

        deleteBook: async function (sKey, sBookID) {
            const oODataModel = this.getModel();
            const aFilters = [
                new Filter({
                    path: "book_ID",
                    operator: FilterOperator.EQ,
                    value1: sBookID
                })
            ];

            await oODataModel.remove(sKey);

            const oData = await this.readP("/Orders_items", aFilters);
            oData.results.forEach(oOrder => oODataModel.remove(`/Orders(${oOrder.up__ID})`));
        },

        closeDialog: function (oDialog) {
            oDialog.close();
        },

    })
});