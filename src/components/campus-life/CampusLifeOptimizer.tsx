import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Users, Sparkles, RefreshCw } from 'lucide-react';
import { useCampusLife } from '@/hooks/useCampusLife';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export const CampusLifeOptimizer = () => {
  const { events, digest, loading, generateDigest, trackEventInteraction, processCampusData } = useCampusLife();
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const handleEventClick = (eventId: string) => {
    trackEventInteraction(eventId, 'click');
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      food: 'bg-orange-100 text-orange-800 border-orange-200',
      academic: 'bg-blue-100 text-blue-800 border-blue-200',
      social: 'bg-purple-100 text-purple-800 border-purple-200',
      deadline: 'bg-red-100 text-red-800 border-red-200',
      career: 'bg-green-100 text-green-800 border-green-200',
      sports: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      wellness: 'bg-pink-100 text-pink-800 border-pink-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatEventTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: date.toLocaleDateString(),
        relative: formatDistanceToNow(date, { addSuffix: true })
      };
    } catch {
      return { time: 'TBD', date: 'TBD', relative: 'Unknown' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campus Life</h1>
          <p className="text-muted-foreground">Your personalized campus events and opportunities</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={processCampusData} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Update Data
          </Button>
          <Button 
            onClick={generateDigest} 
            disabled={loading}
            className="bg-primary text-primary-foreground"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate My Digest
          </Button>
        </div>
      </div>

      {/* Personalized Digest */}
      {digest && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Your Daily Digest
              </CardTitle>
              <CardDescription>{digest.greeting}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {digest.fomo_alert && (
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <p className="text-sm font-medium text-warning-foreground">
                    🔥 Don't Miss: {digest.fomo_alert}
                  </p>
                </div>
              )}
              
              {digest.quick_stats && (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(digest.quick_stats).map(([type, count]) => (
                    <Badge 
                      key={type} 
                      variant="secondary" 
                      className="text-xs"
                    >
                      {String(count)} {type.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              )}

              {digest.highlights && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">Today's Highlights</h4>
                              {Array.isArray(digest.highlights) && digest.highlights.map((highlight: any, index: number) => (
                                <div key={index} className="p-2 bg-card border rounded">
                                  <p className="font-medium text-sm">{String(highlight.title)}</p>
                                  <p className="text-xs text-muted-foreground">{String(highlight.time)} • {String(highlight.location)}</p>
                                </div>
                              ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Events List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Upcoming Events</h2>
        <AnimatePresence>
          {events.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No events found. Check back later!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {events.map((event: any) => {
                const timeInfo = formatEventTime(event.start_time);
                const isExpanded = expandedEvent === event.id;
                
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleEventClick(event.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{event.title}</CardTitle>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {timeInfo.time} • {timeInfo.relative}
                              </div>
                              {event.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {event.location}
                                </div>
                              )}
                            </div>
                          </div>
                          <Badge 
                            className={getEventTypeColor(event.event_type)}
                            variant="outline"
                          >
                            {event.event_type}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <CardContent className="pt-0">
                              {event.description && (
                                <p className="text-sm text-muted-foreground mb-3">
                                  {event.description}
                                </p>
                              )}
                              
                              {event.tags && event.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {event.tags.map((tag: string, index: number) => (
                                    <Badge 
                                      key={index} 
                                      variant="outline" 
                                      className="text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};