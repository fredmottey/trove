begin;
create extension if not exists pgtap with schema extensions;
select plan(9);
insert into auth.users(id,email) values
 ('10000000-0000-0000-0000-000000000001','a@example.test'),
 ('10000000-0000-0000-0000-000000000002','b@example.test'),
 ('10000000-0000-0000-0000-000000000003','nonmember@example.test');
insert into public.trove_members(user_id) values ('10000000-0000-0000-0000-000000000001'),('10000000-0000-0000-0000-000000000002');
insert into public.trove_places(id,owner_id,name,location) values ('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Private place','DC');
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000002',true);
select is((select count(*)::int from public.trove_places),0,'Other member cannot read places');
select throws_ok($$insert into public.trove_places(owner_id,name,location) values('10000000-0000-0000-0000-000000000001','Forged','DC')$$,'42501',null,'Cannot forge owner');
select throws_ok($$select public.trove_publish_review('20000000-0000-0000-0000-000000000001','Forged',5,null,null,null)$$,'42501',null,'Cannot review another owner place');
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
select is((select count(*)::int from public.trove_places),1,'Owner can read');
select throws_ok($$select public.trove_publish_review('20000000-0000-0000-0000-000000000001','Invalid',6,null,null,null)$$,'23514',null,'Reject invalid rating');
select lives_ok($$select public.trove_publish_review('20000000-0000-0000-0000-000000000001','Good',5,null,null,null)$$,'Owner can publish');
select is((select status from public.trove_places limit 1),'been','Publishing marks Been');
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);
select is((select count(*)::int from public.trove_places),0,'Nonmember cannot read');
set local role anon;
select throws_ok($$select * from public.trove_places$$,'42501',null,'Anonymous has no private data access');
select * from finish();
rollback;
