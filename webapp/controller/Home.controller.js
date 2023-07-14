// @ts-nocheck
sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",

  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller,) {
    "use strict";

    return Controller.extend("project1.controller.Home", {
      // This function is called when the controller is initialized
      onInit: function () { },

      onGetStarted: function () {
        // Navigate to View2 with the selected ticket number as a parameter
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("View1", {}, true);
      },


    });
  }
);
