sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/format/NumberFormat",
    "sap/ui/core/routing/History",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, DateFormat) {
    "use strict";

    return Controller.extend("project1.controller.View1", {
      onInit: function () {},
      formatDate: function (value) {
        if (value) {
          var oDateFormat = DateFormat.getDateInstance({
            pattern: "dd MMM yy",
          });
          return oDateFormat.format(new Date(value));
        }
        return value;
      },
      formatBaggageAllowance: function (value) {
        if (value) {
          if (value === "No baggage allowed.") {
            return "Not Allowed";
          } else {
            var floatValue = parseFloat(value);
            return floatValue.toFixed(2) + " Kg";
          }
        }
        return value;
      },
      formatFlightDuration: function (value) {
        if (value) {
          var hours = Math.floor(value / 60);
          var minutes = value % 60;
          return hours + "hr " + minutes + "min";
        }
        return value;
      },
      formatTime: function (value) {
        if (value) {
          var oDateFormat = DateFormat.getTimeInstance({ style: "short" });
          var time = new Date(value.ms);
          return oDateFormat.format(time);
        }
        return value;
      },

      formatCityName: function (value) {
        if (value) {
          var words = value.split(" ");
          for (var i = 0; i < words.length; i++) {
            words[i] =
              words[i].charAt(0).toUpperCase() +
              words[i].slice(1).toLowerCase();
          }
          return words.join(" ");
        }
        return value;
      },
    });
  }
);
