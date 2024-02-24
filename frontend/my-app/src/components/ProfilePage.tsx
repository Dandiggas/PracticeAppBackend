import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PracticeChart from './PracticeChart';
import PracticeSessionForm from './PracticeSessionForm';
import { PracticeSession } from './PracticeSessionForm'



interface Session {
  session_id: number;
  user: number; 
  instrument: string;
  duration: string;
  description: string;
  session_date: string;
}

const ProfilePage = () => {
  const [username, setUsername] = useState('');  
  const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch user details
        const userResponse = await axios.get('http://localhost:8000/api/v1/current-user/', {
          headers: { 'Authorization': `Token ${token}` }
        });
        setUsername(userResponse.data.username);


        const sessionResponse = await axios.get('http://localhost:8000/api/v1/', {
          headers: { 'Authorization': `Token ${token}` }
        });
        setSessions(sessionResponse.data);
      } catch (error) {
        console.error('Error fetching data', error);
        setError('Error fetching data');
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-10">Welcome, {username}!</h1>
      <h2 className="text-2xl font-bold my-5">Your Sessions</h2>
      {/* <PracticeChart sessions={sessions} /> */}
      <table className="min-w-full">
        <thead>
          <tr>
            <th>Session ID</th>
            <th>Instrument</th>
            <th>Duration</th>
            <th>Description</th>
            <th>Session Date</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(session => (
            <tr key={session.session_id}>
              <td>{session.session_id}</td>
              <td>{session.instrument}</td>
              <td>{session.duration}</td>
              <td>{session.description}</td>
              <td>{session.session_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <PracticeSessionForm 
        setPracticeSessions={setPracticeSessions} 
        // Optionally, include practiceSessionData if editing an existing session
      />
    </div>
  );
};

export default ProfilePage;
