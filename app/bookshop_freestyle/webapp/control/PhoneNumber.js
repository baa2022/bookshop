sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/Button",
    "sap/ui/core/IconPool"
], function (Control, Button, IconPool) {
    "use strict";
    return Control.extend("bookshop.freestyle.bookshopfreestyle.control.PhoneNumber", {
        metadata: {
            aggregations: {
                _button0: {
                    type: "sap.m.Button",
                    multiple: false,
                    visibility: "hidden"
                },
                _button1: {
                    type: "sap.m.Button",
                    multiple: false,
                    visibility: "hidden"
                },
                _button2: {
                    type: "sap.m.Button",
                    multiple: false,
                    visibility: "hidden"
                },
                _button3: {
                    type: "sap.m.Button",
                    multiple: false,
                    visibility: "hidden"
                },
                _button4: {
                    type: "sap.m.Button",
                    multiple: false,
                    visibility: "hidden"
                },
                _button5: {
                    type: "sap.m.Button",
                    multiple: false,
                    visibility: "hidden"
                },
                _button6: {
                    type: "sap.m.Button",
                    multiple: false,
                    visibility: "hidden"
                },
                _button7: {
                    type: "sap.m.Button",
                    multiple: false,
                    visibility: "hidden"
                },
                _button8: {
                    type: "sap.m.Button",
                    multiple: false,
                    visibility: "hidden"
                },
                _button9: {
                    type: "sap.m.Button",
                    multiple: false,
                    visibility: "hidden"
                },
                _buttonPlus: {
                    type: "sap.m.Button",
                    multiple: false,
                    visibility: "hidden"
                },
                _buttonRemove: {
                    type: "sap.m.Button",
                    multiple: false,
                    visibility: "hidden"
                },
            },
            events: {
                numberKeyPress: {
                    parameters: {
                        value: {
                            type: "string"
                        }
                    }
                },
                plusKeyPress: {},
                removeKeyPress: {}
            },
        },

        init: function () {
            for (let i = 0; i < 10; i++) {
                this.setAggregation(`_button${i}`, new Button({
                    text: i,
                    press: this.onNumberKeyPress.bind(this, i)
                }));

                // keys in the middle
                if (i === 0 || i === 2 || i === 5 || i == 8) {
                    this.getAggregation(`_button${i}`).addStyleClass("sapUiTinyMarginBeginEnd");
                }
            }

            this.setAggregation("_buttonPlus", new Button({
                tooltip: "plus",
                icon: IconPool.getIconURI("add"),
                press: this.onPlusKeyPress.bind(this)
            }));

            this.setAggregation("_buttonRemove", new Button({
                tooltip: "delete",
                icon: IconPool.getIconURI("decline"),
                press: this.onRemoveKeyPress.bind(this)
            }));

        },

        onNumberKeyPress: function (numberKeyValue) {
            this.fireEvent("numberKeyPress", {
                value: numberKeyValue
            });
        },

        onPlusKeyPress: function () {
            this.fireEvent("plusKeyPress")
        },

        onRemoveKeyPress: function () {
            this.fireEvent("removeKeyPress")
        },

        renderer: function (oRm, oControl) {
            oRm.openStart("div");
            oRm.openEnd();
            oRm.renderControl(oControl.getAggregation("_button1"));
            oRm.renderControl(oControl.getAggregation("_button2"));
            oRm.renderControl(oControl.getAggregation("_button3"));
            oRm.close("div");

            oRm.openStart("div");
            oRm.openEnd();
            oRm.renderControl(oControl.getAggregation("_button4"));
            oRm.renderControl(oControl.getAggregation("_button5"));
            oRm.renderControl(oControl.getAggregation("_button6"));
            oRm.close("div");

            oRm.openStart("div");
            oRm.openEnd();
            oRm.renderControl(oControl.getAggregation("_button7"));
            oRm.renderControl(oControl.getAggregation("_button8"));
            oRm.renderControl(oControl.getAggregation("_button9"));
            oRm.close("div");

            oRm.openStart("div");
            oRm.openEnd();
            oRm.renderControl(oControl.getAggregation("_buttonPlus"));
            oRm.renderControl(oControl.getAggregation("_button0"));
            oRm.renderControl(oControl.getAggregation("_buttonRemove"));
            oRm.close("div");
        }
        
    });

});