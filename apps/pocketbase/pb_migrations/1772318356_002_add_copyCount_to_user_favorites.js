/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("user_favorites");

  const existing = collection.fields.getByName("copyCount");
  if (existing) {
    if (existing.type === "number") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("copyCount"); // exists with wrong type, remove first
  }

  collection.fields.add(new NumberField({
    name: "copyCount"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("user_favorites");
  collection.fields.removeByName("copyCount");
  return app.save(collection);
})