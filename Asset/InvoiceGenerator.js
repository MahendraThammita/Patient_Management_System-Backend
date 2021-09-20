const PDFGenerator = require('pdfkit')
const fs = require('fs')

class InvoiceGenerator{
    constructor(invoice) {
        this.invoice = invoice
    }

    generateHeaders(doc) {
        const billingAddress = this.invoice.billing
        console.log(billingAddress);

        doc
            .image('./pmslogodart.png', 50, 50, { width: 250})
            .fillColor('#000')
            .fontSize(20)
            .text('INVOICE', 275, 50, {align: 'right'})
            .fontSize(10)
            .text(`Invoice Number: ${Math.random().toString(36).slice(2)}`, {align: 'right'})
            .text(`Due: ${this.invoice.date}`, {align: 'right'})
            .moveDown()
            .text(`Billing Address:\n ${billingAddress.name}\n${billingAddress.address}\n${billingAddress.city}\n${billingAddress.state},${billingAddress.country}`, {align: 'right'})
    
        const beginningOfPage = 50
        const endOfPage = 550

        doc.moveTo(beginningOfPage,200)
            .lineTo(endOfPage,200)
            .stroke()
                
        doc.text(`DISCLAIMER: ${this.invoice.memo || 'N/A'}`, 50, 210)

        doc.moveTo(beginningOfPage,250)
            .lineTo(endOfPage,250)
            .stroke()

    }

    generateTable(doc) {
        const tableTop = 270
        const patientCodeX = 120
        const dateCodeX = 50
        const doctorX = 350
        const descriptionX = 450
        const weightX = 240  
        const priceX = 300
        const amountX = 350

        doc
            .fontSize(10)
            .text('Date', dateCodeX, tableTop, {bold: true})
            .text('Patient Name', patientCodeX, tableTop, {bold: true})
            .text('Patient Weight', weightX, tableTop)
            .text('Doctor Name', doctorX, tableTop)
            .text('Description', descriptionX, tableTop)

            const y = tableTop + 25 + (0 * 25)

            doc
                .fontSize(10)
                .text(this.invoice.date, dateCodeX, y)
                .text(this.invoice.billing.name, patientCodeX, y)
                .text(this.invoice.weight, weightX, y)
                .text(this.invoice.doctor, doctorX, y)
                .text(this.invoice.docDesc, descriptionX, y)

        const items = this.invoice.items
        let i = 0
    }

    generateFooter(doc) {
        doc
            .fontSize(10)
            .text(`Payment due upon receipt. `, 50, 700, {
                align: 'center'
            })
    }

    generate() {
        let theOutput = new PDFGenerator 

        //console.log(this.invoice)

        const fileName = "test2.pdf"

        // pipe to a writable stream which would save the result into the same directory
        theOutput.pipe(fs.createWriteStream(fileName))

        this.generateHeaders(theOutput)

        theOutput.moveDown()

        this.generateTable(theOutput)

        this.generateFooter(theOutput)
        

        // write out file
        theOutput.end()

    }
}

module.exports = InvoiceGenerator