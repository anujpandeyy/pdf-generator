const fs = require('fs');
const handlebars = require('handlebars');
const puppeteer = require('puppeteer');

async function generatePDF(data, templatePath, outputPath) {
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const template = handlebars.compile(templateSource);
  const html = template(data);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({ path: outputPath, format: 'A4' });
  await browser.close();

  console.log(`✅ PDF saved to: ${outputPath}`);
}


const data = {
  name: 'Anuj Pandey',
  position: 'Software Engineer',
  company: 'Tech Corp',
  startDate: 'May 1, 2025',
  salary: '120,000',
  dueDate: 'April 30, 2025',
  senderName: 'Jay Patel',
  senderTitle: 'HR Manager'
};

generatePDF(data, './templates/offer-letter.hbs', 'offer-letter.pdf');
