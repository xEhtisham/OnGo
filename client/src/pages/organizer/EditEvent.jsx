import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-on-surface-variant">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !event) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="p-8 rounded-2xl bg-surface-container-lowest border border-error/30 text-on-surface shadow-sm space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-error-container/40 text-error flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">error</span>
          </div>
          <h2 className="text-lg font-bold text-on-surface">Unable to load event</h2>
          <p className="text-sm text-on-surface-variant">{fetchError || 'Event not found.'}</p>
          <button
            onClick={() => navigate('/organizer/events')}
            className="mt-2 px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-sm font-semibold transition-colors"
          >
            Back to My Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb & Title Bar */}
      <div className="space-y-2">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
          <Link to="/organizer" className="hover:text-primary transition-colors">
            Organizer
          </Link>
          <span className="text-outline">/</span>
          <Link to="/organizer/events" className="hover:text-primary transition-colors">
            My Events
          </Link>
          <span className="text-outline">/</span>
          <span className="text-on-surface font-semibold truncate max-w-[200px]">
            {event.title}
          </span>
        </nav>
        <h1 className="font-headline-lg text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
          Edit Event
        </h1>
        <p className="font-body-md text-sm sm:text-base text-on-surface-variant">
          Modify event schedule, pricing, capacity, and publication settings.
        </p>
      </div>

      <EventForm initialData={event} onSubmit={handleUpdate} isEditing={true} />
    </div>
  );
}
