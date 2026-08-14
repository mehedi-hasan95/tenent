import { sortValues } from "@workspace/validators/types/constants.types"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs"
export const params = {
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  minPrice: parseAsInteger.withOptions({ clearOnDefault: true }),
  maxPrice: parseAsInteger.withOptions({ clearOnDefault: true }),
  cats: parseAsArrayOf(parseAsString)
    .withDefault([])
    .withOptions({ clearOnDefault: true }),
  sort: parseAsStringLiteral(sortValues).withDefault(sortValues[0]),
}

export const useProductFilters = () => {
  return useQueryStates(params)
}
