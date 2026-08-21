import { expect, test } from "bun:test";

test("runs on Bun 1.4", () => {
  expect(Bun.version.startsWith("1.4.")).toBe(true);
});

test("uses Bun-native project tooling", async () => {
  const packageJson = JSON.parse(await Bun.file("package.json").text());

  expect(packageJson.packageManager).toBe("bun@1.4.0");
  expect(packageJson.scripts.dev).toBe("bun run next dev");
  expect(packageJson.scripts.build).toContain("bun run next build");
  expect(packageJson.scripts.test).toBe("bun test");
  expect(packageJson.scripts["build:tools"]).toContain("bun build");
});
