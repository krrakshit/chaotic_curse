// scripts/prepare-data.js
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const inputDir = './raw-data'; // Your existing company folders
const outputDir = './public/data';

const FILE_MAPPING = {
  'six-months.csv': 'underSixMonths',
  'more-than-six-months.csv': 'moreThanSixMonths',
  'all.csv': 'all',
  'three-months.csv': 'threeMonths',
  'thirty-days.csv': 'thirtyDays',
};


function parseQuestionRow(row, index) {
  return {
    id: parseInt(row.ID) || index + 1,
    title: row.Title?.trim() || '',
    difficulty: row.Difficulty?.trim() || 'Medium',
    acceptanceRate: parseFloat(row['Acceptance %']?.replace('%', '') || '0'),
    frequency: parseFloat(row['Frequency %']?.replace('%', '') || '0'),
    url: row.URL?.trim() || '',
    tags: [], // Not present in your CSV structure
    isPremium: false // Not present in your CSV structure
  };
}

// Function to parse CSV and return questions array
async function parseCSVToJSON(csvContent) {
  return new Promise((resolve, reject) => {
    Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (results) => {
        try {
          const questions = results.data
            .map((row, index) => parseQuestionRow(row, index))
            .filter(q => q.title && q.url && q.id); // Filter out invalid rows
          resolve(questions);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => reject(error)
    });
  });
}

function createCompaniesData() {
  const companies = [];
  let totalQuestionsProcessed = 0;
  
  console.log('🚀 Starting CSV to JSON conversion...\n');
  
  // Create output directory structure
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const companiesDir = path.join(outputDir, 'companies');
  if (!fs.existsSync(companiesDir)) {
    fs.mkdirSync(companiesDir, { recursive: true });
  }

  // Check if input directory exists
  if (!fs.existsSync(inputDir)) {
    console.error(`❌ Input directory '${inputDir}' not found!`);
    console.log('Please create the raw-data directory and place your company folders there.');
    return;
  }

  // Read all company folders
  const companyFolders = fs.readdirSync(inputDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  if (companyFolders.length === 0) {
    console.error('❌ No company folders found in raw-data directory!');
    return;
  }

  console.log(`📁 Found ${companyFolders.length} company folders: ${companyFolders.join(', ')}\n`);

  companyFolders.forEach(companyFolder => {
    const companyPath = path.join(inputDir, companyFolder);
    const csvFiles = fs.readdirSync(companyPath).filter(file => file.endsWith('.csv'));
    
    if (csvFiles.length === 0) {
      console.warn(`⚠️  Skipping ${companyFolder}: No CSV files found`);
      return;
    }
    
    console.log(`📊 Processing ${companyFolder}...`);
    
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

    // Process each CSV file and convert to JSON
    csvFiles.forEach(async (file) => {
      const filePath = path.join(companyPath, file);
      
      try {
        // Read and parse CSV
        const csvContent = fs.readFileSync(filePath, 'utf8');
        const questions = await parseCSVToJSON(csvContent);
        
        // Map filename to period
        const period = FILE_MAPPING[file];
        if (period) {
          // Save as JSON file
          const jsonFileName = file.replace('.csv', '.json');
          const outputJsonPath = path.join(outputCompanyDir, jsonFileName);
          
          fs.writeFileSync(outputJsonPath, JSON.stringify(questions, null, 2));
          
          company.questionCounts[period] = questions.length;
          company.availablePeriods.push(period);
          totalQuestionsProcessed += questions.length;
          
          console.log(`  ✅ ${file} → ${jsonFileName}: ${questions.length} questions`);
        } else {
          console.log(`  ⚠️  Unknown file format: ${file}`);
        }
        
      } catch (error) {
        console.error(`  ❌ Error processing ${file}:`, error.message);
      }
    });

    if (company.availablePeriods.length > 0) {
      companies.push(company);
      console.log(`  🎯 Added ${company.name} with periods: ${company.availablePeriods.join(', ')}\n`);
    } else {
      console.warn(`  ⚠️  Skipped ${company.name}: No valid CSV files\n`);
    }
  });

  // Create a consolidated data file for faster loading (optional)
  const consolidatedData = {};
  companies.forEach(company => {
    consolidatedData[company.slug] = {
      company: company,
      questions: {}
    };
    
    company.availablePeriods.forEach(period => {
      try {
        const fileName = Object.keys(FILE_MAPPING).find(key => FILE_MAPPING[key] === period);
        const jsonFileName = fileName.replace('.csv', '.json');
        const jsonPath = path.join(companiesDir, company.slug, jsonFileName);
        
        if (fs.existsSync(jsonPath)) {
          const questionsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
          consolidatedData[company.slug].questions[period] = questionsData;
        }
      } catch (error) {
        console.error(`Error reading JSON for ${company.slug}/${period}:`, error.message);
      }
    });
  });

  // Save companies list
  try {
    fs.writeFileSync(
      path.join(outputDir, 'companies-list.json'),
      JSON.stringify(companies, null, 2)
    );
    
    // Save consolidated data (optional - for even faster loading)
    fs.writeFileSync(
      path.join(outputDir, 'all-companies-data.json'),
      JSON.stringify(consolidatedData, null, 2)
    );
    
    console.log('🎉 CSV to JSON conversion completed successfully!\n');
    console.log(`📈 Summary:`);
    console.log(`   • ${companies.length} companies processed`);
    console.log(`   • ${totalQuestionsProcessed} total questions converted`);
    console.log(`   • Companies: ${companies.map(c => c.name).join(', ')}`);
    console.log(`\n📂 Output structure:`);
    console.log(`   • public/data/companies-list.json`);
    console.log(`   • public/data/all-companies-data.json (consolidated)`);
    companies.forEach(company => {
      console.log(`   • public/data/companies/${company.slug}/`);
      company.availablePeriods.forEach(period => {
        const fileName = Object.keys(FILE_MAPPING).find(key => FILE_MAPPING[key] === period);
        const jsonFileName = fileName.replace('.csv', '.json');
        console.log(`     - ${jsonFileName}`);
      });
    });
    
    console.log(`\n💡 Benefits of JSON format:`);
    console.log(`   • Faster parsing (no CSV processing needed)`);
    console.log(`   • Better type safety`);
    console.log(`   • Reduced bundle size`);
    console.log(`   • Native JavaScript object format`);
    
  } catch (error) {
    console.error('❌ Error saving data files:', error.message);
  }
}

// Run the script
try {
  createCompaniesData();
} catch (error) {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
}