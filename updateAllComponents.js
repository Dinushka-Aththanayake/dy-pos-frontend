// updateAllComponents.js - Script to update all components to use runtime config
// Run this with: node updateAllComponents.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsToUpdate = [
  'src/Component/Dashboard/Account/Account.jsx',
  'src/Component/Dashboard/Account/RegisterUser/RegisterUser.jsx',
  'src/Component/Dashboard/Appoinment/Appoinment.jsx',
  'src/Component/Dashboard/Appoinment/NewAppoinment/NewAppoinment.jsx',
  'src/Component/Dashboard/Billing/Billing.jsx',
  'src/Component/Dashboard/Billing/HoldBills/HoldBills.jsx',
  'src/Component/Dashboard/History/History.jsx',
  'src/Component/Dashboard/History/ShowBills/BillView.jsx',
  'src/Component/Dashboard/Inventory/Inventory.jsx',
  'src/Component/Dashboard/Inventory/NewInventory/NewInventory.jsx',
  'src/Component/Dashboard/JobCard/JobCard.jsx',
  'src/Component/Dashboard/JobCard/NewJobcard/NewJobcards.jsx',
  'src/Component/Dashboard/Payout/Payout.jsx',
  'src/Component/Dashboard/Product/Product.jsx',
  'src/Component/Dashboard/Report/Salary/Salary.jsx',
  'src/Component/Dashboard/Report/Salary/SalaryCalculator/SalaryCalculator.jsx',
  'src/Component/Dashboard/Report/Sales/Sales.jsx',
  'src/Component/Dashboard/Report/Services/Services.jsx',
  'src/Component/Login/Login.jsx',
];

function updateComponent(filePath) {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;

  // Check if already updated
  if (content.includes('import { apiRequest }') || content.includes('import { loadConfig }')) {
    console.log(`✓ Already updated: ${filePath}`);
    return false;
  }

  // Pattern 1: Replace const API_BASE_URL with let
  if (content.includes('const API_BASE_URL = import.meta.env.VITE_API_BASE_URL')) {
    content = content.replace(
      'const API_BASE_URL = import.meta.env.VITE_API_BASE_URL',
      'let API_BASE_URL = import.meta.env.VITE_API_BASE_URL'
    );
    modified = true;
  }

  // Add import for config loader
  const importRegex = /import\s+.*?from\s+['"]react['"];?/;
  if (importRegex.test(content) && !content.includes('loadConfig')) {
    content = content.replace(
      importRegex,
      `$&\nimport { loadConfig } from "${getRelativePath(filePath)}";`
    );
    modified = true;
  }

  if (modified) {
    // Backup original file
    fs.writeFileSync(fullPath + '.backup', content);
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Updated: ${filePath}`);
    console.log(`   Backup created: ${filePath}.backup`);
    return true;
  }

  return false;
}

function getRelativePath(filePath) {
  const depth = (filePath.match(/\//g) || []).length - 1;
  return '../'.repeat(depth) + 'config';
}

console.log('🔧 Starting component updates...\n');

let updatedCount = 0;
let skippedCount = 0;

componentsToUpdate.forEach(filePath => {
  if (updateComponent(filePath)) {
    updatedCount++;
  } else {
    skippedCount++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Updated: ${updatedCount}`);
console.log(`   Skipped: ${skippedCount}`);
console.log(`\n⚠️  IMPORTANT: You still need to manually add the config loading logic to each component's useEffect!`);
console.log(`   See FIX_DOCUMENTATION.md for details.`);
