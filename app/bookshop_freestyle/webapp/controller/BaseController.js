sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/library"
], function (Controller, UIComponent,) {
	"use strict";

	return Controller.extend("bookshop.freestyle.bookshopfreestyle.controller.BaseController", {

		getRouter : function () {
			return UIComponent.getRouterFor(this);
		},

		getModel : function (sName) {
			return this.getView().getModel(sName);
		},

		setModel : function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        navigateTo: function (sName, oParameters) {
            this.getOwnerComponent().getRouter().navTo(sName, oParameters);
        },

    })
});