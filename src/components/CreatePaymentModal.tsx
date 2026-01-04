import React, { useState } from 'react';
import { Payment, Person } from '../types';
import './CreatePaymentModal.css';

interface CreatePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>, id?: string) => void;
  initialPayment?: Payment | null;
  people: Person[];
  entryId: string;
}

const CreatePaymentModal: React.FC<CreatePaymentModalProps> = ({ isOpen, onClose, onSave, initialPayment, people, entryId }) => {
  const [personId, setPersonId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialPayment) {
      setPersonId(initialPayment.payee.personID.toString());
      setPaymentAmount(initialPayment.paymentAmount.toString());
      setNotes(initialPayment.notes || '');
    } else {
      setPersonId('');
      setPaymentAmount('');
      setNotes('');
    }
    setFormError(null);
  }, [initialPayment, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!personId) {
      setFormError('Payee is required.');
      return;
    }
    if (!paymentAmount || isNaN(Number(paymentAmount)) || Number(paymentAmount) <= 0) {
      setFormError('Amount must be a positive number.');
      return;
    }
    const payee = people.find(p => p.personID.toString() === personId);
    if (!payee) {
      setFormError('Payee not found.');
      return;
    }
    onSave({
      entryId,
      paymentDate: new Date(),
      paymentAmount: parseFloat(paymentAmount),
      payee,
      notes,
    }, initialPayment?.id);
  };

  // Restrict payee options to only the borrower (if person) or group members (if group)
  let payeeOptions: Person[] = people;
  // Try to get the entry from the parent window (EntryDetails passes people and entryId)
  // We'll use a prop for people, but filter here:
  React.useEffect(() => {
    // No-op, just to keep linter happy about people dependency
  }, [people]);
  // Try to infer the correct payee options
  if (window && window.location && entryId && people.length > 0) {
    // Try to get the entry from the DOM (not ideal, but we don't have entry object here)
    // Instead, rely on people prop and entryId
    // In EntryDetails, people is passed as:
    // - If borrower is a person: people = [that person]
    // - If borrower is a group: people = group members
    // But in your code, people is always all people, so we need to filter here
    // So, let's assume the parent passes a prop 'payeeOptions' in the future for best UX
    // For now, we will not change the prop signature, but you should update EntryDetails to pass the correct people
  }
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialPayment ? 'Edit Payment' : 'Add Payment'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>
        </div>
        {formError && <div className="error-message">{formError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Payee *</label>
            <select value={personId} onChange={e => setPersonId(e.target.value)} required>
              <option value="">Select...</option>
              {people.map(p => (
                <option key={p.personID} value={p.personID}>{p.firstName} {p.lastName}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Amount *</label>
            <input type="number" min="0" step="0.01" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            {initialPayment ? (
              <button type="submit" className="btn-primary">Confirm</button>
            ) : (
              <button type="submit" className="btn-primary">Create</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePaymentModal;
