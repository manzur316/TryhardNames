-- Internal helpers stay outside PostgREST and resolve built-ins deterministically.
alter function private.set_updated_at() set search_path = '';
alter function private.is_canonical_gaming_passport_slug(text) set search_path = '';
