import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
      : [
          { name: 'General Admission', price: 1500, capacity: 150 },
          { name: 'VIP Front Row & Lounge', price: 3500, capacity: 50 },
        ],
  });

  const [imageError, setImageError] = useState('');
  const [formError, setFormError] = useState('');
  const [submittingStatus, setSubmittingStatus] = useState(null); // 'Draft' or 'Published'
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Total capacity calculation across tiers
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
  const processImageFile = (file) => {
    setImageError('');
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

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

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    processImageFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processImageFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, coverImage: '' }));
    setImageError('');
  };

  // Ticket tier manipulation
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

    // Field Validations
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

  const isEndTimeValid = formData.startTime && formData.endTime && formData.endTime > formData.startTime;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant/40 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider">
            {isEditing ? 'Editing Event' : 'New Event Studio'}
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Fill in the details below. You can save as a draft or publish right away.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => handleSubmit('Draft')}
            disabled={!!submittingStatus}
            className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            <span>{submittingStatus === 'Draft' ? 'Saving...' : 'Save Draft'}</span>
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('Published')}
            disabled={!!submittingStatus}
            className="px-5 py-2.5 rounded-xl bg-secondary-container hover:brightness-105 active:scale-[0.99] text-on-secondary font-label-md text-label-md font-bold shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isEditing ? 'update' : 'rocket_launch'}
            </span>
            <span>
              {submittingStatus === 'Published'
                ? isEditing
                  ? 'Updating...'
                  : 'Publishing...'
                : isEditing
                ? 'Update & Publish'
                : 'Publish Event'}
            </span>
          </button>
        </div>
      </div>

      {formError && (
        <div className="p-4 rounded-xl bg-error-container/40 border border-error/30 text-on-error-container text-sm font-medium flex items-center gap-3 animate-fadeIn">
          <span className="material-symbols-outlined text-error text-[22px] shrink-0">error</span>
          <span>{formError}</span>
        </div>
      )}

      {/* Section 1: Event Information */}
      <section className="bg-surface-container-lowest rounded-2xl p-5 sm:p-7 border border-outline-variant/40 shadow-xs space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-label-md text-label-md font-bold">
              1
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
              Event Information
            </h2>
          </div>
          <p className="text-on-surface-variant font-body-md text-body-md pl-9">
            Provide the primary details attendees will see in search and event listings.
          </p>
        </div>

        <div className="space-y-4 pt-1">
          {/* Event Title */}
          <div className="space-y-1.5">
            <label className="block font-label-md text-label-md text-on-surface" htmlFor="event-title">
              Event Title <span className="text-error">*</span>
            </label>
            <input
              id="event-title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Winter Acoustic & Indie Night 2026"
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/60 bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-1.5">
              <label className="block font-label-md text-label-md text-on-surface" htmlFor="event-category">
                Category <span className="text-error">*</span>
              </label>
              <div className="relative">
                <select
                  id="event-category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl border border-outline-variant/60 bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[20px]">
                  expand_more
                </span>
              </div>
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <label className="block font-label-md text-label-md text-on-surface" htmlFor="city">
                City <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                  location_city
                </span>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g. Islamabad, Lahore, Karachi"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant/60 bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block font-label-md text-label-md text-on-surface" htmlFor="event-description">
              Description <span className="text-error">*</span>
            </label>
            <textarea
              id="event-description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Join us for an unforgettable live experience. Describe the performers, schedule, highlight moments, and entry guidelines..."
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/60 bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all resize-y"
            />
            <p className="font-caption-xs text-caption-xs text-on-surface-variant">
              This is the main description attendees will see on your event discovery page.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Event Image */}
      <section className="bg-surface-container-lowest rounded-2xl p-5 sm:p-7 border border-outline-variant/40 shadow-xs space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-label-md text-label-md font-bold">
              2
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
              Event Image
            </h2>
          </div>
          <p className="text-on-surface-variant font-body-md text-body-md pl-9">
            Upload a clear, high-resolution poster. Recommended size: 1200 × 630px (16:9 ratio, max 5MB).
          </p>
        </div>

        <div className="space-y-4 pt-1">
          {formData.coverImage ? (
            <div className="bg-surface-container-low p-4 sm:p-5 rounded-2xl border border-outline-variant/40 flex flex-col md:flex-row items-center gap-4 sm:gap-6">
              <div className="relative w-full md:w-56 h-36 rounded-xl overflow-hidden shrink-0 shadow-sm bg-surface-container">
                <img
                  src={formData.coverImage}
                  alt="Event cover preview"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-inverse-surface/85 text-inverse-on-surface font-caption-xs text-caption-xs px-2.5 py-0.5 rounded-full backdrop-blur-xs font-semibold">
                  Cover
                </span>
              </div>
              <div className="flex-1 w-full space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-title-md text-title-md text-on-surface font-bold truncate max-w-[240px]">
                    {formData.title ? `${formData.title.slice(0, 30)}_cover.jpg` : 'event_cover.jpg'}
                  </span>
                  <span className="font-caption-xs text-caption-xs text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold">
                    Uploaded
                  </span>
                </div>
                <p className="font-caption-xs text-caption-xs text-on-surface-variant">
                  High Resolution • 16:9 Panoramic Ratio • Ready to publish
                </p>
                <div className="flex items-center gap-2.5 pt-2">
                  <label className="cursor-pointer">
                    <span className="px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">cached</span>
                      <span>Replace Image</span>
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-3.5 py-1.5 rounded-lg text-error hover:bg-error-container/20 font-label-sm text-label-sm transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`p-8 sm:p-10 rounded-2xl border-2 border-dashed text-center space-y-3 transition-colors cursor-pointer ${
                isDragging
                  ? 'border-primary bg-primary-fixed/20'
                  : 'border-outline-variant/60 bg-surface-container-low/50 hover:bg-surface-container-low'
              }`}
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[26px]">cloud_upload</span>
              </div>
              <p className="font-label-md text-label-md text-on-surface">
                Drag and drop your poster file here, or{' '}
                <label className="text-primary hover:underline font-bold cursor-pointer inline">
                  browse from computer
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="font-caption-xs text-caption-xs text-on-surface-variant">
                Supported formats: PNG, JPG, WEBP (Max 5MB)
              </p>
            </div>
          )}

          {/* Fallback image URL toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">link</span>
              <span>{showUrlInput ? 'Hide image URL input' : 'Or paste direct image URL'}</span>
            </button>

            {showUrlInput && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="url"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleInputChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 px-3 py-2 rounded-xl border border-outline-variant/60 text-xs bg-surface-container-lowest text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/30"
                />
              </div>
            )}
          </div>

          {imageError && (
            <p className="text-xs font-semibold text-error flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {imageError}
            </p>
          )}
        </div>
      </section>

      {/* Section 3: Date & Time */}
      <section className="bg-surface-container-lowest rounded-2xl p-5 sm:p-7 border border-outline-variant/40 shadow-xs space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-label-md text-label-md font-bold">
              3
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
              Date & Time
            </h2>
          </div>
          <p className="text-on-surface-variant font-body-md text-body-md pl-9">
            Specify when your event starts and ends in local Pakistan Standard Time (PKT).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Event Date */}
          <div className="space-y-1.5">
            <label className="block font-label-md text-label-md text-on-surface" htmlFor="event-date">
              Event Date <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                calendar_today
              </span>
              <input
                id="event-date"
                name="date"
                type="date"
                required
                value={formData.date}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant/60 bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all"
              />
            </div>
          </div>

          {/* Start Time */}
          <div className="space-y-1.5">
            <label className="block font-label-md text-label-md text-on-surface" htmlFor="start-time">
              Start Time <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                schedule
              </span>
              <input
                id="start-time"
                name="startTime"
                type="time"
                required
                value={formData.startTime}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant/60 bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all"
              />
            </div>
          </div>

          {/* End Time */}
          <div className="space-y-1.5">
            <label className="block font-label-md text-label-md text-on-surface" htmlFor="end-time">
              End Time <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                schedule
              </span>
              <input
                id="end-time"
                name="endTime"
                type="time"
                required
                value={formData.endTime}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant/60 bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all"
              />
            </div>
          </div>
        </div>

        {/* Validation note */}
        {isEndTimeValid ? (
          <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-3.5 py-1.5 rounded-xl font-label-sm text-label-sm w-fit">
            <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
            <span>Valid schedule: End time is after start time</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-on-surface-variant bg-surface-container px-3.5 py-1.5 rounded-xl font-label-sm text-label-sm w-fit">
            <span className="material-symbols-outlined text-[18px]">info</span>
            <span>Local PKT schedule</span>
          </div>
        )}
      </section>

      {/* Section 4: Location */}
      <section className="bg-surface-container-lowest rounded-2xl p-5 sm:p-7 border border-outline-variant/40 shadow-xs space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-label-md text-label-md font-bold">
              4
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
              Location
            </h2>
          </div>
          <p className="text-on-surface-variant font-body-md text-body-md pl-9">
            Enter physical venue details for gate check-in and attendee navigation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Venue Name */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="block font-label-md text-label-md text-on-surface" htmlFor="venue-name">
              Venue Name <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                apartment
              </span>
              <input
                id="venue-name"
                name="venueName"
                type="text"
                required
                value={formData.venueName}
                onChange={handleInputChange}
                placeholder="e.g. Lok Virsa Amphitheatre, Pak-China Friendship Centre"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant/60 bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all"
              />
            </div>
          </div>

          {/* Street Address */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="block font-label-md text-label-md text-on-surface" htmlFor="street-address">
              Street Address <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                pin_drop
              </span>
              <input
                id="street-address"
                name="streetAddress"
                type="text"
                required
                value={formData.streetAddress}
                onChange={handleInputChange}
                placeholder="e.g. Garden Avenue, Shakarparian"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant/60 bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all"
              />
            </div>
          </div>
        </div>

        {/* Live Venue Preview Card */}
        {formData.venueName && (
          <div className="bg-surface-container-low border border-outline-variant/40 rounded-xl p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">
              place
            </span>
            <div>
              <p className="font-title-md text-title-md text-on-surface font-bold leading-tight">
                {formData.venueName}
              </p>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                {[formData.streetAddress, formData.city, 'Pakistan'].filter(Boolean).join(', ')}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Section 5: Tickets */}
      <section className="bg-surface-container-lowest rounded-2xl p-5 sm:p-7 border border-outline-variant/40 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-label-md text-label-md font-bold">
                5
              </span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
                Tickets & Tiers
              </h2>
            </div>
            <p className="text-on-surface-variant font-body-md text-body-md pl-9">
              Configure ticket tiers, pricing in PKR, and capacity limits.
            </p>
          </div>

          <div className="bg-surface-container px-3.5 py-1.5 rounded-xl flex items-center gap-2 self-start sm:self-auto">
            <span className="material-symbols-outlined text-primary text-[18px]">confirmation_number</span>
            <span className="font-label-sm text-label-sm text-on-surface">
              Total Capacity: <span className="font-extrabold text-primary">{totalCapacity}</span> tickets
            </span>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          {formData.ticketTypes.map((tier, index) => (
            <div
              key={index}
              className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/40 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4"
            >
              <div className="flex-1 space-y-1">
                <label className="block font-label-sm text-label-sm text-on-surface-variant font-semibold">
                  Ticket Tier Name *
                </label>
                <input
                  type="text"
                  required
                  value={tier.name}
                  onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
                  placeholder="e.g. General Admission, VIP"
                  className="w-full px-3.5 py-2 rounded-lg border border-outline-variant/60 bg-surface-container-lowest text-on-surface font-title-md text-title-md focus:outline-none focus:ring-2 focus:ring-primary-container/30"
                />
              </div>

              <div className="w-full sm:w-40 space-y-1">
                <label className="block font-label-sm text-label-sm text-on-surface-variant font-semibold">
                  Price (PKR) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-label-sm text-label-sm text-on-surface-variant font-bold">
                    Rs.
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    required
                    value={tier.price}
                    onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-outline-variant/60 bg-surface-container-lowest text-on-surface font-title-md text-title-md focus:outline-none focus:ring-2 focus:ring-primary-container/30"
                  />
                </div>
              </div>

              <div className="w-full sm:w-36 space-y-1">
                <label className="block font-label-sm text-label-sm text-on-surface-variant font-semibold">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={tier.capacity}
                  onChange={(e) => handleTicketChange(index, 'capacity', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-outline-variant/60 bg-surface-container-lowest text-on-surface font-title-md text-title-md focus:outline-none focus:ring-2 focus:ring-primary-container/30"
                />
              </div>

              <div className="flex items-center justify-end sm:pt-5">
                <button
                  type="button"
                  onClick={() => handleRemoveTicketType(index)}
                  disabled={formData.ticketTypes.length <= 1}
                  className="p-2 rounded-lg text-error hover:bg-error-container/20 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  title={formData.ticketTypes.length <= 1 ? 'At least one tier required' : 'Delete tier'}
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            </div>
          ))}

          {/* Add Tier Button */}
          <button
            type="button"
            onClick={handleAddTicketType}
            className="w-full py-3 rounded-xl bg-primary/5 hover:bg-primary/10 border border-dashed border-primary/30 text-primary font-label-md text-label-md transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>Add Another Ticket Type</span>
          </button>
        </div>
      </section>

      {/* Section 6: Event Settings */}
      <section className="bg-surface-container-lowest rounded-2xl p-5 sm:p-7 border border-outline-variant/40 shadow-xs space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-label-md text-label-md font-bold">
              6
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
              Event Settings
            </h2>
          </div>
          <p className="text-on-surface-variant font-body-md text-body-md pl-9">
            Configure booking controls and order limitations for ticket purchasers.
          </p>
        </div>

        <div className="space-y-5 pt-1">
          {/* Booking Status Radio */}
          <div className="space-y-2">
            <label className="block font-label-md text-label-md text-on-surface">
              Booking Status
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`relative flex items-center p-4 rounded-xl cursor-pointer border transition-all ${
                  formData.bookingStatus === 'Open'
                    ? 'bg-primary-fixed/20 border-primary text-on-surface ring-1 ring-primary'
                    : 'bg-surface-container-low border-outline-variant/40 hover:bg-surface-container'
                }`}
              >
                <input
                  type="radio"
                  name="bookingStatus"
                  value="Open"
                  checked={formData.bookingStatus === 'Open'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary accent-primary"
                />
                <div className="ml-3">
                  <p className="font-label-md text-label-md font-bold text-on-surface">Open</p>
                  <p className="font-caption-xs text-caption-xs text-on-surface-variant">
                    Accepting bookings immediately upon publish
                  </p>
                </div>
              </label>

              <label
                className={`relative flex items-center p-4 rounded-xl cursor-pointer border transition-all ${
                  formData.bookingStatus === 'Closed'
                    ? 'bg-primary-fixed/20 border-primary text-on-surface ring-1 ring-primary'
                    : 'bg-surface-container-low border-outline-variant/40 hover:bg-surface-container'
                }`}
              >
                <input
                  type="radio"
                  name="bookingStatus"
                  value="Closed"
                  checked={formData.bookingStatus === 'Closed'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary accent-primary"
                />
                <div className="ml-3">
                  <p className="font-label-md text-label-md font-bold text-on-surface">Closed</p>
                  <p className="font-caption-xs text-caption-xs text-on-surface-variant">
                    Hidden from public checkout and cart
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Maximum Tickets Per Booking */}
          <div className="space-y-2 max-w-sm">
            <label className="block font-label-md text-label-md text-on-surface" htmlFor="max-tickets">
              Maximum Tickets Per Booking
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    maxTicketsPerBooking: Math.max(1, (Number(prev.maxTicketsPerBooking) || 1) - 1),
                  }))
                }
                className="w-10 h-10 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors border border-outline-variant/40"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>

              <input
                id="max-tickets"
                name="maxTicketsPerBooking"
                type="number"
                min="1"
                max="20"
                value={formData.maxTicketsPerBooking}
                onChange={handleInputChange}
                className="w-20 text-center py-2 rounded-xl border border-outline-variant/60 bg-surface-container-lowest text-on-surface font-headline-sm text-headline-sm focus:outline-none focus:ring-2 focus:ring-primary-container/30"
              />

              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    maxTicketsPerBooking: Math.min(20, (Number(prev.maxTicketsPerBooking) || 1) + 1),
                  }))
                }
                className="w-10 h-10 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors border border-outline-variant/40"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
            <p className="font-caption-xs text-caption-xs text-on-surface-variant">
              Maximum number of tickets an attendee can buy in a single order (1-20). Default is 5.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Action Bar */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-outline-variant/40 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          to="/organizer/events"
          className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Cancel & Return to Events</span>
        </Link>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => handleSubmit('Draft')}
            disabled={!!submittingStatus}
            className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">drafts</span>
            <span>{submittingStatus === 'Draft' ? 'Saving...' : 'Save Draft'}</span>
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('Published')}
            disabled={!!submittingStatus}
            className="px-6 py-2.5 rounded-xl bg-secondary-container hover:brightness-105 active:scale-[0.99] text-on-secondary font-label-md text-label-md font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isEditing ? 'publish' : 'rocket_launch'}
            </span>
            <span>
              {submittingStatus === 'Published'
                ? isEditing
                  ? 'Updating...'
                  : 'Publishing...'
                : isEditing
                ? 'Update & Publish'
                : 'Publish Event'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
