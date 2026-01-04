import React, { useState, useEffect } from 'react';
import { Person } from '../types';
import { personMockService } from '../services/personMockService';
import CreatePersonModal from '../components/CreatePersonModal';
import './PeopleList.css';

const PeopleList: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  // Load people on mount
  useEffect(() => {
    personMockService.getAll().then(setPeople);
  }, []);

  const handleAdd = () => {
    setEditingPerson(null);
    setModalOpen(true);
  };

  const handleEdit = (person: Person) => {
    setEditingPerson(person);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await personMockService.delete(id);
    setPeople(await personMockService.getAll());
  };

  const handleSave = async (data: Omit<Person, 'personID'>, id?: number) => {
    if (id !== undefined) {
      await personMockService.update(id.toString(), data);
    } else {
      await personMockService.create(data);
    }
    setPeople(await personMockService.getAll());
    setModalOpen(false);
  };

  return (
    <div className="people-list-container">
      <h1>People</h1>
      <button onClick={handleAdd}>Add Person</button>
      <ul className="people-list">
        {people.map(person => (
          <li key={person.personID} className="person-item">
            <span>{person.firstName} {person.lastName}</span>
            <button onClick={() => handleEdit(person)}>Edit</button>
            <button onClick={() => handleDelete(person.personID.toString())}>Delete</button>
          </li>
        ))}
      </ul>
      <CreatePersonModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialPerson={editingPerson}
      />
    </div>
  );
};

export default PeopleList;
