-- Additive migration: no changes to existing application tables or auth settings.
create table public.trove_members (
 user_id uuid primary key references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);
alter table public.trove_members enable row level security;
create policy member_reads_self on public.trove_members for select to authenticated using (user_id = (select auth.uid()));
grant select on public.trove_members to authenticated;
revoke all on public.trove_members from anon;

create table public.trove_places (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references public.trove_members(user_id) on delete cascade,
 seed_key text,
 name text not null check (length(trim(name)) between 1 and 150),
 location text not null check (length(trim(location)) between 1 and 300),
 cuisine text not null default '' check (length(cuisine) <= 80),
 tags text[] not null default '{}' check (cardinality(tags) <= 20 and array_position(tags,null) is null),
 note text not null default '' check (length(note) <= 3000),
 source_url text not null default '' check (length(source_url) <= 2048 and (source_url = '' or source_url ~* '^https://')),
 status text not null default 'want' check (status in ('want','been')),
 recognition text,
 verified_on date,
 created_at timestamptz not null default now(),
 unique(owner_id,seed_key), unique(id,owner_id)
);
create index trove_places_owner_created on public.trove_places(owner_id,created_at desc);
alter table public.trove_places enable row level security;
create policy owner_places on public.trove_places for all to authenticated
 using (owner_id=(select auth.uid()) and exists(select 1 from public.trove_members where user_id=(select auth.uid())))
 with check (owner_id=(select auth.uid()) and exists(select 1 from public.trove_members where user_id=(select auth.uid())));

create table public.trove_reviews (
 place_id uuid primary key,
 owner_id uuid not null,
 text text not null default '' check (length(text) <= 3000),
 food integer check (food between 1 and 5),
 ambiance integer check (ambiance between 1 and 5),
 service integer check (service between 1 and 5),
 vibe integer check (vibe between 1 and 5),
 check (num_nonnulls(food,ambiance,service,vibe)>0),
 foreign key(place_id,owner_id) references public.trove_places(id,owner_id) on delete cascade
);
alter table public.trove_reviews enable row level security;
create policy owner_reviews on public.trove_reviews for all to authenticated
 using (owner_id=(select auth.uid()) and exists(select 1 from public.trove_members where user_id=(select auth.uid())))
 with check (owner_id=(select auth.uid()) and exists(select 1 from public.trove_members where user_id=(select auth.uid())));
grant select,insert,update,delete on public.trove_places,public.trove_reviews to authenticated;
revoke all on public.trove_places,public.trove_reviews from anon;

create function public.trove_validate_tags() returns trigger language plpgsql set search_path = '' as $$
begin
 if exists(select 1 from unnest(new.tags) t where length(trim(t)) not between 1 and 30) then
 raise exception 'Tags must contain 1 to 30 characters' using errcode='23514';
 end if;
 return new;
end $$;
create trigger trove_tags_check before insert or update on public.trove_places for each row execute function public.trove_validate_tags();

-- SECURITY INVOKER: caller's RLS policies govern every statement; transaction is atomic.
create function public.trove_publish_review(p_place_id uuid,p_text text,p_food integer,p_ambiance integer,p_service integer,p_vibe integer)
returns void language plpgsql security invoker set search_path = '' as $$
begin
 update public.trove_places set status='been' where id=p_place_id and owner_id=auth.uid();
 if not found then raise exception 'Place not found or access denied' using errcode='42501'; end if;
 insert into public.trove_reviews(place_id,owner_id,text,food,ambiance,service,vibe)
 values(p_place_id,auth.uid(),p_text,p_food,p_ambiance,p_service,p_vibe)
 on conflict(place_id) do update set text=excluded.text,food=excluded.food,ambiance=excluded.ambiance,service=excluded.service,vibe=excluded.vibe;
end $$;
revoke all on function public.trove_publish_review(uuid,text,integer,integer,integer,integer) from public,anon;
grant execute on function public.trove_publish_review(uuid,text,integer,integer,integer,integer) to authenticated;
