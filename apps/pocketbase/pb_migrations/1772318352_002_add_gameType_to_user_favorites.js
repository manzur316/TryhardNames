/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("user_favorites");

  const existing = collection.fields.getByName("gameType");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("gameType"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "gameType"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("user_favorites");
  collection.fields.removeByName("gameType");
  return app.save(collection);
})