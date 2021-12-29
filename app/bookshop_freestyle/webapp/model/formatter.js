sap.ui.define([], function () {
    "use strict";

    return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
        numberUnit: function (sValue) {
            if (!sValue) {
                return "";
            }
            return parseFloat(sValue).toFixed(2);
        },

        authorNameFormatter: async function (sAuthorID) {
            const oAuthor = await this.readP(`/Authors(${sAuthorID})`);

            return oAuthor.fullName
        },

        genericTagTextFormatter: function (iStock) {
            if (iStock > 5) {
                return this.getResourceBundle().getText("inStockState");
            } else if (iStock <= 5 && iStock >= 1) {
                return this.getResourceBundle().getText("storageState");
            } else if (iStock < 1) {
                return this.getResourceBundle().getText("outOfStockState");
            }
        },

        genericTagStatusFormatter: function (iStock) {
            if (iStock > 5) {
                return "Success";
            } else if (iStock <= 5 && iStock >= 1) {
                return "Warning";
            } else if (iStock < 1) {
                return "Error";
            }
        },

    };

});