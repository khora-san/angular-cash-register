# Caisse YummyComponents

Implémentation complète du TP décrit dans [../README.md](../README.md) (les 8 étapes obligatoires
plus plusieurs bonus).

1. Lancer le serveur Java à la racine du dépôt : `mvnw.cmd spring-boot:run` (Windows) ou `./mvnw spring-boot:run`.
2. Dans ce dossier :

```bash
npm install
npm start          # http://localhost:4200
```

Générer un composant : `npx ng generate component caisse/product-card`
Générer un service : `npx ng generate service services/catalog`

## Design notes

**`AuthService`: Observable-based, not Promise/async-await.** `login()` and `logout()`
return the raw `Observable` from `HttpClient` (with a `tap()` side effect to store the
token), rather than converting to a `Promise` via `firstValueFrom` and using
`async/await`. Reasoning: the guard and the interceptor built on top of `AuthService`
already reason in terms of `Observable`/`signal`, and `HttpClient` itself is
Observable-native — staying consistent avoids mixing two async styles for the same
small feature. The trade-off: a `Promise`-based version reads more like plain JS
(`try { await auth.login(...) } catch { ... }`), at the cost of losing RxJS
composability (`switchMap`, `retry`, cancellation via `unsubscribe()`) if the login flow
ever needs to chain into another request.
