import { useNavigate } from 'react-router-dom';
import EventForm from '../../components/EventForm';
import api from '../../services/api';

export default function CreateEvent() {
  const navigate = useNavigate();

  const handleCreate = async (eventData) => {
    await api.createEvent(eventData);
    navigate('/organizer/events');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-text tracking-tight">Create New Event</h1>
        <p className="mt-1 text-sm text-muted">
          Fill in the details below to set up your event schedule, venue, and ticket tiers.
        </p>
      </div>

      <EventForm onSubmit={handleCreate} isEditing={false} />
    </div>
  );
}
