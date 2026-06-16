import { defaultHook, OpenAPIHono } from "@workspace/open-api"
import {
  createSubCategoryRoute,
  deleteManySubCategoryRoute,
  deleteSubCategoryRoute,
  deleteTrashedSubCategoryRoute,
  getSubCategoriesRoute,
  getSubCategoryRoute,
  restoreSubCategoryRoute,
  trashSubCategoryRoute,
  updateSubCategoryRoute,
} from "./sub-categories-route"
import {
  createSubCategoryHandler,
  deleteManySubCategoryHandler,
  deleteSubCategoryHandler,
  deleteTrashedSubCategoryHandler,
  getSubCategoriesHandler,
  getSubCategoryHandler,
  restoreSubCategoryHandler,
  trashSubCategoryHandler,
  updateSubCategoryHandler,
} from "./sub-categories-handler"

const app = new OpenAPIHono({
  defaultHook,
})

app
  .openapi(createSubCategoryRoute, createSubCategoryHandler)
  .openapi(updateSubCategoryRoute, updateSubCategoryHandler)
  .openapi(getSubCategoriesRoute, getSubCategoriesHandler)
  .openapi(getSubCategoryRoute, getSubCategoryHandler)
  .openapi(trashSubCategoryRoute, trashSubCategoryHandler)
  .openapi(restoreSubCategoryRoute, restoreSubCategoryHandler)
  .openapi(deleteSubCategoryRoute, deleteSubCategoryHandler)
  .openapi(deleteManySubCategoryRoute, deleteManySubCategoryHandler)
  .openapi(deleteTrashedSubCategoryRoute, deleteTrashedSubCategoryHandler)

export default app
