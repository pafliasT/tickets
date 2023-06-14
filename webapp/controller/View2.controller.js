// @ts-nocheck

sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/format/DateFormat",
    "../assets/jspdf",
    "../assets/FileSaver",
    "../assets/addImage",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   * @param {typeof sap.ui.core.routing.History} History
   * @param {typeof sap.ui.core.format.DateFormat} DateFormat
   */
  function (Controller, History, DateFormat) {
    "use strict";

    return Controller.extend("project1.controller.View2", {
      onInit: function () {
        // Get the shared model from the owner component and set it as the view's model
        var oSharedModel = this.getOwnerComponent().getModel("shared");
        this.getView().setModel(oSharedModel);
      },

      onNavBack: function () {
        // Get the previous hash from the history and navigate back
        let oHistory = History.getInstance();
        let sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          // If a previous hash exists, go back in the browser history
          window.history.go(-1);
        } else {
          // If no previous hash, navigate to View1
          let oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("View1", {}, true);
        }
      },

      formatDate: function (value) {
        // Formatter function to format the date
        if (value) {
          // Format the date using the specified pattern
          const oDateFormat = DateFormat.getDateInstance({
            pattern: "dd MMM yy",
          });
          return oDateFormat.format(new Date(value));
        }
        return value;
      },

      formatFlightDuration: function (value) {
        // Formatter function to format the flight duration
        if (value) {
          // Calculate hours and minutes from the duration value
          const hours = Math.floor(value / 60);
          const minutes = value % 60;
          return `${hours}hr ${minutes}min`;
        }
        return value;
      },

      formatTime: function (value) {
        // Formatter function to format the time
        if (value) {
          // Format the time using the "short" style
          const oDateFormat = DateFormat.getTimeInstance({ style: "short" });
          const time = new Date(value.ms);
          return oDateFormat.format(time);
        }
        return value;
      },

      formatCityName: (value) => {
        // Formatter function to format the city name
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

      onPrint: function () {
        const oModel = this.getView().getModel();
        const data = oModel.getData();

        // Create a new jsPDF instance with custom page size and orientation
        const doc = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: [100, 210], // Custom size: width = 100mm, height = 210mm
        });

        // Set the background color
        doc.setFillColor(173, 216, 230); // Light blue color (R: 173, G: 216, B: 230)
        doc.rect(0, 0, 210, 100, "F"); // Set the dimensions of the rectangle

        // Set up the content of the PDF
        doc.setFontSize(18);
        doc.text("Boarding Pass", 10, 10);

        doc.setFontSize(14);
        doc.text("Flight Details", 10, 20);
        doc.text("Passenger Name: " + data.CustName, 10, 30);
        doc.text("Ticket Number: " + data.TickNum, 10, 40);
        doc.text("Flight Date: " + this.formatDate(data.FlightDate), 10, 50);
        doc.text("From: " + this.formatCityName(data.CityFrom), 10, 60);
        doc.text("To: " + this.formatCityName(data.CityTo), 10, 70);
        doc.text("Flight Number: " + data.FlConn, 130, 30);
        doc.text("Departure: " + this.formatTime(data.DepTime), 130, 40);
        doc.text("Arrival: " + this.formatTime(data.ArrTime), 130, 50);
        doc.text("Duration: " + this.formatFlightDuration(data.FlDur), 130, 60);
       

        // Save the PDF file
        doc.save("boarding_pass.pdf");
      },
    });
  }
);
