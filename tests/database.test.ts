// Real PostgreSQL engine; local Supabase tests additionally cover its deployed auth roles/API.
import { readFileSync, readdirSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { expect, it } from "vitest";

it("migration enforces ownership, membership, review constraints, and atomic publication", async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon; create role authenticated; create schema auth;
 create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb);
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 grant usage on schema auth,public to authenticated,anon;
 grant execute on function auth.uid() to authenticated,anon;`);
    for (const name of readdirSync("supabase/migrations")
      .filter((name) => name.endsWith(".sql"))
      .sort()) {
      await db.exec(readFileSync(`supabase/migrations/${name}`, "utf8"));
    }
    await db.exec(`insert into auth.users(id,email) values('10000000-0000-0000-0000-000000000001','a@test'),('10000000-0000-0000-0000-000000000002','b@test'),('10000000-0000-0000-0000-000000000003','c@test');
 insert into public.trove_members(user_id) values('10000000-0000-0000-0000-000000000001'),('10000000-0000-0000-0000-000000000002');
 insert into public.trove_places(id,owner_id,name,location) values('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','My place','DC');
 set role authenticated; set "request.jwt.claim.sub" = '10000000-0000-0000-0000-000000000002';`);
    expect(
      (await db.query("select * from public.trove_places")).rows,
    ).toHaveLength(0);
    await expect(
      db.query(
        `insert into public.trove_places(owner_id,name,location) values('10000000-0000-0000-0000-000000000001','Forged','DC')`,
      ),
    ).rejects.toMatchObject({ code: "42501" });
    await expect(
      db.query(
        `select public.trove_publish_review('20000000-0000-0000-0000-000000000001','Forged',5,null,null,null)`,
      ),
    ).rejects.toMatchObject({ code: "42501" });
    await db.exec(
      `set "request.jwt.claim.sub" = '10000000-0000-0000-0000-000000000001';`,
    );
    await expect(
      db.query(
        `select public.trove_publish_review('20000000-0000-0000-0000-000000000001','Bad',6,null,null,null)`,
      ),
    ).rejects.toMatchObject({ code: "23514" });
    expect(
      (
        await db.query<{ status: string }>(
          "select status from public.trove_places",
        )
      ).rows[0].status,
    ).toBe("want");
    await expect(
      db.query(
        `select public.trove_publish_review('20000000-0000-0000-0000-000000000001','Empty',null,null,null,null)`,
      ),
    ).rejects.toMatchObject({ code: "23514" });
    await db.query(
      `select public.trove_publish_review('20000000-0000-0000-0000-000000000001','Good',5,null,null,null)`,
    );
    expect(
      (
        await db.query<{ status: string }>(
          "select status from public.trove_places",
        )
      ).rows[0].status,
    ).toBe("been");
    expect(
      (await db.query("select * from public.trove_reviews")).rows,
    ).toHaveLength(1);
    await db.exec(
      `set "request.jwt.claim.sub" = '10000000-0000-0000-0000-000000000002';`,
    );
    expect(
      (await db.query("select * from public.trove_reviews")).rows,
    ).toHaveLength(0);
    expect(
      (
        await db.query(
          `update public.trove_places set note='Stolen' returning id`,
        )
      ).rows,
    ).toHaveLength(0);
    await db.exec(
      `set "request.jwt.claim.sub" = '10000000-0000-0000-0000-000000000003';`,
    );
    await expect(
      db.query(
        `insert into public.trove_places(owner_id,name,location) values('10000000-0000-0000-0000-000000000003','Nonmember','DC')`,
      ),
    ).rejects.toMatchObject({ code: "42501" });
    await db.exec("reset role;");
    expect((await db.query("select * from public.profiles")).rows).toHaveLength(
      3,
    );
    await db.exec("set role anon;");
    await expect(
      db.query("select * from public.trove_places"),
    ).rejects.toMatchObject({ code: "42501" });
  } finally {
    await db.close();
  }
}, 15000);
