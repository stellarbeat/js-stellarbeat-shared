[![Known Vulnerabilities](https://snyk.io/test/github/stellarbeat/js-stellarbeat-shared/badge.svg)](https://snyk.io/test/github/stellarbeat/js-stellarbeat-shared)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
# js-stellarbeat-shared

Shared code between js-stellarbeat-frontend and js-stellarbeat-backend.

DTO classes like Node, Organization and Network are defined here and can be hydrated from the backend API responses.

Other code like the TrustGraph calculation is used in the backend to calculate and store stats for the live network, and is used in the frontend for simulation purposes.

install dependencies
`yarn install`

build code:
`npm run build`

test code:
`npm run test`