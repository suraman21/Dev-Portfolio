import type { CmsData, ContactMessage } from "@/types/cms";

function sqlStr(value: string | undefined | null): string {
  const s = value ?? "";
  return (
    "'" +
    s
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "''")
      .replace(/\r/g, "\\r")
      .replace(/\n/g, "\\n") +
    "'"
  );
}

function sqlJson(value: unknown): string {
  return sqlStr(JSON.stringify(value ?? null));
}

/**
 * Generates an immediately importable MySQL 8 seed script reflecting the
 * exact live content currently managed in the Admin Panel.
 */
export function generateMysqlExport(cms: CmsData, messages: ContactMessage[]): string {
  const lines: string[] = [
    "-- ============================================================================",
    `-- Dev-Portfolio CMS — Live MySQL 8 / MariaDB Export (${new Date().toISOString()})`,
    "-- cPanel Safe: Select your cPanel database in phpMyAdmin, then click Import!",
    "-- ============================================================================",
    "",
    "SET NAMES utf8mb4;",
    "START TRANSACTION;",
    "",
    `INSERT INTO \`site_settings\` (\`id\`, \`site_json\`, \`about_json\`) VALUES (1, ${sqlJson(cms.site)}, ${sqlJson(cms.about)}) ON DUPLICATE KEY UPDATE \`site_json\` = VALUES(\`site_json\`), \`about_json\` = VALUES(\`about_json\`);`,
    "",
    "DELETE FROM `services`;",
  ];

  cms.services.forEach((s, idx) => {
    lines.push(
      `INSERT INTO \`services\` (\`id\`, \`name\`, \`short_description\`, \`timeline\`, \`starting_price\`, \`accent\`, \`active\`, \`sort_order\`) VALUES (${sqlStr(s.id)}, ${sqlStr(s.name)}, ${sqlStr(s.shortDescription)}, ${sqlStr(s.timeline)}, ${sqlStr(s.startingPrice)}, ${sqlStr(s.accent)}, ${s.active ? 1 : 0}, ${idx});`
    );
  });

  lines.push("", "DELETE FROM `projects`;");
  cms.projects.forEach((p, idx) => {
    lines.push(
      `INSERT INTO \`projects\` (\`id\`, \`slug\`, \`number\`, \`title\`, \`client\`, \`year\`, \`role\`, \`timeline\`, \`category\`, \`media_json\`, \`theme_json\`, \`tagline\`, \`key_result\`, \`overview\`, \`stack_json\`, \`metrics_json\`, \`challenge_json\`, \`solution_json\`, \`outcome_json\`, \`featured\`, \`published\`, \`live_url\`, \`sort_order\`) VALUES (${sqlStr(p.id || `proj-${idx + 1}`)}, ${sqlStr(p.slug)}, ${sqlStr(p.number)}, ${sqlStr(p.title)}, ${sqlStr(p.client)}, ${sqlStr(p.year)}, ${sqlStr(p.role)}, ${sqlStr(p.timeline)}, ${sqlStr(p.category)}, ${sqlJson(p.media)}, ${sqlJson(p.theme)}, ${sqlStr(p.tagline)}, ${sqlStr(p.keyResult)}, ${sqlStr(p.overview)}, ${sqlJson(p.stack)}, ${sqlJson(p.metrics)}, ${sqlJson(p.challenge)}, ${sqlJson(p.solution)}, ${sqlJson(p.outcome)}, ${p.featured !== false ? 1 : 0}, ${p.published !== false ? 1 : 0}, ${p.liveUrl ? sqlStr(p.liveUrl) : "NULL"}, ${idx});`
    );
  });

  lines.push("", "DELETE FROM `build_steps`;");
  cms.buildSteps.forEach((st, idx) => {
    lines.push(
      `INSERT INTO \`build_steps\` (\`id\`, \`number\`, \`label\`, \`title\`, \`highlight\`, \`description\`, \`accent\`, \`points_json\`, \`stat_value\`, \`stat_label\`, \`visual_type\`, \`sort_order\`) VALUES (${sqlStr(st.id || `step-${idx + 1}`)}, ${sqlStr(st.number)}, ${sqlStr(st.label)}, ${sqlStr(st.title)}, ${sqlStr(st.highlight)}, ${sqlStr(st.description)}, ${sqlStr(st.accent)}, ${sqlJson(st.points)}, ${sqlStr(st.statValue)}, ${sqlStr(st.statLabel)}, ${sqlStr(st.visualType)}, ${idx});`
    );
  });

  lines.push("", "DELETE FROM `testimonials`;");
  cms.testimonials.forEach((t, idx) => {
    lines.push(
      `INSERT INTO \`testimonials\` (\`id\`, \`quote\`, \`author\`, \`role\`, \`company\`, \`result\`, \`sort_order\`) VALUES (${sqlStr(t.id || `test-${idx + 1}`)}, ${sqlStr(t.quote)}, ${sqlStr(t.author)}, ${sqlStr(t.role)}, ${sqlStr(t.company)}, ${sqlStr(t.result)}, ${idx});`
    );
  });

  lines.push("", "DELETE FROM `experiences`;");
  cms.experiences.forEach((e, idx) => {
    lines.push(
      `INSERT INTO \`experiences\` (\`id\`, \`period\`, \`role\`, \`company\`, \`location\`, \`summary\`, \`highlights_json\`, \`sort_order\`) VALUES (${sqlStr(e.id || `exp-${idx + 1}`)}, ${sqlStr(e.period)}, ${sqlStr(e.role)}, ${sqlStr(e.company)}, ${sqlStr(e.location)}, ${sqlStr(e.summary)}, ${sqlJson(e.highlights)}, ${idx});`
    );
  });

  lines.push("", "DELETE FROM `skill_groups`;");
  cms.skillGroups.forEach((g, idx) => {
    lines.push(
      `INSERT INTO \`skill_groups\` (\`id\`, \`title\`, \`accent\`, \`skills_json\`, \`sort_order\`) VALUES (${sqlStr(g.id || `skill-${idx + 1}`)}, ${sqlStr(g.title)}, ${sqlStr(g.accent)}, ${sqlJson(g.skills)}, ${idx});`
    );
  });

  lines.push("", "DELETE FROM `media_assets`;");
  cms.mediaLibrary.forEach((m) => {
    lines.push(
      `INSERT INTO \`media_assets\` (\`id\`, \`filename\`, \`url\`, \`alt\`, \`mime_type\`, \`size_bytes\`) VALUES (${sqlStr(m.id)}, ${sqlStr(m.filename)}, ${sqlStr(m.url)}, ${sqlStr(m.alt)}, ${sqlStr(m.mimeType)}, ${m.sizeBytes ?? "NULL"});`
    );
  });

  if (messages.length > 0) {
    lines.push("", "-- Contact Messages");
    messages.forEach((m) => {
      lines.push(
        `INSERT INTO \`contact_messages\` (\`id\`, \`name\`, \`email\`, \`service_id\`, \`service_name\`, \`budget\`, \`message\`, \`status\`) VALUES (${sqlStr(m.id)}, ${sqlStr(m.name)}, ${sqlStr(m.email)}, ${m.serviceId ? sqlStr(m.serviceId) : "NULL"}, ${sqlStr(m.serviceName)}, ${sqlStr(m.budget || "")}, ${sqlStr(m.message)}, ${sqlStr(m.status)}) ON DUPLICATE KEY UPDATE \`status\` = VALUES(\`status\`);`
      );
    });
  }

  lines.push("", "COMMIT;", "");
  return lines.join("\n");
}
