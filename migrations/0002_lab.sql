-- Hodgeform Lab: per-user Orbita research tenant.

create table if not exists labs (
  user_id    text primary key,
  name       text not null,
  slug       text not null,
  charter    text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists lab_policy (
  user_id                                     text primary key references labs(user_id) on delete cascade,
  require_hash_bound_approval                 boolean not null default true,
  prohibit_architecture_review_from_evidence  boolean not null default true,
  require_held_out_prediction                 boolean not null default true,
  no_activation                               boolean not null default true,
  updated_at                                  timestamptz not null default now()
);

create table if not exists cases (
  id           text primary key,
  user_id      text not null references labs(user_id) on delete cascade,
  name         text not null,
  goal         text not null default '',
  domain_hint  text,
  status       text not null default 'created',
  plan_json    text,
  plan_hash    text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists cases_user_id_idx on cases (user_id);
create index if not exists cases_user_status_idx on cases (user_id, status);

create table if not exists operators (
  id             text primary key,
  user_id        text not null references labs(user_id) on delete cascade,
  operator_key   text not null,
  name           text not null,
  description    text not null default '',
  status         text not null default 'review_needed',
  contract_json  text not null,
  contract_hash  text not null,
  review_hash    text not null,
  source_case_id text,
  created_at     timestamptz not null default now()
);
create unique index if not exists operators_user_key_idx on operators (user_id, operator_key);
create index if not exists operators_user_id_idx on operators (user_id);

create table if not exists evidence_receipts (
  id                  text primary key,
  user_id             text not null references labs(user_id) on delete cascade,
  schema_id           text not null default 'orbita-evidence-receipt/1',
  source_kind         text not null,
  case_id             text,
  operator_id         text,
  experiment_id       text,
  domain              text not null,
  outcome             text not null,
  independence_level  text not null,
  body_json           text not null,
  receipt_hash        text not null,
  eligibility_json    text not null,
  created_at          timestamptz not null default now()
);
create index if not exists evidence_user_id_idx on evidence_receipts (user_id);

create table if not exists experiments (
  id                            text primary key,
  user_id                       text not null references labs(user_id) on delete cascade,
  case_id                       text not null,
  scientific_question           text not null,
  claim_scope_json              text not null,
  execution_spec_json           text not null,
  verdict_schema_json           text not null,
  independent_verifier_json     text not null,
  falsification_coverage_json   text not null,
  anti_rescue_rules_json        text not null,
  experiment_hash               text not null,
  manifest_json                 text,
  manifest_hash                 text,
  status                        text not null default 'draft',
  created_by                    text not null,
  created_at                    timestamptz not null default now()
);
create index if not exists experiments_user_id_idx on experiments (user_id);

create table if not exists experiment_approvals (
  id                        text primary key,
  user_id                   text not null references labs(user_id) on delete cascade,
  experiment_id             text not null,
  expected_experiment_hash  text not null,
  expected_manifest_hash    text not null,
  reviewer                  text not null,
  rationale                 text not null,
  confirmation              text not null,
  accepted                  boolean not null,
  created_at                timestamptz not null default now()
);
create index if not exists experiment_approvals_user_idx on experiment_approvals (user_id);

create table if not exists problem_loops (
  id                         text primary key,
  user_id                    text not null references labs(user_id) on delete cascade,
  goal                       text not null,
  success_criteria_json      text not null,
  allowed_capabilities_json  text not null,
  max_cycles                 integer not null default 3,
  state                      text not null default 'GOAL',
  cycle                      integer not null default 0,
  previous_event_hash        text not null default 'genesis',
  created_by                 text not null,
  created_at                 timestamptz not null default now()
);
create index if not exists problem_loops_user_id_idx on problem_loops (user_id);

create table if not exists problem_loop_events (
  id                    text primary key,
  user_id               text not null references labs(user_id) on delete cascade,
  loop_id               text not null,
  state                 text not null,
  next_state            text not null,
  artifact_json         text not null,
  artifact_hash         text not null,
  event_hash            text not null,
  previous_event_hash   text not null,
  actor                 text not null,
  created_at            timestamptz not null default now()
);
create index if not exists problem_loop_events_loop_idx on problem_loop_events (loop_id, created_at);

create table if not exists claims (
  id                text primary key,
  user_id           text not null references labs(user_id) on delete cascade,
  case_id           text,
  claim_key         text not null,
  statement         text not null,
  epistemic_status  text not null,
  scope_json        text not null,
  superseded_by     text,
  created_at        timestamptz not null default now()
);
create index if not exists claims_user_id_idx on claims (user_id);

create table if not exists contradictions (
  id         text primary key,
  user_id    text not null references labs(user_id) on delete cascade,
  claim_a    text not null,
  claim_b    text not null,
  rationale  text not null,
  created_at timestamptz not null default now()
);
create index if not exists contradictions_user_id_idx on contradictions (user_id);

create table if not exists tournaments (
  id              text primary key,
  user_id         text not null references labs(user_id) on delete cascade,
  name            text not null,
  target_json     text not null,
  status          text not null default 'draft',
  manifest_hash   text not null,
  anti_rescue     boolean not null default true,
  created_at      timestamptz not null default now()
);
create index if not exists tournaments_user_id_idx on tournaments (user_id);
