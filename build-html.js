// 讀取 md 清單，產生 html/ 下對應的 .html（marked + mermaid 由 CDN 於瀏覽器端渲染）
// 重新產生：node build-html.js
const fs = require("fs");
const path = require("path");

const SRC = __dirname;
const OUT = path.join(SRC, "html");
fs.mkdirSync(OUT, { recursive: true });

const FILES = [
  "00-AI導入總覽.md",
  "雲端AI資料防護構想.md",
  "AI職務增強評估框架.md",
  "AI增效價值飛輪與分配.md",
  "Claude落地實作示例.md",
];

function page(title, json) {
  return [
    "<!doctype html>",
    '<html lang="zh-Hant">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    "<title>" + title + "</title>",
    '<link rel="stylesheet" href="styles.css">',
    "</head>",
    "<body>",
    '<main id="content" class="markdown-body"></main>',
    "<script>window.__MD__ = " + json + ";<\/script>",
    '<script src="https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"><\/script>',
    '<script src="render.js"><\/script>',
    "</body>",
    "</html>",
  ].join("\n");
}

for (const f of FILES) {
  const md = fs.readFileSync(path.join(SRC, f), "utf8");
  const t = md.match(/^#\s+(.+?)\s*$/m);
  const title = (t ? t[1] : f.replace(/\.md$/, "")).replace(/[<>&]/g, "");
  const json = JSON.stringify(md).replace(/<\//g, "<\\/"); // 防止 </script> 提前關閉
  const out = f.replace(/\.md$/, ".html");
  fs.writeFileSync(path.join(OUT, out), page(title, json), "utf8");
  console.log("wrote", out);
}

// 入口：開資料夾時自動導向總覽
fs.writeFileSync(
  path.join(OUT, "index.html"),
  '<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8">' +
    '<meta http-equiv="refresh" content="0; url=00-AI導入總覽.html">' +
    "<title>AI 導入文件</title></head>" +
    '<body><a href="00-AI導入總覽.html">前往總覽 →</a></body></html>',
  "utf8"
);
console.log("wrote index.html");
console.log("done:", OUT);
