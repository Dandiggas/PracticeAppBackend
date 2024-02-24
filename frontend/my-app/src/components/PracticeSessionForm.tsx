import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';

export interface PracticeSession {
  session_id?: number;
  user?: number; // This will be fetched from the backend and included in the state
  instrument: string;
  duration: string;
  description: string;
  session_date: string;
}

interface PracticeSessionFormProps {
  practiceSessionData?: PracticeSession; // Optional for new sessions
  setPracticeSessions: React.Dispatch<React.SetStateAction<PracticeSession[]>>;
}

const PracticeSessionForm: React.FC<PracticeSessionFormProps> = ({ practiceSessionData, setPracticeSessions }) => {
  const [formData, setFormData] = useState<PracticeSession>({
    instrument: practiceSessionData?.instrument || '',
    duration: practiceSessionData?.duration || '',
    description: practiceSessionData?.description || '',
    session_date: practiceSessionData?.session_date || '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Fetch the current user's details when the component mounts
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:8000/api/v1/current-user/', {
            headers: { Authorization: `Token ${token}` }
          });
          setFormData(currentFormData => ({
            ...currentFormData,
            user: response.data.id // Set the user ID in the form data
          }));
        } catch (error) {
          setError('Failed to fetch user details');
        }
      }
    };

    fetchUserDetails();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prevent form from submitting if the user ID is not set
    if (!formData.user) {
      setError('User ID is not set. Unable to create session.');
      return;
    }

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Token ${token}` };
    const apiUrl = 'http://localhost:8000/api/v1/';
    const url = practiceSessionData ? `${apiUrl}${practiceSessionData.session_id}/` : apiUrl;

    try {
      const method = practiceSessionData ? 'put' : 'post';
      const response = await axios({ method, url, data: formData, headers });

      setPracticeSessions(prev => practiceSessionData
        ? prev.map(s => s.session_id === practiceSessionData.session_id ? response.data : s)
        : [...prev, response.data]);
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

  const handleDelete = async () => {
    if (practiceSessionData && window.confirm('Are you sure you want to delete this practice session?')) {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Token ${token}` };
      const url = `http://localhost:8000/api/v1/${practiceSessionData.session_id}/`;

      try {
        await axios.delete(url, { headers });
        setPracticeSessions(prev => prev.filter(s => s.session_id !== practiceSessionData.session_id));
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError('Error: ' + err.response?.data?.message || err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
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
        {practiceSessionData ? 'Update Session' : 'Add Session'}
      </button>
      {practiceSessionData && (
        <button type="button" onClick={handleDelete} disabled={isSubmitting}>
          Delete Session
        </button>
      )}
      {error && <p>{error}</p>}
    </form>
  );
};

export default PracticeSessionForm;



