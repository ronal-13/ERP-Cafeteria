import React, { useState } from 'react';
import { usePromotions } from '../../hooks/usePromotions';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { Tag } from 'lucide-react';

const PromotionsSection = ({ showTitle = true }) => {
  const { promos } = usePromotions();
  const [selected, setSelected] = useState(null);

  return (
    <div>
      {showTitle && (
        <div className="title-wrap" style={{ marginTop: 8, marginBottom: 8 }}>
          <span className="kpi-icon"><Tag size={18} /></span>
          <h2 className="section-title">Promociones</h2>
        </div>
      )}
      <div className="grid-3" style={{ marginBottom: 12 }}>
        {promos.map(pr => (
          <div key={pr.id} className="card" style={{ padding: 16 }}>
            <div className="section-title title-accent" style={{ marginBottom: 8 }}>{pr.titulo}</div>
            <div className="stat-label" style={{ marginBottom: 8 }}>{pr.descripcion}</div>
            <div className="row-12" style={{ justifyContent: 'space-between' }}>
              <span className="stat-label">{pr.categoria || 'General'}</span>
              <Button variant="secondary" size="small" onClick={() => setSelected(pr)}>Ver detalle</Button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected ? selected.titulo : ''}>
        {selected && (
          <div style={{ display: 'grid', gap: 12 }}>
            <div className="section-title title-dark" style={{ margin: 0 }}>{selected.categoria || 'General'}</div>
            <p className="stat-label">{selected.descripcion}</p>
            <Button variant="primary" onClick={() => setSelected(null)}>Cerrar</Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PromotionsSection;
