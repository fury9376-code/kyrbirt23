---
name: Vercel API ESM imports
description: Compatibility rule for the TypeScript source imported by the Vercel serverless function.
---

All relative ESM imports in the Vercel API dependency chain must use explicit `.js` extensions, including shared workspace-library indexes. Prefer named CommonJS-compatible exports when a package provides them. Infer Express factory types, but annotate every route callback with project-owned structural request/response types.

**Why:** Local builds use bundler resolution, but Vercel typechecks the serverless entry differently. In this project Vercel resolved imported Express aliases without expected inherited methods and did not provide contextual types for inferred Router callbacks, causing both missing-property and implicit-any failures.

**How to apply:** After changing the API dependency chain, run a standalone TypeScript check of the Vercel entry with `module` and `moduleResolution` set to `NodeNext`, in addition to the normal workspace checks.

Keep Drizzle tables, client, and query helpers imported from `@workspace/db` so Vercel cannot resolve incompatible package identities. Structurally narrow the result of Node's global `fetch()` when only a small response surface is required.

Vercel's filesystem catch-all did not capture nested API paths in this mixed static/function deployment. Always smoke-test both one-level and nested endpoints on the public production alias.