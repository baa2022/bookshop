sap.ui.define([],
    function () {

        "use strict";

        function getConvertedPriceP(sPrice_USD) {
            const sURL = "https://www.nbrb.by/api/exrates/rates/431";

            return new Promise(function (resolve) {
                fetch(sURL)
                    .then(response => response.json())
                    .then(function (oData) {
                        const nOfficialRate = oData.Cur_OfficialRate;
                        // const sPrice_BYN = Math.ceil(sPrice_USD * nOfficialRate);
                        const sPrice_BYN = sPrice_USD * nOfficialRate;

                        resolve(sPrice_BYN.toFixed(2));
                    });
            });
        }

        return {

            onOpenPopoverPress: async function (oEvent) {
                const oSourceControl = oEvent.getSource();
                const oCtx = oSourceControl.getBindingContext();
                const oListReportView = sap.ui.getCore().byId("bookshop.fiori.bookshopfiori::BooksList");

                if(!this.pInfoPopover) {
                    this.pInfoPopover = this.loadFragment({
                        name: "bookshop.fiori.bookshopfiori.ext.view.fragment.ConvertationPopover"
                    });
    
                    this.pInfoPopover.then(oPopover => oListReportView.addDependent(oPopover));
                }

                this.pInfoPopover.then(function (oPopover) {
                    oPopover.openBy(oSourceControl);
                    oPopover.setBindingContext(oCtx);
                });

                const oConvertationModel = this.getModel("convertationModel");
                const sPrice_USD = oCtx.getObject("price");
                const sPrice_BYN = await getConvertedPriceP(sPrice_USD);

                oConvertationModel.setProperty("/price_BYN", sPrice_BYN);
            },
            
            onClosePopoverPress: function() {
                this.pInfoPopover.then(oPopover => oPopover.close());
            }

        }
    });