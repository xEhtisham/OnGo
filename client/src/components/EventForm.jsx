import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { Card, CardTitle, CardDescription } from './Card';

const CATEGORIES = [
  'Music',
  'Sports',
  'Food & Drink',
  'Arts & Culture',
  'Business',
  'Education',
  'Technology',
  'Other',
];

export default function EventForm({ initialData = null, onSubmit, isEditing = false }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category: initialData?.category || 'Music',
    description: initialData?.description || '',
    coverImage: initialData?.coverImage || '',
    date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
    startTime: initialData?.startTime || '18:00',
    endTime: initialData?.endTime || '22:00',
    venueName: initialData?.venueName || '',
    streetAddress: initialData?.streetAddress || '',
    city: initialData?.city || '',
    bookingStatus: initialData?.bookingStatus || 'Open',
    maxTicketsPerBooking: initialData?.maxTicketsPerBooking || 5,
    ticketTypes: initialData?.ticketTypes?.length
      ? initialData.ticketTypes.map((t) => ({
          _id: t._id,
          name: t.name,
          price: t.price,
          capacity: t.capacity,
        }))
      : [{ name: 'General Admission', price: 1500, capacity: 200 }],
  });

  const [imageError, setImageError] = useState('');
  const [formError, setFormError] = useState('');
  const [submittingStatus, setSubmittingStatus] = useState(null); // 'Draft' or 'Published'

  // Calculate total capacity across all ticket types
  const totalCapacity = formData.ticketTypes.reduce(
    (sum, t) => sum + (Number(t.capacity) || 0),
    0
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  // Image upload handling with 5MB validation
  const handleImageFileChange = (e) => {
    setImageError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image file exceeds the 5MB size limit. Please choose a smaller file.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, coverImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, coverImage: '' }));
    setImageError('');
  };

  // Ticket type manipulation
  const handleTicketChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.ticketTypes];
      updated[index] = {
        ...updated[index],
        [field]: field === 'name' ? value : Number(value) >= 0 ? Number(value) : 0,
      };
      return { ...prev, ticketTypes: updated };
    });
  };

  const handleAddTicketType = () => {
    setFormData((prev) => ({
      ...prev,
      ticketTypes: [
        ...prev.ticketTypes,
        { name: '', price: 0, capacity: 50 },
      ],
    }));
  };

  const handleRemoveTicketType = (index) => {
    if (formData.ticketTypes.length <= 1) {
      setFormError('At least one ticket type is required.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (targetStatus) => {
    setFormError('');

    // Validations
    if (!formData.title.trim()) {
      setFormError('Event title is required.');
      return;
    }
    if (!formData.description.trim()) {
      setFormError('Event description is required.');
      return;
    }
    if (!formData.coverImage) {
      setFormError('A cover image is required for the event.');
      return;
    }
    if (!formData.date) {
      setFormError('Event date is required.');
      return;
    }
    if (!formData.startTime || !formData.endTime) {
      setFormError('Both start time and end time are required.');
      return;
    }
    if (!formData.venueName.trim() || !formData.streetAddress.trim() || !formData.city.trim()) {
      setFormError('Full venue name, street address, and city are required.');
      return;
    }
    if (formData.ticketTypes.some((t) => !t.name.trim() || t.capacity < 1)) {
      setFormError('Each ticket type must have a valid name and capacity of at least 1.');
      return;
    }

    try {
      setSubmittingStatus(targetStatus);
      await onSubmit({
        ...formData,
        status: targetStatus,
      });
    } catch (err) {
      setFormError(err.message || 'Failed to save event. Please check details and try again.');
    } finally {
      setSubmittingStatus(null);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {formError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-error text-sm font-medium flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{formError}</span>
        </div>
      )}

      {/* 1. Event Information */}
      <Card className="border-border">
        <CardTitle className="text-xl">1. Event Information</CardTitle>
        <CardDescription className="mb-6">
          Provide the foundational details about your event.
        </CardDescription>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text uppercase tracking-wider mb-1.5">
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Islamabad Indie Fest 2026"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text uppercase tracking-wider mb-1.5">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="e.g. Islamabad, Lahore, Karachi"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text uppercase tracking-wider mb-1.5">
              Description *
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the experience, schedule, highlights, and attendee guidelines..."
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      </Card>

      {/* 2. Event Cover Image */}
      <Card className="border-border">
        <CardTitle className="text-xl">2. Event Cover Image</CardTitle>
        <CardDescription className="mb-6">
          High-resolution poster image (Recommended: 1200 × 630px, Max: 5MB).
        </CardDescription>

        {formData.coverImage ? (
          <div className="space-y-4">
            <div className="relative aspect-[16/9] w-full max-h-72 rounded-xl overflow-hidden border border-border bg-slate-100">
              <img
                src={formData.coverImage}
                alt="Event cover preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer">
                <span className="inline-flex items-center justify-center font-semibold rounded-xl text-xs px-3.5 py-2 border border-border bg-white hover:bg-slate-50 text-text transition-colors">
                  Replace Image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>
              <Button variant="ghost" size="sm" onClick={handleRemoveImage}>
                Remove Image
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100/70 transition-colors">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm font-bold text-text">Upload Event Poster</p>
              <p className="text-xs text-muted mt-1">PNG, JPG, or WEBP up to 5MB</p>
              <label className="mt-4 inline-block cursor-pointer">
                <span className="inline-flex items-center justify-center font-semibold rounded-xl text-xs px-4 py-2 bg-primary text-white hover:bg-primary-dark transition-colors shadow-sm">
                  Browse Files
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Optional Image URL Input */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs text-muted">Or image URL:</span>
              <input
                type="url"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleInputChange}
                placeholder="https://example.com/poster.jpg"
                className="flex-1 px-3 py-1.5 rounded-lg border border-border text-xs bg-white text-text placeholder:text-slate-400"
              />
            </div>
          </div>
        )}

        {imageError && (
          <p className="text-xs font-semibold text-error mt-2">{imageError}</p>
        )}
      </Card>

      {/* 3. Date & Time */}
      <Card className="border-border">
        <CardTitle className="text-xl">3. Date & Time</CardTitle>
        <CardDescription className="mb-6">Specify schedule and event duration.</CardDescription>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-text uppercase tracking-wider mb-1.5">
              Event Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text uppercase tracking-wider mb-1.5">
              Start Time *
            </label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text uppercase tracking-wider mb-1.5">
              End Time *
            </label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>
      </Card>

      {/* 4. Location Details */}
      <Card className="border-border">
        <CardTitle className="text-xl">4. Location</CardTitle>
        <CardDescription className="mb-6">
          Physical venue and navigation instructions.
        </CardDescription>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text uppercase tracking-wider mb-1.5">
              Venue Name *
            </label>
            <input
              type="text"
              name="venueName"
              value={formData.venueName}
              onChange={handleInputChange}
              placeholder="e.g. Pak-China Friendship Centre"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text uppercase tracking-wider mb-1.5">
              Street Address *
            </label>
            <input
              type="text"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleInputChange}
              placeholder="e.g. Garden Avenue, Shakarparian"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      </Card>

      {/* 5. Tickets & Capacity */}
      <Card className="border-border">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div>
            <CardTitle className="text-xl">5. Ticket Tiers & Capacity</CardTitle>
            <CardDescription>
              Configure ticket types, pricing in PKR, and availability.
            </CardDescription>
          </div>

          {/* Total Capacity Counter Badge */}
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-border text-xs font-bold text-text flex items-center gap-2">
            <span className="text-muted">Total Capacity:</span>
            <span className="text-primary font-extrabold text-sm">{totalCapacity}</span>
            <span className="text-muted font-normal">tickets</span>
          </div>
        </div>

        <div className="space-y-3">
          {formData.ticketTypes.map((ticket, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-border bg-slate-50/50 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
            >
              <div className="sm:col-span-5">
                <label className="block text-xs font-bold text-text uppercase tracking-wider mb-1">
                  Ticket Name *
                </label>
                <input
                  type="text"
                  value={ticket.name}
                  onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
                  placeholder="e.g. General Admission, VIP"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-white text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-text uppercase tracking-wider mb-1">
                  Price (PKR) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={ticket.price}
                  onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-white text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-text uppercase tracking-wider mb-1">
                  Quantity Available *
                </label>
                <input
                  type="number"
                  min="1"
                  value={ticket.capacity}
                  onChange={(e) => handleTicketChange(index, 'capacity', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-white text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="sm:col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleRemoveTicketType(index)}
                  disabled={formData.ticketTypes.length <= 1}
                  className="p-2 rounded-lg text-muted hover:text-error hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  title="Remove ticket type"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={handleAddTicketType}
            className="w-full mt-2"
          >
            + Add Another Ticket Type
          </Button>
        </div>
      </Card>

      {/* 6. Event Settings */}
      <Card className="border-border">
        <CardTitle className="text-xl">6. Event Settings</CardTitle>
        <CardDescription className="mb-6">
          Configure booking controls and limits.
        </CardDescription>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-text uppercase tracking-wider mb-1.5">
              Booking Status
            </label>
            <select
              name="bookingStatus"
              value={formData.bookingStatus}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="Open">Open for Bookings</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-text uppercase tracking-wider mb-1.5">
              Max Tickets Per Booking
            </label>
            <input
              type="number"
              min="1"
              max="20"
              name="maxTicketsPerBooking"
              value={formData.maxTicketsPerBooking}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>
      </Card>

      {/* Actions Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
        <Button
          variant="ghost"
          size="md"
          onClick={() => navigate('/organizer/events')}
          disabled={!!submittingStatus}
        >
          Cancel
        </Button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="md"
            onClick={() => handleSubmit('Draft')}
            disabled={!!submittingStatus}
            className="flex-1 sm:flex-initial"
          >
            {submittingStatus === 'Draft' ? 'Saving Draft...' : 'Save Draft'}
          </Button>
          <Button
            variant="cta"
            size="md"
            onClick={() => handleSubmit('Published')}
            disabled={!!submittingStatus}
            className="flex-1 sm:flex-initial"
          >
            {submittingStatus === 'Published'
              ? isEditing
                ? 'Updating...'
                : 'Publishing...'
              : isEditing
              ? 'Update & Publish'
              : 'Publish Event'}
          </Button>
        </div>
      </div>
    </div>
  );
}
