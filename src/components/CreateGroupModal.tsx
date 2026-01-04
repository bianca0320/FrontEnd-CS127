import React, { useState, useEffect } from 'react';
import { Group } from '../types';
import './CreateGroupModal.css';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (group: Omit<Group, 'groupID'>, id?: number) => void;
  initialGroup?: Group | null;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, onSave, initialGroup }) => {
  const [groupName, setGroupName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (initialGroup) {
      setGroupName(initialGroup.groupName);
    } else {
      setGroupName('');
    }
    setFormError(null);
  }, [initialGroup, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!groupName.trim()) {
      setFormError('Group name is required');
      return;
    }
    onSave({ groupName: groupName.trim() }, initialGroup?.groupID);
  };



  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialGroup ? 'Edit Group' : 'Create Group'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>
        </div>
        {formError && <div className="error-message">{formError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="group-groupName">Group Name <span className="required">*</span></label>
            <input
              id="group-groupName"
              type="text"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{initialGroup ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
