import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventForm from '../../components/EventForm';
import api from '../../services/api';

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        const response = await api.getEventById(id);
        if (response?.data?.event) {
          setEvent(response.data.event);
        } else {
          setFetchError('Event data could not be loaded.');
        }
      } catch (err) {
        setFetchError(err.message || 'Failed to load event details.');
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [id]);

  const handleUpdate = async (eventData) => {
    await api.updateEvent(id, eventData);
    navigate('/organizer/events');
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !event) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-error">
          <h2 className="text-lg font-bold">Unable to load event</h2>
          <p className="text-sm mt-1">{fetchError || 'Event not found.'}</p>
          <button
            onClick={() => navigate('/organizer/events')}
            className="mt-4 px-4 py-2 rounded-xl bg-white border border-red-200 text-text text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            Back to My Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-text tracking-tight">Edit Event</h1>
        <p className="mt-1 text-sm text-muted">
          Modify event schedule, pricing, capacity, and publication settings.
        </p>
      </div>

      <EventForm initialData={event} onSubmit={handleUpdate} isEditing={true} />
    </div>
  );
}
