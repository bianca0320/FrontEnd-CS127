
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Entry, Person, Group, Payment, PaymentAllocation } from '../types';
import { personMockService } from '../services/personMockService';
import { groupMockService } from '../services/groupMockService';
import { entryMockService } from '../services/entryMockService';
import { paymentMockService } from '../services/paymentMockService';
import CreateEntryModal from '../components/CreateEntryModal';
import CreatePaymentModal from '../components/CreatePaymentModal';
import CreatePaymentAllocationModal from '../components/CreatePaymentAllocationModal';
import './EntryDetails.css';



function EntryDetails() {
  // Ref to the modal form for edit
  const entryModalFormRef = useRef<HTMLFormElement | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  // Payment Allocation (for group entries)
  const [showAllocModal, setShowAllocModal] = useState(false);
  const [editingAlloc, setEditingAlloc] = useState<PaymentAllocation | null>(null);
  const [allocLoading, setAllocLoading] = useState(false);

  useEffect(() => {
    if (id) {
      entryMockService.getById(id).then(e => setEntry(e ?? null));
      paymentMockService.getByEntryId(id).then(setPayments);
    }
    personMockService.getAll().then(setPeople);
    groupMockService.getAll().then(setGroups);
  }, [id]);

  // Payment handlers
  const handleAddPayment = () => {
    setEditingPayment(null);
    setShowPaymentModal(true);
  };

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment);
    setShowPaymentModal(true);
  };

  const handleDeletePayment = async (paymentId: string) => {
    if (!window.confirm('Are you sure you want to delete this payment?')) return;
    setPaymentLoading(true);
    setModalError(null);
    try {
      await paymentMockService.delete(paymentId);
      if (id) setPayments(await paymentMockService.getByEntryId(id));
      setModalSuccess('Payment deleted successfully!');
      setTimeout(() => setModalSuccess(null), 1500);
    } catch (err) {
      setModalError('Failed to delete payment');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleSavePayment = async (payment: Omit<Payment, 'id' | 'entryId' | 'createdAt' | 'updatedAt'>, pid?: string) => {
    setModalError(null);
    setPaymentLoading(true);
    try {
      if (pid) {
        await paymentMockService.update(pid, payment);
        setModalSuccess('Payment updated successfully!');
      } else {
        if (id) await paymentMockService.create({ ...payment, entryId: id });
        setModalSuccess('Payment added successfully!');
      }
      if (id) {
        setPayments(await paymentMockService.getByEntryId(id));
        // Refresh entry to get updated amountRemaining and status
        const updatedEntry = await entryMockService.getById(id);
        setEntry(updatedEntry ?? null);
      }
      setShowPaymentModal(false);
      setTimeout(() => setModalSuccess(null), 1500);
    } catch (err) {
      setModalError('Failed to save payment');
    } finally {
      setPaymentLoading(false);
    }
  };

  // Payment Allocation handlers (simulate in-memory)
  const handleAddAlloc = () => {
    setEditingAlloc(null);
    setShowAllocModal(true);
  };
  const handleEditAlloc = (alloc: PaymentAllocation) => {
    setEditingAlloc(alloc);
    setShowAllocModal(true);
  };
  const handleDeleteAlloc = async (allocId: string) => {
    if (!window.confirm('Are you sure you want to delete this allocation?')) return;
    setAllocLoading(true);
    setModalError(null);
    try {
      if (entry && entry.paymentAllocations) {
        const updatedEntry = {
          ...entry,
          paymentAllocations: entry.paymentAllocations.filter(a => a.id !== allocId),
        };
        setEntry(updatedEntry ?? null);
        setModalSuccess('Allocation deleted successfully!');
        setTimeout(() => setModalSuccess(null), 1500);
      }
    } catch (err) {
      setModalError('Failed to delete allocation');
    } finally {
      setAllocLoading(false);
    }
  };
  const handleSaveAlloc: (
    allocation: Omit<PaymentAllocation, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string
  ) => void = async (alloc, allocId) => {
    setModalError(null);
    setAllocLoading(true);
    try {
      if (entry) {
        let updatedAllocations: PaymentAllocation[] = entry.paymentAllocations ? [...entry.paymentAllocations] : [];
        if (allocId) {
          // Edit
          updatedAllocations = updatedAllocations.map(a => a.id === allocId ? { ...a, ...alloc, id: allocId } : a);
          setModalSuccess('Allocation updated successfully!');
        } else {
          // Add
          const now = new Date();
          updatedAllocations.push({ ...alloc, id: Date.now().toString(), createdAt: now, updatedAt: now });
          setModalSuccess('Allocation added successfully!');
        }
        setEntry({ ...entry, paymentAllocations: updatedAllocations });
        setShowAllocModal(false);
        setTimeout(() => setModalSuccess(null), 1500);
      }
    } catch (err) {
      setModalError('Failed to save allocation');
    } finally {
      setAllocLoading(false);
    }
  };

  if (!entry) {
    return (
      <div className="entry-details">
        <p>Loading entry...</p>
      </div>
    );
  }

  const handleEdit = () => {
    setModalError(null);
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    setDeleteLoading(true);
    setModalError(null);
    try {
      await entryMockService.delete(entry.id);
      setModalSuccess('Entry deleted successfully!');
      setTimeout(() => navigate('/'), 1000);
    } catch (err: any) {
      setModalError('Failed to delete entry');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSaveEdit = async (updated: Omit<Entry, 'id' | 'referenceId' | 'createdAt' | 'updatedAt'>) => {
    setModalError(null);
    try {
      await entryMockService.update(entry.id, updated);
      const updatedEntry = await entryMockService.getById(entry.id);
      setEntry(updatedEntry ?? null);
      setShowEditModal(false);
      setModalSuccess('Entry updated successfully!');
      setTimeout(() => setModalSuccess(null), 1500);
    } catch (err: any) {
      setModalError('Failed to update entry');
    }
  };

  return (
    <div className="entry-details">
      <div className="page-header">
        <h1>Entry Details</h1>
        <div className="header-actions">
          {!showEditModal && (
            <>
              <button className="btn-secondary" onClick={handleEdit}>Edit</button>
              <button className="btn-danger" onClick={handleDelete} disabled={deleteLoading}>Delete</button>
            </>
          )}
          {showEditModal && (
            <>
              <button
                className="btn-primary"
                onClick={() => {
                  if (entryModalFormRef.current) {
                    entryModalFormRef.current.requestSubmit();
                  }
                }}
              >
                Confirm
              </button>
              <button className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
            </>
          )}
        </div>
      </div>
      {modalError && <div className="error-message">{modalError}</div>}
      {modalSuccess && <div className="success-message">{modalSuccess}</div>}
      {showEditModal && (
        <CreateEntryModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
          initialEntry={entry}
          people={people}
          groups={groups}
          onGroupsUpdated={async () => setGroups(await groupMockService.getAll())}
          key={entry?.id || 'edit-modal'}
          formRef={entryModalFormRef}
        />
      )}

      {/* Entry Details Section */}
      <section className="details-section">
        <h2>Entry Information</h2>
        <div className="details-grid">
          <div className="detail-item">
            <label>Entry Name:</label>
            <span>{entry.entryName}</span>
          </div>
          <div className="detail-item">
            <label>Transaction Type:</label>
            <span>{entry.transactionType}</span>
          </div>
          <div className="detail-item">
            <label>Borrower:</label>
            <span>
              {typeof entry.borrower === 'object' && 'groupName' in entry.borrower
                ? entry.borrower.groupName
                : typeof entry.borrower === 'object' && 'firstName' in entry.borrower
                  ? `${entry.borrower.firstName} ${entry.borrower.lastName}`
                  : entry.borrower}
            </span>
          </div>
          <div className="detail-item">
            <label>Lender:</label>
            <span>{entry.lender}</span>
          </div>
          <div className="detail-item">
            <label>Amount Borrowed:</label>
            <span>₱{entry.amountBorrowed.toLocaleString()}</span>
          </div>
          <div className="detail-item">
            <label>Amount Remaining:</label>
            <span>₱{entry.amountRemaining.toLocaleString()}</span>
          </div>
          <div className="detail-item">
            <label>Status:</label>
            <span className={`status-badge status-${entry.status.toLowerCase()}`}>
              {entry.status}
            </span>
          </div>
        </div>
      </section>

      {/* Payment Details Section */}
      <section className="details-section">
        <div className="section-header">
          <h2>Payment Details</h2>
          <button className="btn-primary" onClick={handleAddPayment}>+ Add Payment</button>
        </div>
        {payments && payments.length > 0 ? (
          <table className="payments-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Payee</th>
                <th>Amount</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id}>
                  <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                  <td>{payment.payee.firstName} {payment.payee.lastName}</td>
                  <td>₱{payment.paymentAmount.toLocaleString()}</td>
                  <td>{payment.notes}</td>
                  <td>
                    <button className="btn-secondary" onClick={() => handleEditPayment(payment)}>Edit</button>
                    <button className="btn-danger" onClick={() => handleDeletePayment(payment.id)} disabled={paymentLoading}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No payments recorded yet.</p>
        )}
        {showPaymentModal && (
          <CreatePaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            onSave={handleSavePayment}
            initialPayment={editingPayment}
            people={(() => {
              if (!entry) return people;
              if (
                typeof entry.borrower === 'object' &&
                'personID' in entry.borrower &&
                typeof (entry.borrower as any).personID === 'number'
              ) {
                // Single person borrower
                return people.filter(p => p.personID === (entry.borrower as Person).personID);
              } else if (
                typeof entry.borrower === 'object' &&
                'groupID' in entry.borrower &&
                (entry.borrower as any).members
              ) {
                // Group borrower with members
                return (entry.borrower as any).members;
              }
              return people;
            })()}
            entryId={entry.id}
          />
        )}
      </section>

      {/* Installment Details Section - Only if transaction type is Installment */}
      {entry.transactionType === 'Installment Expense' && entry.installmentDetails && (
        <section className="details-section">
          <h2>Installment Details</h2>
          {/* TODO: Display installment details */}
        </section>
      )}

      {/* Payment Allocation Section - Only if borrower is a Group */}
      {typeof entry.borrower === 'object' && 'members' in entry.borrower && (
        <section className="details-section">
          <div className="section-header">
            <h2>Payment Allocation</h2>
            <button className="btn-primary" onClick={handleAddAlloc}>+ Add Allocation</button>
          </div>
          {entry.paymentAllocations && entry.paymentAllocations.length > 0 ? (
            <table className="alloc-table">
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Amount</th>
                  <th>Percent</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entry.paymentAllocations.map(alloc => (
                  <tr key={alloc.id}>
                    <td>{alloc.payee.firstName} {alloc.payee.lastName}</td>
                    <td>₱{alloc.amount.toLocaleString()}</td>
                    <td>{alloc.percentageOfTotal}%</td>
                    <td>{alloc.description}</td>
                    <td>
                      <button className="btn-secondary" onClick={() => handleEditAlloc(alloc)}>Edit</button>
                      <button className="btn-danger" onClick={() => handleDeleteAlloc(alloc.id)} disabled={allocLoading}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No allocations yet.</p>
          )}
          {showAllocModal && (
            <CreatePaymentAllocationModal
              isOpen={showAllocModal}
              onClose={() => setShowAllocModal(false)}
              onSave={handleSaveAlloc}
              initialAllocation={editingAlloc}
              people={people}
              entryId={entry.id}
            />
          )}
        </section>
      )}
    </div>
  )
}

export default EntryDetails

