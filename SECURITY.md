# Security Policy

## Supported versions

The latest minor release is supported. Until version 1.0, security fixes may include necessary API changes and will be documented clearly.

## Reporting a vulnerability

Do not open a public issue for a vulnerability that could expose user content, enable unsafe file access, or disrupt live projection.

Send a private report to the maintainer through the contact method listed on the GitHub profile. Include:

- affected version or commit;
- reproduction steps or a minimal proof of concept;
- expected and observed behavior;
- potential impact;
- suggested mitigation, when available.

Please allow reasonable time for investigation before public disclosure.

## Security scope

Security-relevant areas include validation of imported cue data, path or URL handling in future adapters, denial-of-service risks in state processing, display-selection safety, dependency integrity, and accidental leakage of audience or church content.

This core package does not itself read files, access networks, store credentials, render HTML, or execute media. Host applications remain responsible for securely implementing those boundaries.
