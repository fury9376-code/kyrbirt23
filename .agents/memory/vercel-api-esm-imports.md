---
name: Vercel API ESM imports
description: Compatibility rule for the TypeScript source imported by the Vercel serverless function.
---

All relative ESM imports in the Vercel API dependency chain must use explicit `.js` extensions, including shared workspace-library indexes. Prefer named CommonJS-compatible exports when a package provides them, and let `express()` infer the application type rather than annotating it as `Express`.

**Why:** Local builds use bundler resolution, but Vercel typechecks the serverless entry with NodeNext. Extensionless imports and some default CommonJS imports pass locally but fail during deployment. Vercel can also resolve the exported `Express` type differently from the callable factory's inferred application type, causing valid `.use()` calls to fail typechecking.

**How to apply:** After changing the API dependency chain, run a standalone TypeScript check of the Vercel entry with `module` and `moduleResolution` set to `NodeNext`, in addition to the normal workspace checks.