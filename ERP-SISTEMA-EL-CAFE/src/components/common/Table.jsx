import React from 'react';
import Button from './Button';
import { Pencil, Trash2 } from 'lucide-react';

const Table = ({ 
  columns = [], 
  data = [], 
  onRowClick,
  onEdit,
  onDelete,
  renderActions,
  emptyMessage = 'No hay datos disponibles',
  className = ''
}) => {
  return (
    <div className={["table-container", className].join(" ")}> 
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.title}</th>
            ))}
            {(onEdit || onDelete || renderActions) && (
              <th>Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (onEdit || onDelete || renderActions ? 1 : 0)} style={{ textAlign: 'center', color: '#6b7280', padding: 16 }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                {(onEdit || onDelete || renderActions) && (
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {renderActions && renderActions(row)}
                      {onEdit && (
                        <Button
                          variant="secondary"
                          size="small"
                          onlyIcon
                          title="Editar"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(row);
                          }}
                          icon={<Pencil size={16} />}
                        />
                      )}
                      {onDelete && (
                        <Button
                          variant="danger"
                          size="small"
                          onlyIcon
                          title="Eliminar"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(row);
                          }}
                          icon={<Trash2 size={16} />}
                        />
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
