import type { ReactNode } from "react";

export type DataTableColumn<T> = {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
};

export function DataTable<T>({ columns, getRowKey, rows }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-100 text-left text-xs font-semibold uppercase tracking-normal text-slate-600">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} scope="col" className="px-4 py-3">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((row) => (
              <tr key={getRowKey(row)} className="hover:bg-slate-50">
                {columns.map((column) => {
                  const value = row[column.key];

                  return (
                    <td key={String(column.key)} className="px-4 py-3 text-slate-700">
                      {column.render ? column.render(value, row) : String(value)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
