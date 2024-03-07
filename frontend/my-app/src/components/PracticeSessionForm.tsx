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
  
  const [allSessions, setAllSessions] = useState<PracticeSession[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedSessionIdForDeletion, setSelectedSessionIdForDeletion] = useState<number | ''>('');
  const [error, setError] = useState<string>('');
  const [sessions, setSessions] = React.useState<PracticeSession[]>([]);



React.useEffect(() => {
  fetchSessions();
}, []);

const fetchSessions = async () => {

  const token = localStorage.getItem('token')
  if (token){
    try {
      const response = await axios.get('http://localhost:8000/api/v1/', {
        headers: { Authorization: `Token ${token}` }
      });
      setSessions(response.data);
    } catch (error){
      setError('Failed to fetch sessions');
    }
  }

  ;
};

const handleSessionSelect = (session: PracticeSession) => {

  setFormData(session);
};


  useEffect(() => {

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

    fetchSessions();
  }, []);


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
      window.location.reload(); 

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
        window.location.reload(); 
      } catch (error) {
        setError('Failed to delete the session');
        setIsSubmitting(false);
      }
    }
  };
  // Function to handle changes in the form fields
 

  

  return (
  <div>    
    <ul>
  {sessions.map(session => (
    <li key={session.session_id} onClick={() => handleSessionSelect(session)}>
      {session.instrument}
    </li>
  ))}
</ul>
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

    </form>
    <select value={selectedSessionIdForDeletion} onChange={handleSessionChangeForDeletion} disabled={isSubmitting}>
        <option value="">Select a session to delete</option>
        {allSessions.map(session => (
          <option key={session.session_id} value={session.session_id}>
            Session ID: {session.session_id} - {session.instrument}
          </option>
        ))}
      </select>
      <button onClick={handleSessionDeletion} disabled={!selectedSessionIdForDeletion || isSubmitting}>
        Delete Selected Session
      </button>
  
        {error && <p>{error}</p>}
    </div>
    
  );
};

export default PracticeSessionForm;



