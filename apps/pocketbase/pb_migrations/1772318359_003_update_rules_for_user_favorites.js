/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("user_favorites");
  collection.listRule = "";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("user_favorites");
  collection.listRule = "userId = @request.auth.id";
  return app.save(collection);
})