sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
], function (BaseController, JSONModel,) {
    "use strict";

    return BaseController.extend("bookshop.freestyle.bookshopfreestyle.controller.Worklist", {

        onInit: function () {
            const oViewModel = new JSONModel({
                worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
                tableNoDataText: this.getResourceBundle().getText("tableNoDataText")
            });
            
            this.setModel(oViewModel, "worklistView");
        },

        onUpdateFinished: function (oEvent) {
            const oTable = oEvent.getSource();
            const iTotalItems = oEvent.getParameter("total");
            let sTitle;
            
            if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
            } else {
                sTitle = this.getResourceBundle().getText("worklistTableTitle");
            }
            this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
        },

        onPress: function (oEvent) {
            const objectId = oEvent.getSource().getBindingContext().getObject("ID");
            const oNavigateParams = {
                objectId: `(${objectId})`
            };

            this.navigateTo("object", {objectId: "(3b48fcc6-f5b9-4e16-9260-4bceaf8a50c3)"});
            // this.getRouter().navTo("object", {
            //     objectId: oEvent.getSource().getBindingContext().getPath().substring("/Books".length)
            // });
        },

        

    });

});