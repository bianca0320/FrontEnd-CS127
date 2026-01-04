# Next Step Guide - What to Do Now

## 🎯 Your Next Step: Build Create Person Modal

**START HERE** - This is the simplest feature and will get you moving quickly!

---

## Why Start with Create Person Modal?

1. ✅ **Simplest to implement** - Only 3 fields (Name, Initials, Notes)
2. ✅ **Needed for other features** - You need people before creating entries/groups
3. ✅ **Quick win** - Builds confidence and tests your API connection
4. ✅ **Foundation** - Patterns you learn here apply to other modals

---

## What You Need to Build

### 1. Create `CreatePersonModal.tsx` Component

**Location:** `src/components/CreatePersonModal.tsx`

**What it needs:**
- Modal overlay/dialog
- Form with fields:
  - Name (required, text input)
  - Initials (optional, text input - can auto-generate)
  - Notes (optional, textarea)
- Submit button
- Close button
- Uses `addPerson()` from `useApp()` hook

### 2. Update `PeopleAndGroups.tsx`

**What to add:**
- State to control modal visibility
- Connect "Add Person" button to open modal
- Import and render `CreatePersonModal`

---

## Step-by-Step Implementation

### Step 1: Create the Modal Component

```typescript
// src/components/CreatePersonModal.tsx
import { useState, FormEvent } from 'react'
import { useApp } from '../context/AppContext'
import { generateInitials } from '../utils/uuid'
import './CreatePersonModal.css'

interface CreatePersonModalProps {
  isOpen: boolean
  onClose: () => void
}

function CreatePersonModal({ isOpen, onClose }: CreatePersonModalProps) {
  const { addPerson, loading } = useApp()
  const [name, setName] = useState('')
  const [initials, setInitials] = useState('')
  const [notes, setNotes] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    try {
      await addPerson({
        name,
        initials: initials || generateInitials(name),
        notes: notes || undefined,
      })
      // Reset form and close modal
      setName('')
      setInitials('')
      setNotes('')
      onClose()
    } catch (error) {
      // Error is handled in context
      console.error('Failed to create person:', error)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Person</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                // Auto-generate initials when name changes
                if (!initials) {
                  setInitials(generateInitials(e.target.value))
                }
              }}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="initials">Initials</label>
            <input
              id="initials"
              type="text"
              value={initials}
              onChange={(e) => setInitials(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" disabled={loading || !name}>
              {loading ? 'Creating...' : 'Create Person'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePersonModal
```

### Step 2: Add Basic CSS

```css
/* src/components/CreatePersonModal.css */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #1a1a1a;
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  border: 1px solid #333;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 2rem;
  height: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #333;
  border-radius: 4px;
  background-color: #242424;
  color: white;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.modal-actions button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.modal-actions button[type="submit"] {
  background-color: #646cff;
  color: white;
}

.modal-actions button[type="button"] {
  background-color: #333;
  color: white;
}

.modal-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Step 3: Update PeopleAndGroups.tsx

```typescript
// Add at the top
import { useState } from 'react'
import CreatePersonModal from '../components/CreatePersonModal'

// Inside component, add state:
const [showCreatePersonModal, setShowCreatePersonModal] = useState(false)

// Update the button:
<button 
  className="btn-primary"
  onClick={() => setShowCreatePersonModal(true)}
>
  + Add Person
</button>

// Add modal at the end:
{showCreatePersonModal && (
  <CreatePersonModal
    isOpen={showCreatePersonModal}
    onClose={() => setShowCreatePersonModal(false)}
  />
)}
```

---

## After You Complete This

### Next Steps (In Order):

1. ✅ **Create Person Modal** (YOU ARE HERE)
2. **Create Group Modal** (similar pattern)
3. **Delete Person with Confirmation** (simple, builds on person)
4. **Create Entry Modal** (more complex, but you'll have the pattern)
5. **Payment List & Add Payment Modal**
6. **Edit Modals** (reuse create modals with pre-filled data)

---

## Testing Your Modal

1. **Start your Spring Boot backend**
2. **Start React:** `npm run dev`
3. **Navigate to People & Groups page**
4. **Click "Add Person" button**
5. **Fill form and submit**
6. **Check:**
   - Modal opens/closes correctly
   - Form submits
   - Person appears in list
   - Check browser DevTools → Network tab to see HTTP POST request
   - Check backend logs to confirm data saved

---

## Quick Checklist

- [ ] Create `CreatePersonModal.tsx`
- [ ] Create `CreatePersonModal.css`
- [ ] Update `PeopleAndGroups.tsx` to use modal
- [ ] Test creating a person
- [ ] Verify person appears in list
- [ ] Check HTTP request in browser DevTools

---

## Estimated Time

**30-45 minutes** for a basic working version

---

**Once you complete this, you'll have:**
- ✅ A working create feature
- ✅ Understanding of modal pattern
- ✅ Experience with form handling
- ✅ API integration working
- ✅ Confidence to build more features!

**Start coding now!** 🚀

