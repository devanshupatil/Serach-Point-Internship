const { mdToPdf } = require('md-to-pdf');
const fs = require('fs');

(async () => {
    try {
        console.log('Starting conversion...');
        const pdf = await mdToPdf({ path: 'Documentation.md' }, {
            pdf_options: { format: 'A4', margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' } },
            launch_options: { args: ['--no-sandbox', '--disable-setuid-sandbox'] } // Crucial for linux containers
        });

        if (pdf) {
            fs.writeFileSync('Documentation.pdf', pdf.content);
            console.log('Successfully created Documentation.pdf');
        }
    } catch (err) {
        console.error('Error generating PDF:', err);
    }
})();
