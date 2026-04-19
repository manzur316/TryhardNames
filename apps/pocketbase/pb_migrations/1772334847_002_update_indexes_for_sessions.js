/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("sessions");
  collection.indexes.push("CREATE UNIQUE INDEX idx_sessions_sessionId ON sessions (sessionId)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("sessions");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_sessions_sessionId"));
  return app.save(collection);
})