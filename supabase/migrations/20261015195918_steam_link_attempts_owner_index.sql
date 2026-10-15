set lock_timeout = '5s';

-- Cover the composite Passport ownership foreign key without changing existing indexes.
create index if not exists steam_link_attempts_passport_owner_idx
  on private.steam_link_attempts (passport_id, owner_id);
