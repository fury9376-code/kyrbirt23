---
name: Vercel API ESM imports
description: Compatibility rule for the TypeScript source imported by the Vercel serverless function.
---

All relative ESM imports in the Vercel API dependency chain must use explicit `.js` extensions, including shared workspace-library indexes. Prefer named CommonJS-compatible exports when a package provides them. Let Express factories and route callbacks infer their types; do not annotate them with types imported from `express`.

**Why:** Local builds use bundler resolution, but Vercel typechecks the serverless entry with NodeNext. Extensionless imports and some default CommonJS imports pass locally but fail during deployment. In this project Vercel resolved manually imported `Express`, `IRouter`, `Request`, and `Response` types without their expected inherited methods, while factory and callback inference remained valid.

**How to apply:** After changing the API dependency chain, run a standalone TypeScript check of the Vercel entry with `module` and `moduleResolution` set to `NodeNext`, in addition to the normal workspace checks.