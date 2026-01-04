import React, { useState } from 'react';
import { PaymentAllocation, Person } from '../types';
import './CreatePaymentAllocationModal.css';

interface CreatePaymentAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (allocation: Omit<PaymentAllocation, 'id' | 'createdAt' | 'updatedAt'>, id?: string) => void;
  initialAllocation?: PaymentAllocation | null;
  people: Person[];
  entryId: string;
}

const CreatePaymentAllocationModal: React.FC<CreatePaymentAllocationModalProps> = ({ isOpen, onClose, onSave, initialAllocation, people, entryId }) => {
  const [personId, setPersonId] = useState('');
  const [amount, setAmount] = useState('');
  const [percent, setPercent] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialAllocation) {
      setPersonId(initialAllocation.payee.personID.toString());
      setAmount(initialAllocation.amount.toString());
      setPercent(initialAllocation.percentageOfTotal.toString());
      setDescription(initialAllocation.description || '');
    } else {
      setPersonId('');
      setAmount('');
      setPercent('');
      setDescription('');
    }
    setFormError(null);
  }, [initialAllocation, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!personId) {
      setFormError('Person is required.');
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setFormError('Amount must be a positive number.');
      return;
    }
    if (!percent || isNaN(Number(percent)) || Number(percent) < 0 || Number(percent) > 100) {
      setFormError('Percent must be between 0 and 100.');
      return;
    }
    const payee = people.find(p => p.personID.toString() === personId);
    if (!payee) {
      setFormError('Person not found.');
      return;
    }
    onSave({
      entryId,
      payee,
      amount: parseFloat(amount),
      percentageOfTotal: parseFloat(percent),
      description,
      status: 'UNPAID' as any,
    }, initialAllocation?.id);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialAllocation ? 'Edit Allocation' : 'Add Allocation'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>
        </div>
        {formError && <div className="error-message">{formError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Person *</label>
            <select value={personId} onChange={e => setPersonId(e.target.value)} required>
              <option value="">Select...</option>
              {people.map(p => (
                <option key={p.personID} value={p.personID}>{p.firstName} {p.lastName}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Amount *</label>
            <input type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Percent *</label>
            <input type="number" min="0" max="100" step="0.01" value={percent} onChange={e => setPercent(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{initialAllocation ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePaymentAllocationModal;
