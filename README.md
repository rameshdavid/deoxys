# Deoxys

:warning: This package is in early development.

---

[![Build](https://travis-ci.org/deoxys-node/deoxys.svg?branch=master)](https://travis-ci.org/deoxys-node/deoxys)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.png?v=101)](https://github.com/ellerbrock/typescript-badges/)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.png?v=103)](https://opensource.org/licenses/mit-license.php)
[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/deoxys-node/Lobby)

Deoxys is an flexible, adaptable and type-safe repository pattern implementation for Node.js.

Deoxys encourages you to build your applications such that:

1. Your business logic deals with plain objects or simple entity classes which are decoupled from the specifics of any persistence solution. These entities don't know how or if they are saved in any data stores.

2. Repositories deal with the responsibility of persisting these entities into data stores (SQL, NoSQL, KeyValue stores etc.) through different backends.

## Usage

To use deoxys, you primarily need:

1. The core library, which provides fundamental common APIs for facilitating the repository abstraction:

```
npm install --save @deoxys/core

// OR

yarn add @deoxys/core
```

2. A persistence backend, which facilitates persisting these repositories in data stores like an SQL database, MongoDB etc.

Currently the only backend available is the knex-backend, which integrates with all major relational databases including Postgres, MySQL, MSSQL etc.

Deoxys test suite currently covers only Postgres and Sqlite.

```
npm install --save @deoxys/knex-backend

// OR

yarn add @deoxys/knex-backend
```

## API Docs

- [@deoxys/repository](https://deoxys-node.github.io/deoxys/packages/repository/docs/index.html)
- [@deoxys/knex-backend](https://deoxys-node.github.io/deoxys/packages/knex-backend/docs/index.html)

## Example

### Basic

```
// user-repo.ts

import * as knex from "knex";
import {Repository} from "@deoxys/knex-backend";

const usersRepo = Repository({
    source: knex("users")
});

usersRepo.insertOne({
    id: 1,
    name: "Alkazar"
})

usersRepo.find({
    name: "Alkazar"
}).then((entity) => {
    console.log(entity);
})
```

### Repositories backed by joined tables

### Custom repositories

### Using mappers along with repositories
