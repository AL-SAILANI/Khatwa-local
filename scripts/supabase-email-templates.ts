/**
 * Arabic auth e-mail templates for Supabase.
 *
 *   node --import tsx scripts/supabase-email-templates.ts --write
 *       writes supabase/email-templates/*.html (preview / manual paste)
 *   SUPABASE_ACCESS_TOKEN=... node --import tsx scripts/supabase-email-templates.ts --apply
 *       pushes subjects + templates to the project via the Management API.
 *
 * The access token is a personal token from
 * https://supabase.com/dashboard/account/tokens (revoke it afterwards).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { EMAIL_TEMPLATES } from "./lib/email-templates";

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF ?? "dcjhxgckzffhkplrnycl";
const args = new Set(process.argv.slice(2));

async function main() {
  if (args.has("--write")) {
    mkdirSync("supabase/email-templates", { recursive: true });
    for (const t of EMAIL_TEMPLATES) {
      writeFileSync(`supabase/email-templates/${t.key}.html`, t.html);
      console.log(`wrote supabase/email-templates/${t.key}.html  (subject: ${t.subject})`);
    }
  }

  if (args.has("--apply")) {
    const token = process.env.SUPABASE_ACCESS_TOKEN;
    if (!token) {
      console.error("Set SUPABASE_ACCESS_TOKEN (https://supabase.com/dashboard/account/tokens).");
      process.exit(1);
    }
    const body: Record<string, string> = {};
    for (const t of EMAIL_TEMPLATES) {
      body[`mailer_subjects_${t.key}`] = t.subject;
      body[`mailer_templates_${t.key}_content`] = t.html;
    }
    const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      console.error(`Supabase API ${response.status}: ${(await response.text()).slice(0, 400)}`);
      process.exit(1);
    }
    console.log(`Applied ${EMAIL_TEMPLATES.length} templates to project ${PROJECT_REF}.`);
  }

  if (!args.has("--write") && !args.has("--apply")) {
    console.log("Use --write (files) and/or --apply (push to Supabase).");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
