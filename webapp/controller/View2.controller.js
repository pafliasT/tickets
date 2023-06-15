// @ts-nocheck
sap.ui.define(
  [
    "sap/ui/core/mvc/Controller", // Import Controller from SAP UI5
    "sap/ui/core/routing/History", // Import History for navigation
    "sap/ui/core/format/DateFormat", // Import DateFormat for date formatting
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   * @param {typeof sap.ui.core.mvc.History} History
   * @param {typeof sap.ui.core.format.DateFormat} DateFormat
   */
  function (Controller, History, DateFormat) {
    "use strict";

    return Controller.extend("project1.controller.View2", {
      // This function is called when the controller is initialized
      onInit: function () {
        // Get the shared model from the owner component and set it to the view
        var oSharedModel = this.getOwnerComponent().getModel("shared");
        this.getView().setModel(oSharedModel);
      },

      // This function is called when the navigation back button is pressed
      onNavBack: function () {
        // Get the previous hash from the history
        let oHistory = History.getInstance();
        let sPreviousHash = oHistory.getPreviousHash();

        // If there is a previous hash, go back in the browser history
        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          // Otherwise, navigate to the View1 route
          let oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("View1", {}, true);
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

      // This function is called when the print button is pressed
      onPrint: async function () {
        // Get the data from the view's model
        const data = this.getView().getModel().getData();
        // Define the path to the .docx template
        const templatePath = "../assets/bp.docx";

        try {
          // Use the Fetch API to get the .docx file as an array buffer
          const response = await fetch(templatePath);
          const arrayBuffer = await response.arrayBuffer();

          // Load the .docx file data into PizZip
          const zip = new PizZip(arrayBuffer);

          // Load the zip file data into docxtemplater
          const doc = new docxtemplater().loadZip(zip);

          // Set the data for the template
          doc.setData({
            Name: data.CustName,
            FlConn: `KL${data.FlightNum}`,
            FlightDate: this.formatDate(data.FlightDate),
            Boarding: "17:35",
            Gate: "A8",
            Seat: "F19",
            CityFrom: this.formatCityName(data.CityFrom),
            CityTo: this.formatCityName(data.CityTo),
          });

          // Apply the data to the template
          doc.render();

          // Generate the output .docx file
          const output = doc.getZip().generate({ type: "blob" });

          // Create a URL for the .docx file
          const url = URL.createObjectURL(output);

          // Create a link element with the .docx file URL and simulate a click to start the download
          const link = document.createElement("a");
          link.href = url;
          link.download = "output.docx";
          link.click();
        } catch (error) {
          // Handle the error if the request was not successful
          console.error("Failed to load the .docx file", error);
        }
      },
    });
  }
);
