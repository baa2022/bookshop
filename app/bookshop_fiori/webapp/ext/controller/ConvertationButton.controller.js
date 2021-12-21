sap.ui.define([],
    function () {
        "use strict";
        return {
            onInit: function () {
                // console.log("onInit from the base Controller");
            },

            onOpenPopoverPress: function() {
                console.log("help");
            },

            // onOpenPopoverPress: async function (oEvent) {
            //     console.log("wdawsdawedaqwrawesfraers");
                
            //     const oSourceControl = oEvent.getSource();
            //     const oCtx = oSourceControl.getBindingContext();
            //     const sPrice_USD = oCtx.getObject("price");
            //     const sPrice_BYN = await this.getConvertedPriceP(sPrice_USD);

            //     if (sPrice_BYN) {
            //         const oView = this.getView();
            //         const oPopoverModel = this.getModel("convertation");
            //         oPopoverModel.setProperty("/price_BYN", sPrice_BYN);

            //         if (!this.pPopover) {
            //             this.pPopover = this.loadFragment({
            //                 name: "bookshop.fiori.bookshopfiori.ext.view.fragment.ConvertationPopover"
            //             });

            //             this.pPopover.then(oPopover => oView.addDependent(oPopover));
            //         }

            //         this.pPopover.then(function (oPopover) {
            //             oPopover.setModel(oPopoverModel);
            //             oPopover.openBy(oSourceControl);
            //         });
            //     }
            // },

            getConvertedPriceP: function (sPrice_USD) {
                return new Promise(function (resolve) {
                    fetch(sURL)
                        .then(response => response.json())
                        .then(function (oData) {
                            const nOfficialRate = oData.Cur_OfficialRate;
                            const sPrice_BYN = Math.ceil(sPrice_USD * nOfficialRate);

                            resolve(sPrice_BYN);
                        });
                });
            },

        };
    }
);