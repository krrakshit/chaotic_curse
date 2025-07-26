const fs = require('fs');
const path = require('path');

const companiesDir = './public/data/companies';
const outputFile = './public/data/companies-list.json';

// File mapping from JSON filenames to period keys
const FILE_MAPPING = {
  'all.json': 'all',
  'more-than-six-months.json': 'moreThanSixMonths',
  'six-months.json': 'underSixMonths',
  'three-months.json': 'threeMonths',
  'thirty-days.json': 'thirtyDays'
};

function regenerateCompaniesList() {
  console.log('🚀 Regenerating companies-list.json...\n');
  
  if (!fs.existsSync(companiesDir)) {
    console.error(`❌ Companies directory '${companiesDir}' not found!`);
    return;
  }

  const companies = [];
  let totalCompanies = 0;
  let totalQuestions = 0;

  // Read all company folders
  const companyFolders = fs.readdirSync(companiesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  if (companyFolders.length === 0) {
    console.error('❌ No company folders found!');
    return;
  }

  console.log(`📁 Found ${companyFolders.length} company folders\n`);

  companyFolders.forEach(companyFolder => {
    const companyPath = path.join(companiesDir, companyFolder);
    const jsonFiles = fs.readdirSync(companyPath).filter(file => file.endsWith('.json'));
    
    if (jsonFiles.length === 0) {
      console.warn(`⚠️  Skipping ${companyFolder}: No JSON files found`);
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

    // Process each JSON file
    jsonFiles.forEach(file => {
      const filePath = path.join(companyPath, file);
      
      try {
        // Read JSON file
        const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Map filename to period
        const period = FILE_MAPPING[file];
        if (period) {
          company.questionCounts[period] = questions.length;
          company.availablePeriods.push(period);
          totalQuestions += questions.length;
          
          console.log(`  ✅ ${file}: ${questions.length} questions`);
        } else {
          console.log(`  ⚠️  Unknown file format: ${file}`);
        }
        
      } catch (error) {
        console.error(`  ❌ Error processing ${file}:`, error.message);
      }
    });

    if (company.availablePeriods.length > 0) {
      // Sort available periods to maintain consistent order
      company.availablePeriods.sort((a, b) => {
        const order = ['all', 'moreThanSixMonths', 'underSixMonths', 'threeMonths', 'thirtyDays'];
        return order.indexOf(a) - order.indexOf(b);
      });
      
      companies.push(company);
      totalCompanies++;
      console.log(`  🎯 Added ${company.name} with periods: ${company.availablePeriods.join(', ')}\n`);
    } else {
      console.warn(`  ⚠️  Skipped ${company.name}: No valid JSON files\n`);
    }
  });

  // Sort companies alphabetically by name
  companies.sort((a, b) => a.name.localeCompare(b.name));

  // Save companies list
  try {
    fs.writeFileSync(outputFile, JSON.stringify(companies, null, 2));
    
    console.log('🎉 Companies list regenerated successfully!\n');
    console.log(`📈 Summary:`);
    console.log(`   • ${totalCompanies} companies processed`);
    console.log(`   • ${totalQuestions} total questions`);
    console.log(`   • Output: ${outputFile}`);
    
    // Show some examples
    console.log(`\n📋 Sample companies:`);
    companies.slice(0, 5).forEach(company => {
      console.log(`   • ${company.name}: ${company.availablePeriods.length} periods, ${Object.values(company.questionCounts).reduce((a, b) => a + b, 0)} total questions`);
    });
    
    if (companies.length > 5) {
      console.log(`   • ... and ${companies.length - 5} more companies`);
    }
    
  } catch (error) {
    console.error('❌ Error saving companies list:', error.message);
  }
}

// Run the script
try {
  regenerateCompaniesList();
} catch (error) {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
} 