import { expect, test } from "bun:test";
import {
  capabilityRows,
  evidenceLine,
  getVerifiedProjects,
  milestoneLine,
  revisionLink,
  type OpenForgeProject,
} from "@/lib/oss-openforge-status";

test("getVerifiedProjects returns none when no project carries a status block", () => {
  const projects: OpenForgeProject[] = [
    { id: "openforge", repository: "dasomel/openforge" },
    { id: "narwhal", repository: "dasomel/narwhal" },
  ];

  expect(getVerifiedProjects(projects)).toEqual([]);
});

test("shapes a Beluga-style verified project: revision link, evidence line, capability row", () => {
  const beluga = {
    id: "beluga",
    repository: "dasomel/beluga",
    status: {
      revision: "8dedb46",
      milestone: "openforge-compliance-baseline",
      progress_percent: 85,
      evidence: { ci: "pass", security: "pass", runtime: "partial", commit: "8dedb4614da34752f07c15736ea06d3c3cbe9c4b" },
      capabilities: {
        "compliance-baseline": {
          status: "implemented",
          verification: { unit: "pass", integration: "pass", runtime: "not-applicable", security: "pass" },
        },
      },
    },
  };

  expect(getVerifiedProjects([beluga])).toEqual([beluga]);
  expect(revisionLink(beluga)).toEqual({ short: "8dedb46", href: "https://github.com/dasomel/beluga/commit/8dedb46" });
  expect(evidenceLine(beluga.status!)).toBe("pass · pass · partial");
  expect(milestoneLine(beluga.status!, { milestone: "Milestone", progress: "Progress" })).toBe(
    "Milestone: openforge-compliance-baseline · Progress 85%"
  );

  // "not-applicable" must read as "not applicable" (statusLabel applied to verification values).
  const rows = capabilityRows(beluga.status!);
  expect(rows).toEqual([{ id: "compliance-baseline", line: "pass · pass · not applicable · pass" }]);
});

test("revisionLink omits href without a repository, but still returns the short revision", () => {
  const project: OpenForgeProject = { id: "x", status: { revision: "abc1234" } };
  expect(revisionLink(project)).toEqual({ short: "abc1234", href: undefined });
});

test("revisionLink is undefined without a revision at all", () => {
  const project: OpenForgeProject = { id: "x", repository: "dasomel/x", status: {} };
  expect(revisionLink(project)).toBeUndefined();
});

test("milestoneLine renders progress independently when milestone is absent", () => {
  expect(milestoneLine({ progress_percent: 80 }, { milestone: "Milestone", progress: "Progress" })).toBe(
    "Progress 80%"
  );
  expect(milestoneLine({ milestone: "reconcile-history" }, { milestone: "Milestone", progress: "Progress" })).toBe(
    "Milestone: reconcile-history"
  );
  expect(milestoneLine({}, { milestone: "Milestone", progress: "Progress" })).toBeUndefined();
});

test("capabilityRows skips null and non-object capability entries instead of throwing", () => {
  const status = {
    capabilities: {
      "policy-compiler": { verification: { unit: "pass" } },
      // Upstream never validates this field (see status.schema.json vs. validate_status_payload),
      // so a malformed or null entry must be skipped, not crash the render.
      broken: null,
      "also-broken": "not-an-object",
    },
  } as unknown as Parameters<typeof capabilityRows>[0];

  expect(capabilityRows(status)).toEqual([
    { id: "policy-compiler", line: "pass · — · — · —" },
  ]);
});
