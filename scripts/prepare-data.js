// scripts/prepare-data.js
import fs from "fs"
import path from 'path';
import Papa from'papaparse'

const inputDir = './raw-data'; // Your existing company folders
const outputDir = './public/data';

const FILE_MAPPING = {
  'under-six-months.csv': 'underSixMonths',
  'more-than-six-months.csv': 'moreThanSixMonths',
  'all.csv': 'all'
};

function createCompaniesData() {
  const companies = [];
  
  // Create output directory structure
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const companiesDir = path.join(outputDir, 'companies');
  if (!fs.existsSync(companiesDir)) {
    fs.mkdirSync(companiesDir, { recursive: true });
  }

  // Read all company folders
  const companyFolders = fs.readdirSync(inputDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  companyFolders.forEach(companyFolder => {
    const companyPath = path.join(inputDir, companyFolder);
    const csvFiles = fs.readdirSync(companyPath).filter(file => file.endsWith('.csv'));
    
    if (csvFiles.length === 0) return; // Skip folders without CSV files
    
    // Create company object
    const company = {
      id: companyFolder.toLowerCase(),
      name: companyFolder.split(/[-_]/).map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      slug: companyFolder.toLowerCase(),
      questionCounts: {},
      availablePeriods: []
    };

    // Create output company directory
    const outputCompanyDir = path.join(companiesDir, companyFolder);
    if (!fs.existsSync(outputCompanyDir)) {
      fs.mkdirSync(outputCompanyDir, { recursive: true });
    }

    // Process each CSV file
    csvFiles.forEach(file => {
      const filePath = path.join(companyPath, file);
      const outputFilePath = path.join(outputCompanyDir, file);
      
      try {
        // Copy file to output directory
        fs.copyFileSync(filePath, outputFilePath);
        
        // Count questions and determine period
        const csvContent = fs.readFileSync(filePath, 'utf8');
        const parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true });
        const questionCount = parsed.data.filter(row => row.Title && row.Title.trim()).length;
        
        // Map filename to period
        const period = FILE_MAPPING[file];
        if (period) {
          company.questionCounts[period] = questionCount;
          company.availablePeriods.push(period);
        }
        
        console.log(`Processed ${companyFolder}/${file}: ${questionCount} questions`);
      } catch (error) {
        console.error(`Error processing ${companyFolder}/${file}:`, error.message);
      }
    });

    if (company.availablePeriods.length > 0) {
      companies.push(company);
    }
  });

  // Save companies list
  fs.writeFileSync(
    path.join(outputDir, 'companies-list.json'),
    JSON.stringify(companies, null, 2)
  );

  console.log(`\nData preparation complete!`);
  console.log(`Processed ${companies.length} companies`);
  console.log(`Companies: ${companies.map(c => c.name).join(', ')}`);
}

// Run the script
createCompaniesData();