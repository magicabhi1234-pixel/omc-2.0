# Sanity Studio Audit Report

## Scope
- Main app: omc-2-0
- Active studio route: /studio
- Active Sanity config: sanity.config.ts
- Active schema folder: sanityStudio/schemaTypes

## Findings
- The app has three Sanity-related projects in the workspace: omc-2-0, omc-test, and omc-cms.
- The active Next.js app uses one Sanity configuration, while the additional folders contain duplicate Sanity projects and configs.
- The active studio config was pulling project metadata from a hard-coded helper file instead of the environment-driven values used by the app.
- The environment files defined conflicting Sanity project IDs: .env used ta4h5bou while .env.local used 9net5r17.
- The studio route itself is wired correctly to NextStudio and the active sanity.config.ts file.

## Root cause
The Studio route was effectively loading a different Sanity project identity than the app client because the Studio helper file and the app environment files were out of sync.

## Planned fix
- Align the Studio config with the app environment values.
- Remove the hard-coded Sanity project identity from the Studio helper file.
- Keep the active app studio route intact and make it use the same project/dataset settings as the rest of the app.
