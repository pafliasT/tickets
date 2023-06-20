sap.ui.define(["sap/ui/core/format/DateFormat"], function(DateFormat) {
    "use strict";
  
    // This object holds all the helper methods
    var FormatterHelper = {
      formatDate: function(value) {
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
  
      formatFlightDuration: function(value) {
        if (value) {
            // Calculate hours and minutes from the duration value
            const hours = Math.floor(value / 60);
            const minutes = value % 60;
            // Return the formatted duration
            return `${hours}hr ${minutes}min`;
          }
          return value;
      },
  
      formatTime: function(value) {
        if (value) {
            // Create a DateFormat instance with a short style
            const oDateFormat = DateFormat.getTimeInstance({ style: "short" });
            // Format the time and return it
            const time = new Date(value.ms);
            return oDateFormat.format(time);
          }
          return value;
      },
  
      formatCityName: function(value) {
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
    };
  
    return FormatterHelper;
  });