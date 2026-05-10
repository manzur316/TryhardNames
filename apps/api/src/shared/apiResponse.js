export function ok(data = {}) {
  return {
    ok: true,
    ...data,
  };
}

export function fail(error, data = {}) {
  return {
    ok: false,
    error,
    ...data,
  };
}
