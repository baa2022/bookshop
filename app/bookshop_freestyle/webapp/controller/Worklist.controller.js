sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
], function (BaseController, JSONModel, ) {
    "use strict";

    return BaseController.extend("bookshop.freestyle.bookshopfreestyle.controller.Worklist", {

        onInit: function () {
            const oViewModel = new JSONModel({
                worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
                tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
            });

            this.setModel(oViewModel, "worklistView");

            this.getRouter().getRoute("worklist").attachPatternMatched(this.onPatternMatched, this);
        },

        onPatternMatched: function () {
            const aControls = this.getAddToCartBtns();

            if (aControls.length > 0) {
                this.setPressedStateOfToggleBtn(aControls);
            }
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

            this.navigateTo("object", oNavigateParams);
        },

        onOpenCartPress: function () {
            this.navigateTo("cart");
        },

        onAddToCartPress: function (oEvent) {
            const oSourceControl = oEvent.getSource();
            const oCtx = oSourceControl.getBindingContext();
            const sBookID = oCtx.getObject("ID");
            const oCartModel = this.getModel("cart");
            const isBookInCart = this.isBookInCart(sBookID);

            if (isBookInCart) {
                this.removeBookFromCart(sBookID);

            }
            else {
                this.addBookToCart(oCtx.getObject());
            }

            oCartModel.setProperty("/booksInCart", this.getItemsCountInCart());
        },

        onOpenBookDialogPress: function() {
            const oView = this.getView();
            const oODataModel = oView.getModel();
            const oEntryCtx = oODataModel.createEntry("/Books");

            if (!this.pBookDialog) {
                this.pBookDialog = this.loadFragment({
                    name: "bookshop.freestyle.bookshopfreestyle.view.fragments.CreateBook"
                });

                this.pBookDialog.then(oDialog => oView.addDependent(oDialog));
            }

            this.pBookDialog.then(function (oDialog) {
                oDialog.setBindingContext(oEntryCtx);
                oDialog.setModel(oODataModel);
                oDialog.open();
            });
        },

        onCreateBookPress: function() {
            this.pBookDialog.then(function (oDialog) {
                const oView = this.getView();
                const oODataModel = oView.getModel();
                const oCtx = oDialog.getBindingContext();
                const sPath = oCtx.getPath();
                const sID = this.byId("author").getSelectedItem().getKey();
                const sGenre = this.byId("genre").getSelectedItem().getKey();

                oODataModel.setProperty(`${sPath}/author_ID`, sID);
                oODataModel.setProperty(`${sPath}/genre_title`, sGenre);
                oODataModel.submitChanges();
                oDialog.close();
            }.bind(this));
        },

    });

});