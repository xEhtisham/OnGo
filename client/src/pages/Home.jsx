import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { Card, CardTitle, CardDescription } from '../components/Card';

export default function Home() {
  const highlights = [
    {
      title: 'Discover Live Experiences',
      description:
        'Browse concerts, tech meetups, festivals, and cultural events tailored to your interests and city.',
      tag: 'Explore',
      tagColor: 'bg-primary/10 text-primary',
    },
    {
      title: 'Seamless Digital Booking',
      description:
        'Reserve tickets with transparent pricing, instant booking confirmation, and zero hassle.',
      tag: 'Ticketing',
      tagColor: 'bg-coral/10 text-coral',
    },
    {
      title: 'Organizer Control Hub',
      description:
        'Publish events, manage ticket capacities, and track attendee entries from an intuitive dashboard.',
      tag: 'Organizers',
      tagColor: 'bg-emerald-500/10 text-emerald-700',
    },
  ];

  return (
    <div className="space-y-16 py-12 md:py-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
          The Next-Gen Event Platform
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-text tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
          Where Unforgettable <span className="text-primary">Events</span> Begin.
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
          Discover trending events, book digital tickets in seconds, or host and manage your own experiences with OnGo.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/explore">
            <Button variant="cta" size="lg">
              Explore Events
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" size="lg">
              Create an Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Highlight Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((item, index) => (
            <Card key={index} className="flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span
                  className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-md mb-4 ${item.tagColor}`}
                >
                  {item.tag}
                </span>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription className="mt-2 text-base leading-relaxed">
                  {item.description}
                </CardDescription>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
