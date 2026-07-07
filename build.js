import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, "posts");
const PROJECTS_DIR = path.join(ROOT, "projects");
const DIST_DIR = path.join(ROOT, "dist");
const BLOG_DIR = path.join(DIST_DIR, "blog");
const PROJECTS_DIST = path.join(DIST_DIR, "projects");
const TEMPLATE = fs.readFileSync(path.join(ROOT, "templates", "base.html"), "utf8");

function render({ title, description, content }) {
  return TEMPLATE
    .replaceAll("{{TITLE}}", title)
    .replaceAll("{{DESCRIPTION}}", description || "")
    .replace("{{CONTENT}}", content)
    .replaceAll("{{YEAR}}", new Date().getFullYear());
}

function build() {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
  fs.mkdirSync(BLOG_DIR, { recursive: true });
  fs.mkdirSync(PROJECTS_DIST, { recursive: true });

  // copy assets
  fs.cpSync(path.join(ROOT, "assets"), path.join(DIST_DIR, "assets"), { recursive: true });

  // copy static homepage
  fs.copyFileSync(path.join(ROOT, "homepage.html"), path.join(DIST_DIR, "index.html"));
  fs.copyFileSync(path.join(ROOT, "profile-pic.png"), path.join(DIST_DIR, "profile-pic.png"));

  const blogFiles = fs.existsSync(POSTS_DIR)
    ? fs.readdirSync(POSTS_DIR).filter(f => f.endsWith(".md"))
    : [];

  const posts = blogFiles.map(file => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const slug = data.slug || file.replace(/\.md$/, "");
    const html = marked.parse(content);

    const formattedDate = data.date
      ? new Date(data.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : "";

    const page = render({
      title: `${data.title} — kanevskyy.dev`,
      description: data.description,
      content: `<article>
<h1>${data.title}</h1>
<time class="post-date">${formattedDate}</time>
${html}
</article>`
    });

    fs.mkdirSync(path.join(BLOG_DIR, slug), { recursive: true });
    fs.writeFileSync(path.join(BLOG_DIR, slug, "index.html"), page);

    return { ...data, slug, displayDate: formattedDate };
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  // blog index
  const listItems = posts.map(p => `<li>
  <a href="/blog/${p.slug}/">${p.title}</a>
  <time class="post-date">${p.displayDate || ""}</time>
</li>`).join("\n");

  fs.writeFileSync(path.join(BLOG_DIR, "index.html"), render({
    title: "Blog — kanevskyy.dev",
    content: `<h1>Blog</h1><ul class="post-list">${listItems}</ul>`
  }));

  // build projects
  const projectFiles = fs.existsSync(PROJECTS_DIR)
    ? fs.readdirSync(PROJECTS_DIR).filter(f => f.endsWith(".md"))
    : [];

  const projects = projectFiles.map(file => {
    const raw = fs.readFileSync(path.join(PROJECTS_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const slug = data.slug || file.replace(/\.md$/, "");
    const html = marked.parse(content);

    const page = render({
      title: `${data.title} — kanevskyy.dev`,
      description: data.description,
      content: `<article>
<h1>${data.title}</h1>
${html}
</article>`
    });

    fs.mkdirSync(path.join(PROJECTS_DIST, slug), { recursive: true });
    fs.writeFileSync(path.join(PROJECTS_DIST, slug, "index.html"), page);

    return { ...data, slug };
  });

  // projects index
  const projectItems = projects.map(p => `<li>
  <a href="/projects/${p.slug}/">${p.title}</a>
</li>`).join("\n");

  fs.writeFileSync(path.join(PROJECTS_DIST, "index.html"), render({
    title: "Projects — kanevskyy.dev",
    content: `<h1>Projects</h1><ul class="post-list">${projectItems}</ul>`
  }));

  console.log(`Built ${posts.length} post(s) and ${projects.length} project(s).`);
}

build();
