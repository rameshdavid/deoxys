import * as Knex from "knex";
import * as path from "path";
import { remove } from "fs-extra";

import { KnexRepository } from "./KnexRepository";
import { Repository } from "./index";

interface User {
  id: number;
  name: string;
  age: number;
}

const testFile = path.join(__dirname, "../data/test.sqlite");

let knex: Knex;
let repo: KnexRepository<User>;

beforeAll(async () => {
  knex = Knex({
    client: "sqlite3",
    connection: {
      filename: testFile
    }
  });
  repo = Repository(knex("users"));
  await knex.schema.createTable("users", t => {
    t.integer("id");
    t.integer("age");
    t.string("name");
  });
  for (let id = 1; id <= 5; id++) {
    await knex("users").insert({
      id,
      age: 100,
      name: `User_${id}`
    });
  }
});

afterAll(async () => remove(testFile));

describe("KnexRepository", () => {
  repo = repo!;
  knex = knex!;

  test("findOne", async () => {
    const user: any = await repo.findOne({ id: 1 });
    expect(user.name).toBe("User_1");
  });

  test("findMany", async () => {
    const users: any[] = await repo.findMany({ age: 100 });
    expect(users.length).toBe(5);
  });

  test("insert", async () => {
    const user = {
      id: 10,
      name: "Lorefnon",
      age: 99
    };
    await repo.insertOne(user);
    const fetchedUser = await knex("users")
      .where({ id: 10 })
      .first();
    expect(user).toEqual(fetchedUser);
  });
});
