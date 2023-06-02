// @ts-nocheck
sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/format/NumberFormat",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   * @param {typeof sap.ui.core.format.DateFormat} DateFormat
   * @param {typeof sap.ui.core.format.NumberFormat} NumberFormat
   */
  function (Controller, DateFormat) {
    "use strict";

    return Controller.extend("project1.controller.View1", {
      onInit: function () {
        // Initialize the default filter key
        this._sFilterKey = "all";
      },

      onFilterChange: function (event) {
        // Get the selected key from the event
        const selectedKey = event.getParameter("selectedItem").getKey();
        // Update the filter key

        this._sFilterKey = selectedKey;
      },

      onSearch: function (event) {
        // Get the search term
        const searchTerm = event.getParameter("query");
        // Get the table and its binding
        const table = this.byId("tableId");
        const binding = table.getBinding("items");

        if (searchTerm && binding) {
          // Create filters based on the search term and filter key
          const filters = [];

          if (this._sFilterKey !== "all") {
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
          // Clear the filters

          binding.filter([]);
        }
      },

      formatDate: function (value) {
        if (value) {
          // Format the date using the specified pattern
          const oDateFormat = DateFormat.getDateInstance({
            pattern: "dd MMM yy",
          });
          return oDateFormat.format(new Date(value));
        }
        return value;
      },

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

      formatFlightDuration: function (value) {
        if (value) {
          // Calculate hours and minutes from the duration value
          const hours = Math.floor(value / 60);
          const minutes = value % 60;
          return `${hours}hr ${minutes}min`;
        }
        return value;
      },

      formatTime: function (value) {
        if (value) {
          // Format the time using the "short" style
          const oDateFormat = DateFormat.getTimeInstance({ style: "short" });
          const time = new Date(value.ms);
          return oDateFormat.format(time);
        }
        return value;
      },

      formatCityName: (value) => {
        if (value) {
          // Capitalize each word in the city name
          const words = value.split(" ");
          const capitalizedWords = words.map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          });
          return capitalizedWords.join(" ");
        }
        return value;
      },
    });
  }
);
