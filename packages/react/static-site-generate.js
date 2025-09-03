import fs from "fs/promises";
import { createServer } from "vite";
import items from "./src/mocks/items.json" with { type: "json" };

const vite = await createServer({
  server: {
    middlewareMode: true,
  },
});

const { mockServer } = await vite.ssrLoadModule("./src/mocks/serverMock.ts");

const { render } = await vite.ssrLoadModule("./src/main-server.tsx");

const BASE = "/front_6th_chapter4-1/react/";

async function writeRoute(url, template, outFile) {
  const { html, head, data } = await render(url, {});
  const result = template
    .replace(`<!--app-head-->`, head ?? "")
    .replace(`<!--app-data-->`, `<script>window.__INITIAL_DATA__ = ${data}</script>`)
    .replace(`<!--app-html-->`, html ?? "");
  await fs.writeFile(outFile, result, "utf-8");
}

async function generateStaticSite() {
  // HTML 템플릿 읽기
  const templatePath = "../../dist/react/index.html";
  const template = await fs.readFile(templatePath, "utf-8");
  mockServer.listen({
    onUnhandledRequest: "bypass",
  });

  try {
    const productIds = items.slice(100, 130).map((p) => p.productId);
    productIds.push(items.find((product) => product.productId === "86940857379").productId);

    for (const id of productIds) {
      const url = `${BASE}product/${id}/`;
      const outDir = `../../dist/react/product/${id}`;
      await fs.mkdir(outDir, { recursive: true });
      await writeRoute(url, template, `${outDir}/index.html`);
    }

    console.log("✅ SSG 완료: 홈 + 상품 상세 86940857379, 85067212996 포함 31개 생성");
  } finally {
    mockServer.close();
    vite.close();
  }
}

// 실행
await generateStaticSite();
