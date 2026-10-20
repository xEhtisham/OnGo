import { useNavigate, Link } from 'react-router-dom';
import EventForm from '../../components/EventForm';
import api from '../../services/api';

export default function CreateEvent() {
  const navigate = useNavigate();

  const handleCreate = async (eventData) => {
    await api.createEvent(eventData);
    navigate('/organizer/events');
  };

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
          <span className="text-on-surface font-semibold">Create Event</span>
        </nav>
        <h1 className="font-headline-lg text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
          Create Event
        </h1>
        <p className="font-body-md text-sm sm:text-base text-on-surface-variant">
          Add the details attendees need to discover, explore, and book your event.
        </p>
      </div>

      <EventForm onSubmit={handleCreate} isEditing={false} />
    </div>
  );
}
