/* eslint-disable security/detect-object-injection */
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { isNotEmpty, isObject } from "./utils/is.js";
import xor from "./utils/xor.js";
import type { Transformer } from "integreat";

export interface Props extends Record<string, unknown> {
  delimiter?: string;
  quoted?: boolean;
  headerRow?: boolean;
  columnPrefix?: string;
  direction?: "to" | "from";
}

const createStringifyOptions = ({
  delimiter = ",",
  quoted = true,
  headerRow = false,
}: Props) => ({
  delimiter,
  quoted,
  header: headerRow,
  cast: { boolean: String },
});

const createParseOptions = ({ delimiter = "," }: Props) => ({
  delimiter,
  skip_empty_lines: true,
  trim: true,
  relax_column_count: true,
});

const extractColNo = (key: string) =>
  key.startsWith("col") ? Number.parseInt(key.slice(3)) : undefined;

const isNumber = (num: unknown): num is number =>
  typeof num === "number" && !Number.isNaN(num);

const sortFields = ([keyA]: [string, unknown], [keyB]: [string, unknown]) => {
  const noA = extractColNo(keyA);
  const noB = extractColNo(keyB);
  return isNumber(noA) && isNumber(noB)
    ? noA - noB
    : Number(isNumber(noB)) - Number(isNumber(noA));
};

const expandValueArray = (key: string, value: unknown) =>
  Array.isArray(value)
    ? value.reduce(
        (obj, val, index) => ({ ...obj, [`${key}-${index + 1}`]: val }),
        {},
      )
    : { [key]: value };

const reorderFields = <T = unknown>(
  item: Record<string, T>,
): Record<string, T> =>
  Object.entries(item)
    .sort(sortFields)
    .reduce(
      (object, [key, value]) => ({
        ...object,
        ...expandValueArray(key, value),
      }),
      {},
    );

const extractColumns = (
  rows: Record<string, unknown>[],
): Record<string, string> =>
  rows.reduce<Record<string, string>>(
    (fields, row) =>
      Object.keys(row).reduce(
        (fields, field) => ({ ...fields, [field]: field }),
        fields,
      ),
    {},
  );

const extractFields = (row: unknown) =>
  isObject(row) ? reorderFields(row) : undefined;

const createColumnKey = (index: number, headers: string[], prefix: string) =>
  headers[index] || `${prefix}${index + 1}`;

const normalizeLine =
  (columnPrefix = "col", headers: string[] = []) =>
  (fields: string[]) =>
    fields.reduce(
      (item, value, index) => ({
        ...item,
        [createColumnKey(index, headers, columnPrefix)]: value,
      }),
      {},
    );

const normalizeColumns = (cols: string[]) =>
  cols.map((col) => col.replace(/[\s.]+/g, "-"));

function normalize(data: unknown, props: Props) {
  if (typeof data !== "string") {
    return undefined;
  }
  let rows;
  try {
    rows = parse(data, createParseOptions(props)) as string[][];
  } catch {
    return undefined;
  }
  if (props.headerRow) {
    const headers = normalizeColumns(rows[0]);
    return rows.slice(1).map(normalizeLine(props.columnPrefix, headers));
  } else {
    return rows.map(normalizeLine(props.columnPrefix));
  }
}

function serialize(data: unknown, props: Props) {
  if (!Array.isArray(data)) {
    return undefined;
  }
  const rows = data.map(extractFields).filter(isNotEmpty);
  const columns = reorderFields(extractColumns(rows));
  return stringify(rows, { ...createStringifyOptions(props), columns });
}

const transformer: Transformer = function csv(props: Props) {
  return () => (data, state) => {
    const isRev = xor(state.rev, state.flip);
    return xor(isRev, props.direction === "from")
      ? serialize(data, props)
      : normalize(data, props);
  };
};

export default transformer;
