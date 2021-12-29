sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
], function (BaseController, JSONModel, Filter, FilterOperator, Sorter, MessageToast, MessageBox,) {
    "use strict";

    return BaseController.extend("bookshop.freestyle.controller.Worklist", {

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
            const oCtx = oEvent.getSource().getBindingContext();

            this.onAfterAddToCartPress(oCtx);
        },

        onOpenBookDialogPress: function () {
            const oView = this.getView();
            const oODataModel = oView.getModel();
            const oEntryCtx = oODataModel.createEntry("/Books");
            const oMessageManager = sap.ui.getCore().getMessageManager();

            if (!this.pBookDialog) {
                this.pBookDialog = this.loadFragment({
                    name: "bookshop.freestyle.view.fragments.CreateBook"
                });

                this.pBookDialog.then(oDialog => oView.addDependent(oDialog));
            }

            this.pBookDialog.then(function (oDialog) {
                oMessageManager.registerObject(oView, true);

                oDialog.setBindingContext(oEntryCtx);
                oDialog.setModel(oODataModel);
                oDialog.open();
            });
        },

        onCreateBookPress: function () {
            this.pBookDialog.then(function (oDialog) {
                const oView = this.getView();
                const oODataModel = oView.getModel();
                const oCtx = oDialog.getBindingContext();
                const sPath = oCtx.getPath();
                const sID = this.byId("author").getSelectedItem().getKey();
                const sGenre = this.byId("genre").getSelectedItem().getKey();
                const aControls = oView.getControlsByFieldGroupId("bookDialogControl").filter(function (oControl) {
                    if (oControl.isA("sap.m.Input") || oControl.isA("sap.m.TextArea")) {
                        return oControl;
                    }
                });
                const bRatingError = this.validateRatingIndicator(this.byId("ratingIndicator"));
                const sInstanceName = this.getResourceBundle().getText("bookEntityTitle");
                let sMessage = this.getResourceBundle().getText("successCreationMessage", [sInstanceName, oCtx.getObject("title")]);
                let bValidationError = false;

                aControls.forEach(function (oControl) {
                    bValidationError = this.validateValue(oControl) || bValidationError;
                }, this);

                if (bValidationError || bRatingError) {
                    sMessage = this.getResourceBundle().getText("validationErrorMessage");
                    MessageBox.error(sMessage);

                    return;
                }

                oODataModel.setProperty(`${sPath}/author_ID`, sID);
                oODataModel.setProperty(`${sPath}/genre_title`, sGenre);
                oODataModel.submitChanges();
                oDialog.close();
                MessageToast.show(sMessage);
            }.bind(this));
        },

        onSearch: async function (oEvent) {
            const oTable = this.byId("table");
            const oBinding = oTable.getBinding("items");
            const sQuery = oEvent.getParameter("query");

            if (sQuery && sQuery.length > 0) {
                const aAuthorFilters = [new Filter({
                    filters: [
                        new Filter({
                            path: "fullName",
                            operator: FilterOperator.Contains,
                            value1: sQuery
                        }),
                    ],
                    and: false
                })];
                const oData = await this.readP("/Authors", aAuthorFilters);
                const aAuthors = oData.results;
                const aAuhorsID = aAuthors.map(author => author.ID);

                let aFilters = [
                    new Filter({
                        path: "title",
                        operator: FilterOperator.Contains,
                        value1: sQuery
                    }),
                    new Filter({
                        path: "genre_title",
                        operator: FilterOperator.Contains,
                        value1: sQuery
                    })
                ];

                if (!isNaN(sQuery)) {
                    aFilters.push(
                        new Filter({
                            path: "stock",
                            operator: FilterOperator.EQ,
                            value1: sQuery
                        }));
                    aFilters.push(
                        new Filter({
                            path: "price",
                            operator: FilterOperator.EQ,
                            value1: sQuery
                        }));
                    aFilters.push(
                        new Filter({
                            path: "rating",
                            operator: FilterOperator.EQ,
                            value1: sQuery
                        }));
                }

                if (aAuhorsID.length > 0) {
                    aAuhorsID.forEach(function (ID) {
                        aFilters.push(
                            new Filter({
                                path: "author_ID",
                                operator: FilterOperator.EQ,
                                value1: ID
                            }));
                    });
                }

                aQueryFilters = new Filter({
                    aFilters
                });
            }

            oBinding.filter(aQueryFilters);
        },

        onSortPress: function (oEvent, sPath) {
            const oViewModel = this.getModel("worklistView");
            const oSourceControl = oEvent.getSource();
            const oBinding = this.byId("table").getBinding("items");
            const aSortStates = [{
                iconStateName: "sap-icon://sort",
                logicalSortState: undefined
            },
            {
                iconStateName: "sap-icon://sort-ascending",
                logicalSortState: false
            },
            {
                iconStateName: "sap-icon://sort-descending",
                logicalSortState: true
            },
            ];
            let oSortedColBtn = oViewModel.getProperty("/sortedColBtn");
            let nSortStateOrder = 1;

            if (oSortedColBtn) {
                oSortedColBtn.setIcon(aSortStates[0].iconStateName);

                if (oSortedColBtn === oSourceControl) {
                    nSortStateOrder = oViewModel.getProperty("/sortStateOrder");
                    // if  sort Order = 2 (sort is descending), we nullify nSortStateOrder (items become unsorted)
                    nSortStateOrder < 2 ? nSortStateOrder++ : nSortStateOrder = 0;
                }
            }

            oSourceControl.setIcon(aSortStates[nSortStateOrder].iconStateName);

            oViewModel.setProperty("/sortStateOrder", nSortStateOrder);
            oViewModel.setProperty("/sortedColBtn", oSourceControl);

            const sOrder = aSortStates[nSortStateOrder].logicalSortState;
            const oSorter = new Sorter(sPath, sOrder);

            oBinding.sort(sOrder !== undefined ? oSorter : undefined);
        },

        onDeletePress: function (oEvent) {
            const oCtx = oEvent.getSource().getBindingContext();

            this.onAfterDeletePress(oCtx);
        },

        onCancelPress: function (oEvent, sFieldGroupId) {
            const sMessage = this.getResourceBundle().getText("confirmPageExitMessage");
            const oDialog = oEvent.getSource().getParent();

            this.confirmP(sMessage)
                .then(function () {
                    this.closeDialog(oDialog, sFieldGroupId);

                }.bind(this))
                .catch(() => { });
        },

        onValidate: function (oEvent) {
            this.validateValue(oEvent.getSource());
        },

        onValidateRatingIndicator: function (oEvent) {
            this.validateRatingIndicator(oEvent.getSource());
        },

        onOpenAuthorDialogPress: function () {
            this.openAuthorDialog();
        },

        onCreateAuthorPress: function () {
            this.createAuthor();
        },

    });

});