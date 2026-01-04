
import { Person } from '../types';
import { useState, useEffect, FormEvent } from 'react';
import './CreatePersonModal.css';

interface CreatePersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (person: Omit<Person, 'personID'>, id?: number) => void;
  initialPerson?: Person | null;
}

const CreatePersonModal: React.FC<CreatePersonModalProps> = ({ isOpen, onClose, onSave, initialPerson }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contact, setContact] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (initialPerson) {
      setFirstName(initialPerson.firstName);
      setLastName(initialPerson.lastName);
      setContact(initialPerson.contact);
    } else {
      setFirstName('');
      setLastName('');
      setContact('');
    }
    setFormError(null);
  }, [initialPerson, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!firstName.trim() || !lastName.trim() || !contact.trim()) {
      setFormError('All fields are required');
      return;
    }
    onSave({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      contact: contact.trim(),
    }, initialPerson?.personID);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialPerson ? 'Edit Person' : 'Add Person'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>
        </div>
        {formError && <div className="error-message">{formError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="person-firstName">First Name <span className="required">*</span></label>
            <input
              id="person-firstName"
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="Enter first name"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="person-lastName">Last Name <span className="required">*</span></label>
            <input
              id="person-lastName"
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Enter last name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="person-contact">Contact <span className="required">*</span></label>
            <input
              id="person-contact"
              type="text"
              value={contact}
              onChange={e => setContact(e.target.value)}
              placeholder="Enter contact number"
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{initialPerson ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePersonModal;
