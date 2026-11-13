// Run only against disposable local Supabase, never the hosted project.
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
const env = JSON.parse(
  execFileSync("npx", ["--no-install", "supabase", "status", "-o", "json"], {
    encoding: "utf8",
  }),
);
if (!/^http:\/\/(127\.0\.0\.1|localhost):/.test(env.API_URL))
  throw Error("Expected local Supabase");
const admin = createClient(env.API_URL, env.SERVICE_ROLE_KEY);
const email = "trove-ci@example.test";
const password = "local-ci-password-only-123";
const { data, error } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});
if (error) throw error;
const member = await admin
  .from("trove_members")
  .insert({ user_id: data.user.id });
if (member.error) throw member.error;
writeFileSync(
  ".env.test.local",
  `VITE_SUPABASE_URL=${env.API_URL}\nVITE_SUPABASE_PUBLISHABLE_KEY=${env.ANON_KEY}\n`,
);
// Public local key only; service credential never enters build output or logs.
writeFileSync(
  "/tmp/trove-test-env",
  `export VITE_SUPABASE_URL='${env.API_URL}'\nexport VITE_SUPABASE_PUBLISHABLE_KEY='${env.ANON_KEY}'\nexport TROVE_TEST_EMAIL='${email}'\nexport TROVE_TEST_PASSWORD='${password}'\n`,
);
