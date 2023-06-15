// @ts-nocheck
sap.ui.define(
  [
    "sap/ui/core/mvc/Controller", // Import Controller from SAP UI5
    "sap/ui/core/format/DateFormat", // Import DateFormat for date formatting
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   * @param {typeof sap.ui.core.format.DateFormat} DateFormat
   */
  function (Controller, DateFormat) {
    "use strict";

    return Controller.extend("project1.controller.View1", {
      // This function is called when the controller is initialized
      onInit: function () {
        // Initialize the default filter key
        this._sFilterKey = "all";
      },

      // This function is called when the filter selection changes
      onFilterChange: function (event) {
        // Get the selected key from the event
        const selectedKey = event.getParameter("selectedItem").getKey();
        // Update the filter key
        this._sFilterKey = selectedKey;
      },

      // This function is called when the search is triggered
      onSearch: function (event) {
        // Get the search term from the event
        const searchTerm = event.getParameter("query");
        // Get the table and its binding
        const table = this.byId("tableId");
        const binding = table.getBinding("items");

        if (searchTerm && binding) {
          // Create filters based on the search term and filter key
          const filters = [];

          if (this._sFilterKey !== "all") {
            // Apply the filter for selected key and search term
            filters.push(
              new sap.ui.model.Filter(
                this._sFilterKey,
                sap.ui.model.FilterOperator.Contains,
                searchTerm
              )
            );
          }
          // Apply the filters to the table binding
          binding.filter(filters);
        } else {
          // Clear the filters if there's no search term
          binding.filter([]);
        }
      },

      // This function formats a date value
      formatDate: function (value) {
        if (value) {
          // Create a DateFormat instance with a specific pattern
          const oDateFormat = DateFormat.getDateInstance({
            pattern: "dd MMM yy",
          });
          // Format the date and return it
          return oDateFormat.format(new Date(value));
        }
        return value;
      },

      // This function formats a baggage allowance value
      formatBaggageAllowance: function (value) {
        if (value) {
          if (value === "No baggage allowed.") {
            return "Not Allowed.";
          } else {
            // Parse the value as a float and format it with 2 decimal places
            const floatValue = parseFloat(value);
            return `${floatValue.toFixed(2)} Kg`;
          }
        }
        return value;
      },

      // This function formats a flight duration value
      formatFlightDuration: function (value) {
        if (value) {
          // Calculate hours and minutes from the duration value
          const hours = Math.floor(value / 60);
          const minutes = value % 60;
          // Return the formatted duration
          return `${hours}hr ${minutes}min`;
        }
        return value;
      },

      // This function formats a time value
      formatTime: function (value) {
        if (value) {
          // Create a DateFormat instance with a short style
          const oDateFormat = DateFormat.getTimeInstance({ style: "short" });
          // Format the time and return it
          const time = new Date(value.ms);
          return oDateFormat.format(time);
        }
        return value;
      },
      // This function formats a city name value
      formatCityName: function (value) {
        if (value) {
          // Split the city name into words
          const words = value.split(" ");
          // Capitalize each word
          const capitalizedWords = words.map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          });
          // Join the words back together and return the result
          return capitalizedWords.join(" ");
        }
        return value;
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
