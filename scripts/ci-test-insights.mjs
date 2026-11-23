// Summarise a Playwright JSON report for the GitHub Actions job summary:
// flaky tests (failed, then passed on retry) and the slowest tests.
// Usage: node scripts/ci-test-insights.mjs reports/playwright.json
import { appendFileSync, existsSync, readFileSync } from "node:fs";

const [reportPath] = process.argv.slice(2);
const out = process.env.GITHUB_STEP_SUMMARY;
const write = (text) => (out ? appendFileSync(out, text) : process.stdout.write(text));

if (!reportPath || !existsSync(reportPath)) {
  write(`_No Playwright report at \`${reportPath}\`; tests may not have run._\n`);
  process.exit(0);
}

const report = JSON.parse(readFileSync(reportPath, "utf8"));
const rows = [];
const walk = (suite) => {
  for (const spec of suite.specs ?? [])
    for (const test of spec.tests ?? [])
      rows.push({
        name: `${spec.file}:${spec.line} › ${spec.title} [${test.projectName}]`,
        status: test.status, // expected | unexpected | flaky | skipped
        ms: (test.results ?? []).reduce((sum, r) => sum + (r.duration ?? 0), 0),
      });
  for (const child of suite.suites ?? []) walk(child);
};
for (const suite of report.suites ?? []) walk(suite);

const seconds = (ms) => (ms / 1000).toFixed(1);
const flaky = rows.filter((r) => r.status === "flaky");
const slowest = [...rows].sort((a, b) => b.ms - a.ms).slice(0, 5);

let md = "### Playwright insights\n\n";
md += flaky.length
  ? `⚠️ **${flaky.length} flaky** (failed, then passed on retry):\n\n${flaky.map((r) => `- ${r.name}`).join("\n")}\n\n`
  : "✅ No flaky tests in this run.\n\n";
md += "| Slowest tests | Seconds |\n| --- | ---: |\n";
md += slowest.map((r) => `| ${r.name} | ${seconds(r.ms)} |`).join("\n");
md += `\n\nTotal wall time: ${seconds(report.stats?.duration ?? 0)}s\n`;
write(md);
