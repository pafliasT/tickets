// @ts-nocheck
sap.ui.define(
  [
    "sap/ui/core/mvc/Controller", // Import Controller from SAP UI5
    "../assets/FormatterHelper",
    // Import DateFormat for date formatting
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, FormatterHelper) {
    "use strict";

    return Controller.extend("project1.controller.View1", {
      // This function is called when the controller is initialized
      onInit: function () {},

      formatDate: FormatterHelper.formatDate,
      formatFlightDuration: FormatterHelper.formatFlightDuration,
      formatTime: FormatterHelper.formatTime,
      formatCityName: FormatterHelper.formatCityName,
      formatCityName: FormatterHelper.formatCityName,
      formatBaggageAllowance: FormatterHelper.formatBaggageAllowance,

      // This function is called when the search is triggered
      onSearch: function (event) {
        // Get the search term from the event
        const searchTerm = event.getParameter("query");
        // Get the table and its binding
        const table = this.byId("tableId");
        const binding = table.getBinding("items");

        if (searchTerm && binding) {
          // Create filters based on the search term
          const filters = [
            new sap.ui.model.Filter(
              "TickNum",
              sap.ui.model.FilterOperator.Contains,
              searchTerm
            ),
            new sap.ui.model.Filter(
              "CustName",
              sap.ui.model.FilterOperator.Contains,
              searchTerm
            ),
            new sap.ui.model.Filter(
              "FlightNum",
              sap.ui.model.FilterOperator.Contains,
              searchTerm
            ),
          ];

          // Apply the filters to the table binding
          binding.filter(new sap.ui.model.Filter(filters, false));
        } else {
          // Clear the filters if there's no search term
          binding.filter([]);
        }
      },

      // This function is called when a list item is pressed
      onListItemPress: function (oEvent) {
        // Get the source of the event (the pressed list item)
        var oItem = oEvent.getSource();
        // Get the binding context of the list item
        var oBindingContext = oItem.getBindingContext();
        // Get the data of the list item
        var oData = oBindingContext.getObject();

        // Set the selected data to the shared model
        var oSharedModel = this.getOwnerComponent().getModel("shared");
        oSharedModel.setData(oData);

        // Get the ticket number of the selected list item
        var sTicketNum = oBindingContext.getProperty("TickNum");

        // Navigate to View2 with the selected ticket number as a parameter
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("View2", {
          TickNum: sTicketNum,
        });
      },
    });
  }
);
