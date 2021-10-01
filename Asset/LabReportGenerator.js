const PDFGenerator = require('pdfkit')
const fs = require('fs')
const moment= require('moment') 

class LabReportGenerator{
    constructor(test) {
        this.test = test
    }

    generateHeaders(doc) {
        const patient = this.test.patient
        console.log(patient);

        doc
            .image('./pmslogodart.png', 50, 50, { width: 250})
            .fillColor('#000')
            .fontSize(20)
            .text('LAB REPORT', 275, 50, {align: 'right'})
            .fontSize(10)
            .text(`Test Report Number: ${Math.random().toString(36).slice(2)}`, {align: 'right'})
            .text(`Due: ${moment(this.test.date, "dd-MM-yyyy")}`, {align: 'right'})
            .moveDown()
            .text(`Patient Address:\n ${patient.fullName}\n${patient.addressLine1}\n${patient.addressLine2}\n${patient.city},${patient.email}`, {align: 'right'})
    
        const beginningOfPage = 50
        const endOfPage = 550

        doc.moveTo(beginningOfPage,200)
            .lineTo(endOfPage,200)
            .stroke()
                
        // doc.text(`DISCLAIMER: ${this.invoice.memo || 'N/A'}`, 50, 210)

        // doc.moveTo(beginningOfPage,250)
        //     .lineTo(endOfPage,250)
        //     .stroke()

    }

    generatePatientInformation(doc) {
        const patientData = this.test.patient;
      
        doc
          .text(`Patient Name: ${patientData.fullName}`, 50, 210)
          .text(`Patient Email: ${patientData.email}` , 50, 230)
          .text(`Patient Age:  ${patientData.age}`, 50, 250)
      
          .text(`Test Date: ${moment(new Date()).format("DD/MM/YYYY")}` , 300, 210)
          .text(`Speciman No: SPEC0159`, 300, 230)
          .text(`Test Id:  ${patientData._id}`, 300, 250)
          .moveDown();

          doc.moveTo(50,270)
            .lineTo(550,270)
            .stroke()
            .moveDown()

            .fontSize(15)
            .text(col1, 70, y)
            .text(col2, 180, y)
            .text(col3, 350, y);
      }

      generateTableRow(doc, y, col1, col2, col3) {
        doc
          .fontSize(10)
          .text(col1, 70, y)
          .text(col2, 180, y)
          .text(col3, 350, y);
      }

      generateResultsTable(doc) {
        let i,
          resultsTableTop = 280;
      
        for (i = 0; i < this.test.results.length; i++) {
          const item = this.test.results[i];
          const position = resultsTableTop + (i + 1) * 30;
          this.generateTableRow(
            doc,
            position,
            item.Item,
            item.ItemValue,
            item.Remark 
          );
        }
      }

    generateFooter(doc) {
        doc
            .fontSize(10)
            .text(`Issued By : Mahendra Thammita (PMS Laboratory Assistant) `, 50, 700, {
                align: 'center'
            })
    }

    generateLabReport() {
        let theOutput = new PDFGenerator 

        //console.log(this.invoice)

        const fileName = "labReport.pdf"

        // pipe to a writable stream which would save the result into the same directory
        theOutput.pipe(fs.createWriteStream(fileName))

        this.generateHeaders(theOutput)

        theOutput.moveDown()

        this.generatePatientInformation(theOutput)

        this.generateResultsTable(theOutput)

        this.generateFooter(theOutput)
        

        // write out file
        theOutput.end()

    }
}

module.exports = LabReportGenerator