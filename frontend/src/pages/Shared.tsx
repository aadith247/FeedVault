import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Backendurl } from '../Backendurl';
import { Card } from '../Components/Card';
import { Title } from '../Components/ui/Title';

export function Shared() {
  const { shareLink } = useParams();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchShared() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          Backendurl + '/api/v1/brain/' + shareLink
        );
        if (response.data.data) {
          setNotes(response.data.data);
        } else {
          setError(response.data.message || 'No shared notes found.');
        }
      } catch (err: any) {
        setError('Failed to load shared notes.');
      } finally {
        setLoading(false);
      }
    }
    fetchShared();
  }, [shareLink]);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center p-8">
      <Title text="Shared Notes" size="md" bold="yes" color="slate" />
      {loading && <div className="mt-8">Loading...</div>}
      {error && <div className="mt-8 text-red-500">{error}</div>}
      <div className="grid grid-cols-3 gap-6 mt-8">
        {notes.map(({ title, link, type }, index) => (
          <Card key={index} type={type} title={title} link={link} />
        ))}
      </div>
    </div>
  );
} 