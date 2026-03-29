#!/usr/bin/env node

/**
 * Skills使用分析工具
 * 分析代码是否符合skill中定义的规则
 */

const fs = require('fs');
const path = require('path');

const SKILL_RULES = {
  'java-cola-developer': {
    name: 'Java COLA Developer',
    patterns: [
      { rule: 'Record作为DTO', regex: /^public record \w+\(/, severity: 'recommended' },
      { rule: 'VirtualThreads', regex: /Thread\.ofVirtual|VirtualThread\.of/, severity: 'optional' },
      { rule: 'PatternMatching', regex: /instanceof\s+\w+\s*\(/, severity: 'recommended' },
      { rule: 'MapStruct', regex: /@Mapper/, severity: 'required' },
      { rule: '禁止BeanUtils', regex: /BeanUtils\.|BeanCopy/, severity: 'forbidden', inverted: true },
      { rule: 'Mono/Flux响应式', regex: /Mono<|Flux</, severity: 'optional' },
      { rule: '@NotBlank校验', regex: /@NotBlank|@Email|@NotNull/, severity: 'recommended' }
    ]
  },
  'react-developer': {
    name: 'React Developer',
    patterns: [
      { rule: 'TypeScript严格模式', regex: /: any\b/, severity: 'forbidden', inverted: true },
      { rule: 'React.lazy懒加载', regex: /React\.lazy\(/, severity: 'recommended' },
      { rule: 'useState局部状态', regex: /useState/, severity: 'recommended' },
      { rule: 'Zustand全局状态', regex: /create\(|zustand/, severity: 'optional' },
      { rule: 'ReactQuery服务端', regex: /useQuery|useMutation/, severity: 'optional' },
      { rule: '错误边界', regex: /componentDidCatch|getDerivedStateFromError/, severity: 'recommended' }
    ]
  },
  'ios-developer': {
    name: 'iOS Developer',
    patterns: [
      { rule: '@Published状态', regex: /@Published/, severity: 'recommended' },
      { rule: 'Combine响应式', regex: /AnyPublisher|Publisher/, severity: 'optional' },
      { rule: '@State局部状态', regex: /@State/, severity: 'recommended' },
      { rule: 'Protocol依赖注入', regex: /\w+:\s*\w+Protocol/, severity: 'recommended' }
    ]
  },
  'harmony-developer': {
    name: 'HarmonyOS Developer',
    patterns: [
      { rule: '@Observed响应式', regex: /@Observed/, severity: 'required' },
      { rule: '@Component组件化', regex: /@Component/, severity: 'required' },
      { rule: 'LazyForEach优化', regex: /LazyForEach/, severity: 'recommended' },
      { rule: '@State局部状态', regex: /@State/, severity: 'required' },
      { rule: '@Link双向绑定', regex: /@Link/, severity: 'optional' }
    ]
  }
};

class SkillsAnalyzer {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.results = {};
  }

  scanFile(filePath) {
    const ext = path.extname(filePath);
    const skillMap = {
      '.java': 'java-cola-developer',
      '.ts': 'react-developer',
      '.tsx': 'react-developer',
      '.swift': 'ios-developer',
      '.ets': 'harmony-developer'
    };

    const skill = skillMap[ext];
    if (!skill) return null;

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return this.analyzeContent(skill, content, filePath);
    } catch (e) {
      return null;
    }
  }

  analyzeContent(skill, content, filePath) {
    const rules = SKILL_RULES[skill];
    if (!rules) return null;

    const results = {
      skill: skill,
      skillName: rules.name,
      file: filePath,
      matched: [],
      violations: []
    };

    for (const pattern of rules.patterns) {
      const matches = content.match(pattern.regex);
      
      if (pattern.inverted) {
        if (matches) {
          results.violations.push({
            rule: pattern.rule,
            severity: pattern.severity,
            count: matches.length
          });
        }
      } else {
        if (matches) {
          results.matched.push({
            rule: pattern.rule,
            severity: pattern.severity,
            count: matches.length
          });
        }
      }
    }

    return results;
  }

  scanDirectory(dir, extensions) {
    const files = [];
    
    const walk = (currentDir) => {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'target') {
          continue;
        }
        
        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (extensions.includes(path.extname(entry.name))) {
          files.push(fullPath);
        }
      }
    };
    
    walk(dir);
    return files;
  }

  generateReport() {
    console.log('\n========== Skills使用分析报告 ==========\n');
    
    const skillStats = {};
    
    for (const [skill, data] of Object.entries(SKILL_RULES)) {
      skillStats[skill] = {
        name: data.name,
        total: data.patterns.length,
        matched: 0,
        violations: 0,
        rules: {}
      };
    }

    for (const [file, result] of Object.entries(this.results)) {
      if (!result) continue;
      
      for (const m of result.matched) {
        if (!skillStats[result.skill].rules[m.rule]) {
          skillStats[result.skill].rules[m.rule] = { count: 0, severity: m.severity };
        }
        skillStats[result.skill].rules[m.rule].count += m.count;
        skillStats[result.skill].matched++;
      }
      
      for (const v of result.violations) {
        if (!skillStats[result.skill].rules[v.rule]) {
          skillStats[result.skill].rules[v.rule] = { count: 0, severity: v.severity };
        }
        skillStats[result.skill].rules[v.rule].count += v.count;
        skillStats[result.skill].violations++;
      }
    }

    for (const [skill, stats] of Object.entries(skillStats)) {
      console.log(`## ${stats.name}`);
      console.log(`使用率: ${stats.matched}/${stats.total} (${Math.round(stats.matched/stats.total*100)}%)`);
      console.log(`违规: ${stats.violations}\n`);
      
      console.log('### 规则使用详情');
      for (const [rule, data] of Object.entries(stats.rules)) {
        const icon = data.severity === 'required' ? '🔴' : 
                     data.severity === 'recommended' ? '🟡' : 
                     data.severity === 'optional' ? '🟢' : '⚫';
        console.log(`  ${icon} ${rule}: ${data.count}次`);
      }
      console.log('');
    }

    return skillStats;
  }

  run() {
    const extensions = ['.java', '.ts', '.tsx', '.swift', '.ets'];
    const files = this.scanDirectory(this.projectRoot, extensions);
    
    console.log(`扫描 ${files.length} 个源文件...\n`);
    
    for (const file of files) {
      const result = this.scanFile(file);
      if (result) {
        this.results[file] = result;
      }
    }

    return this.generateReport();
  }
}

const projectRoot = process.cwd();
const analyzer = new SkillsAnalyzer(projectRoot);
analyzer.run();
