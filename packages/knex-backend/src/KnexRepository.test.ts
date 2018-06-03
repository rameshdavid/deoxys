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

let knex: Knex;
let repo: KnexRepository<User>;

const testFile = path.join(__dirname, "../data/test.sqlite");
const usersTbl = () => knex("users");

beforeAll(async () => {
  knex = Knex({
    client: "sqlite3",
    debug: true,
    connection: {
      filename: testFile
    }
  });
  await knex.schema.createTable("users", t => {
    t.integer("id");
    t.integer("age");
    t.string("name");
  });
  repo = Repository(usersTbl());
  for (let id = 1; id <= 5; id++) {
    await usersTbl().insert({
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
    const user = await repo.findOne({ id: 1 });
    expect(user!.name).toBe("User_1");
  });

  test("findMany", async () => {
    const users = await repo.findMany({ age: 100 });
    expect(users.length).toBe(5);
  });

  test("insertOne", async () => {
    const user = {
      id: 10,
      name: "Lorefnon",
      age: 99
    };
    await repo.insertOne(user);
    const fetchedUser = await usersTbl()
      .where({ id: 10 })
      .first();
    expect(user).toEqual(fetchedUser);
  });

  test("insertMany", async () => {
    const users = [
      {
        id: 11,
        name: "User_11",
        age: 99
      },
      {
        id: 12,
        name: "User_12",
        age: 99
      }
    ];
    await repo.insertMany(users);
    const fetchedUsers = await usersTbl()
      .where({id: 11})
      .orWhere({id: 12});
    expect(fetchedUsers).toEqual(users);
  });

  const getCount = (cond: any) => usersTbl().where(cond).count().then(([{"count(*)": count}]) => count);

  test("deleteOne", async () => {
    await usersTbl().insert({id: 20, name: "User_20", age: 99});
    const count1 = await getCount({id: 20});
    expect(count1).toBe(1);
    await repo.deleteOne({id: 20});
    const count2 = await getCount({id: 20});
    expect(count2).toBe(0);
  });

  test("deleteMany", async () => {
    await usersTbl().insert([{id: 21, name: "Ram", age: 99}, {id: 22, name: "Ram", age: 99}]);
    const count1 = await getCount({name: "Ram"});
    expect(count1).toBe(2);
    await repo.deleteMany({name: "Ram"});
    const count2 = await getCount({name: "Ram"});
    expect(count2).toBe(0);
  });

});
