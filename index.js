const express = require("express");
const fs = require("fs-extra");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/templates", express.static(path.join(__dirname, "templates")));

app.post("/save-template", async (req, res) => {
  const { templateName, templateContent } = req.body;
  const templatePath = path.join(__dirname, "templates", `${templateName}.hbs`);
  try {
    await fs.outputFile(templatePath, templateContent);
    res.status(200).send({ message: "Template saved successfully!" });
  } catch (err) {
    res.status(500).send({ message: "Error saving template." });
  }
});

app.post("/generate-pdf", async (req, res) => {
  const { templateName, data } = req.body;
  const templatePath = path.join(__dirname, "templates", `${templateName}.hbs`);
  try {
    const templateContent = await fs.readFile(templatePath, "utf-8");
    const template = handlebars.compile(templateContent);
    const html = template(data);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    res.contentType("application/pdf");
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).send({ message: "Error generating PDF." });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at ${port}`);
});
