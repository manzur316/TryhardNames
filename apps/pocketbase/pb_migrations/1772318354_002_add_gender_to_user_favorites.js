/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("user_favorites");

  const existing = collection.fields.getByName("gender");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("gender"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "gender"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("user_favorites");
  collection.fields.removeByName("gender");
  return app.save(collection);
})