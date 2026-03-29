/**
 * Test Verify Hook
 * 运行单元测试和接口测试验证，收集覆盖率
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const LOG_FILE = path.join(__dirname, '../logs/hook-log.jsonl');

// 测试框架配置
const TEST_FRAMEWORKS = {
  java: {
    patterns: ['pom.xml', 'build.gradle'],
    testCmd: 'mvn test -q 2>&1',
    coverageCmd: 'mvn jacoco:report 2>&1',
    coverageFile: 'target/site/jacoco/index.html',
    timeout: 120000
  },
  javascript: {
    patterns: ['package.json'],
    testCmd: 'npm test -- --passWithNoTests 2>&1',
    coverageCmd: 'npm run test:coverage 2>&1 || npm run coverage 2>&1 || echo "no coverage"',
    coverageFile: 'coverage/coverage-summary.json',
    timeout: 60000
  },
  typescript: {
    patterns: ['tsconfig.json'],
    testCmd: 'npm test 2>&1',
    coverageCmd: 'npm run test:coverage 2>&1 || npx vitest run --coverage 2>&1 || echo "no coverage"',
    coverageFile: 'coverage/coverage-summary.json',
    timeout: 60000
  },
  python: {
    patterns: ['requirements.txt', 'setup.py', 'pyproject.toml'],
    testCmd: 'python -m pytest -v 2>&1',
    coverageCmd: 'python -m pytest --cov --cov-report=json 2>&1',
    coverageFile: 'coverage.json',
    timeout: 60000
  }
};

function detectTestFramework(dir) {
  const files = fs.readdirSync(dir);

  for (const [framework, config] of Object.entries(TEST_FRAMEWORKS)) {
    for (const pattern of config.patterns) {
      if (files.includes(pattern)) {
        return { framework, ...config };
      }
    }
  }

  const parent = path.dirname(dir);
  if (parent !== dir && parent !== path.parse(dir).root) {
    return detectTestFramework(parent);
  }

  return null;
}

function runTests(filePath, framework) {
  const result = {
    file: path.basename(filePath),
    framework: framework.name,
    passed: null,
    duration: null,
    tests: null,
    errors: []
  };

  const startTime = Date.now();

  try {
    const output = execSync(framework.testCmd, {
      encoding: 'utf-8',
      timeout: framework.timeout,
      cwd: path.dirname(filePath)
    });

    result.passed = true;
    result.duration = Date.now() - startTime;
    result.tests = parseTestResults(output, framework.name);

  } catch (e) {
    result.passed = false;
    result.duration = Date.now() - startTime;
    result.tests = parseTestResults(e.stdout || e.message, framework.name);
    result.errors = extractErrors(e.stdout || e.message, framework.name);
  }

  return result;
}

function runCoverage(filePath, framework) {
  const result = {
    coverage: null,
    details: {}
  };

  try {
    execSync(framework.coverageCmd, {
      encoding: 'utf-8',
      timeout: 120000,
      cwd: path.dirname(filePath)
    });

    const coverageFile = path.join(path.dirname(filePath), framework.coverageFile);
    if (fs.existsSync(coverageFile)) {
      result.coverage = parseCoverage(coverageFile, framework.name);
    }
  } catch (e) {
    // coverage 可选，忽略失败
  }

  return result;
}

function parseTestResults(output, framework) {
  const results = { total: 0, passed: 0, failed: 0, skipped: 0 };

  if (framework === 'java') {
    const match = output.match(/Tests run:\s*(\d+),\s*Failures:\s*(\d+),\s*Errors:\s*(\d+)/);
    if (match) {
      results.total = parseInt(match[1]);
      results.failed = parseInt(match[2]) + parseInt(match[3]);
      results.passed = results.total - results.failed;
    }
  } else if (framework === 'javascript' || framework === 'typescript') {
    // Jest: Tests: 5 passed, 5 total
    const match = output.match(/Tests:\s*(\d+)\s*passed/);
    if (match) {
      results.passed = parseInt(match[1]);
      const totalMatch = output.match(/(\d+)\s*total/);
      results.total = totalMatch ? parseInt(totalMatch[1]) : results.passed;
    }
    // Vitest
    const vitestMatch = output.match(/(\d+)\s*passed.*?(\d+)\s*failed/);
    if (vitestMatch) {
      results.passed = parseInt(vitestMatch[1]);
      results.failed = parseInt(vitestMatch[2]);
      results.total = results.passed + results.failed;
    }
  } else if (framework === 'python') {
    // pytest: 5 passed in 1.23s
    const match = output.match(/(\d+)\s*passed/);
    if (match) {
      results.passed = parseInt(match[1]);
      results.total = results.passed;
    }
  }

  return results;
}

function parseCoverage(coverageFile, framework) {
  try {
    if (framework === 'java') {
      // Jacoco HTML - 提取覆盖率数字
      const html = fs.readFileSync(coverageFile, 'utf-8');
      const match = html.match(/Total.*?(\d+)%/);
      return match ? parseInt(match[1]) : null;
    } else if (framework === 'javascript' || framework === 'typescript') {
      // Istanbul/Lcov format
      const json = JSON.parse(fs.readFileSync(coverageFile, 'utf-8'));
      const total = json.total;
      if (total && total.lines) {
        return Math.round(total.lines.pct || 0);
      }
    } else if (framework === 'python') {
      // pytest-cov JSON
      const json = JSON.parse(fs.readFileSync(coverageFile, 'utf-8'));
      const totals = json.totals;
      return totals ? Math.round(totals.percent_covered || 0) : null;
    }
  } catch (e) {
    // ignore
  }
  return null;
}

function extractErrors(output, framework) {
  const errors = [];
  const lines = output.split('\n');

  if (framework === 'java') {
    const failMatches = output.matchAll(/(\w+)\[\w+\]\s*-\s*(.*)/g);
    for (const match of failMatches) {
      errors.push({ test: match[1], message: match[2].substring(0, 150) });
    }
  } else {
    const errorLines = lines.filter(l =>
      l.includes('FAIL') || l.includes('●') || l.includes('Error:')
    );
    errors.push(...errorLines.slice(0, 3).map(l => ({ message: l.substring(0, 150) })));
  }

  return errors.slice(0, 5);
}

function logResult(result) {
  const log = {
    timestamp: new Date().toISOString(),
    hook: 'test_verify',
    type: 'test',
    ...result
  };

  try {
    fs.appendFileSync(LOG_FILE, JSON.stringify(log) + '\n');
  } catch (e) {
    // ignore
  }
}

module.exports = async (ctx) => {
  const { tool_name: toolName, tool_input: input } = ctx;

  if (!['Write', 'Edit'].includes(toolName)) return;

  const filePath = input?.file_path;
  if (!filePath) return;

  const codeExts = ['.java', '.js', '.ts', '.tsx', '.py', '.go', '.rs'];
  const ext = path.extname(filePath);
  if (!codeExts.includes(ext)) return;

  if (filePath.includes('test') || filePath.includes('spec')) return;

  const framework = detectTestFramework(path.dirname(filePath));
  if (!framework) return;

  // 运行测试
  const testResult = runTests(filePath, framework);
  logResult(testResult);

  // 尝试获取覆盖率
  const coverageResult = runCoverage(filePath, framework);
  if (coverageResult.coverage !== null) {
    testResult.coverage = coverageResult.coverage;
    logResult({ hook: 'coverage', coverage: coverageResult.coverage });
  }

  // 输出结果
  const status = testResult.passed ? '✅' : '❌';
  const coverageStr = testResult.coverage !== null ? ` | 覆盖率: ${testResult.coverage}%` : '';

  console.log(`[test_verify] ${status} ${testResult.file} - ${testResult.framework}`);
  console.log(`       ${testResult.tests?.passed || 0}/${testResult.tests?.total || 0} passed (${testResult.duration}ms)${coverageStr}`);

  if (!testResult.passed && testResult.errors.length > 0) {
    testResult.errors.forEach(e => {
      console.log(`       ${e.test ? e.test + ': ' : ''}${e.message}`);
    });
  }

  return testResult;
};
