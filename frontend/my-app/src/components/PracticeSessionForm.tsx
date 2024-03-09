import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import PracticeChart from './PracticeChart';

export interface PracticeSession {
  session_id?: number;
  display_id?: number;
  user?: number;
  instrument: string;
  duration: string;
  description: string;
  session_date: string;
}

interface PracticeSessionFormProps {
  practiceSessionData?: PracticeSession;
  setPracticeSessions: React.Dispatch<React.SetStateAction<PracticeSession[]>>;
}

const PracticeSessionForm: React.FC<PracticeSessionFormProps> = ({ practiceSessionData, setPracticeSessions }) => {
  const [formData, setFormData] = useState<PracticeSession>({
    instrument: practiceSessionData?.instrument || '',
    duration: practiceSessionData?.duration || '',
    description: practiceSessionData?.description || '',
    session_date: practiceSessionData?.session_date || '',
  });
  
  const [allSessions, setAllSessions] = useState<PracticeSession[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedSessionIdForDeletion, setSelectedSessionIdForDeletion] = useState<number | ''>('');
  const [selectedSessionIdForUpdate, setSelectedSessionIdForUpdate] = useState<number | ''>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchSessions();
    fetchUserDetails();
  }, []); // Empty dependency array to run the effect only once

  const fetchSessions = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/', {
          headers: { Authorization: `Token ${token}` }
        });
        setAllSessions(response.data);
      } catch (error) {
        setError('Failed to fetch sessions');
      }
    }
  };

  const fetchUserDetails = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/current-user/', {
          headers: { Authorization: `Token ${token}` }
        });
        setFormData(currentFormData => ({
          ...currentFormData,
          user: response.data.id
        }));
      } catch (error) {
        setError('Failed to fetch user details');
      }
    }
  };

  const handleSessionSelectForUpdate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sessionId = Number(e.target.value);
    setSelectedSessionIdForUpdate(sessionId);
    if (sessionId === 0) {
      setFormData({
        instrument: '',
        duration: '',
        description: '',
        session_date: '',
      });
    } else {
      const selectedSession = allSessions.find(session => session.session_id === sessionId);
      if (selectedSession) {
        setFormData(selectedSession);
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.user) {
      setError('User ID is not set. Unable to create session.');
      return;
    }

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Token ${token}` };
    const apiUrl = 'http://localhost:8000/api/v1/';
    const url = selectedSessionIdForUpdate ? `${apiUrl}${selectedSessionIdForUpdate}/` : apiUrl;

    try {
      const method = selectedSessionIdForUpdate ? 'put' : 'post';
      const response = await axios({ method, url, data: formData, headers });

      setPracticeSessions(prev => selectedSessionIdForUpdate
        ? prev.map(s => s.session_id === selectedSessionIdForUpdate ? response.data : s)
        : [...prev, response.data]);
      
      setAllSessions(prev => selectedSessionIdForUpdate
        ? prev.map(s => s.session_id === selectedSessionIdForUpdate ? response.data : s)
        : [...prev, response.data]);
      
      setFormData({
        instrument: '',
        duration: '',
        description: '',
        session_date: '',
      });
      setSelectedSessionIdForUpdate('');
      window.location.reload();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError('Error: ' + err.response?.data?.message || err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSessionChangeForDeletion = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSessionIdForDeletion(Number(e.target.value));
  };

  const handleSessionDeletion = async () => {
    if (!selectedSessionIdForDeletion) {
      setError('No session selected for deletion.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this session?')) {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Token ${token}` };
      try {
        await axios.delete(`http://localhost:8000/api/v1/${selectedSessionIdForDeletion}/`, { headers });
        setAllSessions(prev => prev.filter(s => s.session_id !== selectedSessionIdForDeletion));
        setPracticeSessions(prev => prev.filter(s => s.session_id !== selectedSessionIdForDeletion));
        setSelectedSessionIdForDeletion('');
        window.location.reload();
      } catch (error) {
        setError('Failed to delete the session');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div>
      <select value={selectedSessionIdForUpdate} onChange={handleSessionSelectForUpdate}>
        <option value="0">Create New Session</option>
        {allSessions.map((session, index) => {
    const displayNumber = index + 1;
    return (
      <option key={session.session_id} value={session.session_id}>
        Session {displayNumber} - {session.instrument}
      </option>
    );
  })}
      </select>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="instrument"
          value={formData.instrument}
          onChange={handleChange}
          placeholder="Instrument"
        />
        <input
          type="text"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          placeholder="Duration"
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <input
          type="date"
          name="session_date"
          value={formData.session_date}
          onChange={handleChange}
        />
        <button type="submit" disabled={isSubmitting}>
          {selectedSessionIdForUpdate ? 'Update Session' : 'Add Session'}
        </button>
      </form>
      <select value={selectedSessionIdForDeletion} onChange={handleSessionChangeForDeletion} disabled={isSubmitting}>
        <option value="">Select a session to delete</option>
        {allSessions.map((session, index) => {
    const displayNumber = index + 1;
    return (
      <option key={session.session_id} value={session.session_id}>
        Session {displayNumber} - {session.instrument}
      </option>
    );
  })}
      </select>
      <button onClick={handleSessionDeletion} disabled={!selectedSessionIdForDeletion || isSubmitting}>
        Delete Selected Session
      </button>
      {error && <p>{error}</p>}

    </div>
  );
};

export default PracticeSessionForm;