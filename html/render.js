(function () {
  "use strict";
  var md = window.__MD__ || "";

  // 把相對的 .md 連結改寫成 .html（保留可能的 #錨點）
  md = md.replace(/\]\(([^)]+?)\.md(#[^)]*)?\)/g, function (_, p, anchor) {
    return "](" + p + ".html" + (anchor || "") + ")";
  });

  if (window.marked) {
    marked.setOptions({ gfm: true, breaks: false });
    document.getElementById("content").innerHTML = marked.parse(md);
  } else {
    document.getElementById("content").textContent = md;
  }

  // 頂部導覽列
  var pages = [
    ["00-AI導入總覽.html", "總覽"],
    ["雲端AI資料防護構想.html", "① 資料防護"],
    ["AI職務增強評估框架.html", "② 職務框架"],
    ["AI增效價值飛輪與分配.html", "③ 價值飛輪"],
    ["Claude落地實作示例.html", "Claude 落地"],
    ["資料數位化程度與AI介入.html", "資料數位化"]
  ];
  var current = decodeURIComponent((location.pathname.split("/").pop() || ""));
  var nav = document.createElement("nav");
  nav.className = "topnav";
  nav.innerHTML = pages.map(function (p) {
    var active = p[0] === current ? ' class="active"' : "";
    return '<a href="' + encodeURI(p[0]) + '"' + active + ">" + p[1] + "</a>";
  }).join("");
  document.body.insertBefore(nav, document.body.firstChild);

  // 把 ```mermaid 程式碼區塊轉成 <pre class="mermaid"> 讓 mermaid 認得
  Array.prototype.forEach.call(
    document.querySelectorAll("code.language-mermaid"),
    function (code) {
      var holder = document.createElement("pre");
      holder.className = "mermaid";
      holder.textContent = code.textContent;
      code.parentElement.replaceWith(holder);
    }
  );

  // 渲染圖表
  if (window.mermaid) {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: "default",
      flowchart: { htmlLabels: true, useMaxWidth: true }
    });
    mermaid.run();
  }
})();
