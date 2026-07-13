// The Studio configuration and schemas live in omc-test.
// Keeping this re-export preserves the existing embedded /studio route while
// ensuring omc-test is the single source of truth.
export { default } from "../omc-test/sanity.config";
