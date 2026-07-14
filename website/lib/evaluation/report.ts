import * as fs from 'fs';
import * as path from 'path';
import { RegressionReport } from './types';

export function generateReport(report: RegressionReport) {
  const rootDir = process.cwd();
  const reportPath = path.join(rootDir, 'regression-report.json');
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`\n[Evaluation] Regression report generated at: ${reportPath}`);
}
