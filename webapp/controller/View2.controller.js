// @ts-nocheck
sap.ui.define(
  [
    "sap/ui/core/mvc/Controller", // Import Controller from SAP UI5
    "sap/ui/core/routing/History", // Import History for navigation
    "../assets/FormatterHelper", // Import FormatterHelper
    "../assets/pizzip", // Import Pizzip
    "../assets/docxtemplater", // Import DocXTemplater
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   * @param {typeof sap.ui.core.mvc.History} History
   * @param {typeof sap.ui.core.format.DateFormat} DateFormat
   */
  function (Controller, History, FormatterHelper) {
    "use strict";

    return Controller.extend("project1.controller.View2", {
      // This function is called when the controller is initialized
      onInit: function () {
        // Get the shared model from the owner component and set it to the view
        var oSharedModel = this.getOwnerComponent().getModel("shared");
        this.getView().setModel(oSharedModel);
      },
      formatDate: FormatterHelper.formatDate,
      formatFlightDuration: FormatterHelper.formatFlightDuration,
      formatTime: FormatterHelper.formatTime,
      formatCityName: FormatterHelper.formatCityName,

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

      // This function is called when the print button is pressed
      onPrint: async function () {
        // Get the data from the view's model
        const data = this.getView().getModel().getData();

        // Check if the necessary data is available
        if (
          !data ||
          !data.CustName ||
          !data.FlightNum ||
          !data.FlightDate ||
          !data.CityFrom ||
          !data.CityTo
        ) {
          sap.m.MessageToast.show(
            "Required data is missing. Please check the details and try again."
          );
          return;
        }

        // Get the root path of the app
        const sRootPath = jQuery.sap.getModulePath("project1");

        // Define the path to the .docx template
        const templatePath = sRootPath + "/assets/bp.docx";

        let busyDialog;
        try {
          // Show a busy dialog while the document is being generated
          busyDialog = new sap.m.BusyDialog();
          busyDialog.open();

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
          link.download = `${data.CustName}_Flight_${data.FlightNum}.docx`;
          link.click();

          // Close the busy dialog
          busyDialog.close();

          // Show a success message
          sap.m.MessageToast.show(
            "The document was generated and the download will start shortly."
          );
        } catch (error) {
          busyDialog.close()
          // Handle the error if the request was not successful
          sap.m.MessageToast.show(
            "An error occurred while generating the document. Please try again later."
          );
          console.error("Failed to load the .docx file", error);
        }
      },
    });
  }
);
