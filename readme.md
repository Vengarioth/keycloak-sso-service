# Keycloak SSO Service

Minimal stateless OpenID Connect SSO REST API Service to be used in front of Keycloak.

## environment variables

| key                       | description                                                 | example                                |
|---------------------------|-------------------------------------------------------------|----------------------------------------|
| PORT                      | the port the server will listen on                          | `3000`                                 |
| AUTH_SERVER_URL           | the url the auth server is found at                         | `http://localhost:8080/auth`           |
| AUTH_SERVER_CLIENT_ID     | the client_id used to authenticate with the auth server     | `test-client`                          |
| AUTH_SERVER_CLIENT_SECRET | the client_secret used to authenticate with the auth server | `00000000-0000-0000-0000-000000000000` |
| AUTH_SERVER_REALM         | the realm on the auth server to connect to                  | `users`                                |

## endpoints

| address         | body                                             | response                                                               |
|-----------------|--------------------------------------------------|------------------------------------------------------------------------|
| `/authenticate` | `{ "username": <string>, "password": <string> }` | `{ "id_token": <jwt>, "access_token": <jwt>, "refresh_token": <jwt> }` |
| `/refresh`      | `{ "refresh_token": <jwt> }`                     | `{ "id_token": <jwt>, "access_token": <jwt>, "refresh_token": <jwt> }` |

## licence

MIT
