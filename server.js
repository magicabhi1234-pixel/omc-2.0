// cPanel (Phusion Passenger) entry point - see .cpanel.yml. Plain CommonJS on
// purpose: it runs directly under Node, outside the Next/TypeScript toolchain.
// eslint-disable-next-line @typescript-eslint/no-require-imports
require("./.next/standalone/server.js");
