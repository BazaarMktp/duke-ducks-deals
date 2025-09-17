import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Heart, MessageCircle, Users, Home, Search, Calendar } from 'lucide-react';
import { useRoommateMatching } from '@/hooks/useRoommateMatching';
import { motion, AnimatePresence } from 'framer-motion';

export const RoommateMatchingSystem = () => {
  const { 
    preferences, 
    matches, 
    loading, 
    savePreferences, 
    findMatches, 
    updateMatchStatus 
  } = useRoommateMatching();
  
  const [activeTab, setActiveTab] = useState<'preferences' | 'matches'>('preferences');
  const [formData, setFormData] = useState({
    budget_min: preferences?.budget_min || 500,
    budget_max: preferences?.budget_max || 2000,
    cleanliness_level: preferences?.cleanliness_level || 5,
    noise_tolerance: preferences?.noise_tolerance || 5,
    sleep_schedule: preferences?.sleep_schedule || 'flexible',
    social_level: preferences?.social_level || 5,
    study_habits: preferences?.study_habits || 'flexible',
    pet_friendly: preferences?.pet_friendly || false,
    smoking_ok: preferences?.smoking_ok || false,
    guests_ok: preferences?.guests_ok || true,
    preferred_location: preferences?.preferred_location || '',
    move_in_date: preferences?.move_in_date || '',
    lease_length: preferences?.lease_length || 'semester',
    additional_preferences: preferences?.additional_preferences || ''
  });

  const handleSavePreferences = async () => {
    try {
      await savePreferences(formData);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Roommate Finder</h1>
          <p className="text-muted-foreground">Find your perfect roommate match with AI compatibility scoring</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'preferences' ? 'default' : 'outline'}
            onClick={() => setActiveTab('preferences')}
          >
            <Home className="h-4 w-4 mr-2" />
            Preferences
          </Button>
          <Button
            variant={activeTab === 'matches' ? 'default' : 'outline'}
            onClick={() => setActiveTab('matches')}
          >
            <Users className="h-4 w-4 mr-2" />
            Matches
          </Button>
        </div>
      </div>

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Roommate Preferences</CardTitle>
              <CardDescription>
                Set your preferences to find the most compatible roommates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Budget */}
              <div className="space-y-3">
                <Label>Budget Range ($/month)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Minimum</Label>
                    <Input
                      type="number"
                      value={formData.budget_min}
                      onChange={(e) => setFormData({ ...formData, budget_min: parseInt(e.target.value) })}
                      placeholder="500"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Maximum</Label>
                    <Input
                      type="number"
                      value={formData.budget_max}
                      onChange={(e) => setFormData({ ...formData, budget_max: parseInt(e.target.value) })}
                      placeholder="2000"
                    />
                  </div>
                </div>
              </div>

              {/* Lifestyle Scales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Cleanliness Level: {formData.cleanliness_level}/10</Label>
                  <Slider
                    value={[formData.cleanliness_level]}
                    onValueChange={(value) => setFormData({ ...formData, cleanliness_level: value[0] })}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Messy</span>
                    <span>Very Clean</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Noise Tolerance: {formData.noise_tolerance}/10</Label>
                  <Slider
                    value={[formData.noise_tolerance]}
                    onValueChange={(value) => setFormData({ ...formData, noise_tolerance: value[0] })}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Quiet</span>
                    <span>Very Tolerant</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Social Level: {formData.social_level}/10</Label>
                  <Slider
                    value={[formData.social_level]}
                    onValueChange={(value) => setFormData({ ...formData, social_level: value[0] })}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Introvert</span>
                    <span>Extrovert</span>
                  </div>
                </div>
              </div>

              {/* Dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Sleep Schedule</Label>
                  <Select 
                    value={formData.sleep_schedule} 
                    onValueChange={(value) => setFormData({ ...formData, sleep_schedule: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="early_bird">Early Bird</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                      <SelectItem value="night_owl">Night Owl</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Study Habits</Label>
                  <Select 
                    value={formData.study_habits} 
                    onValueChange={(value) => setFormData({ ...formData, study_habits: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quiet">Quiet</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                      <SelectItem value="collaborative">Collaborative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Lease Length</Label>
                  <Select 
                    value={formData.lease_length} 
                    onValueChange={(value) => setFormData({ ...formData, lease_length: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semester">Semester</SelectItem>
                      <SelectItem value="year">Full Year</SelectItem>
                      <SelectItem value="summer">Summer</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Toggle Switches */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pet-friendly">Pet Friendly</Label>
                  <Switch
                    id="pet-friendly"
                    checked={formData.pet_friendly}
                    onCheckedChange={(checked) => setFormData({ ...formData, pet_friendly: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="smoking-ok">Smoking OK</Label>
                  <Switch
                    id="smoking-ok"
                    checked={formData.smoking_ok}
                    onCheckedChange={(checked) => setFormData({ ...formData, smoking_ok: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="guests-ok">Guests Welcome</Label>
                  <Switch
                    id="guests-ok"
                    checked={formData.guests_ok}
                    onCheckedChange={(checked) => setFormData({ ...formData, guests_ok: checked })}
                  />
                </div>
              </div>

              {/* Additional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Preferred Location</Label>
                  <Input
                    value={formData.preferred_location}
                    onChange={(e) => setFormData({ ...formData, preferred_location: e.target.value })}
                    placeholder="On-campus, Off-campus, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Move-in Date</Label>
                  <Input
                    type="date"
                    value={formData.move_in_date}
                    onChange={(e) => setFormData({ ...formData, move_in_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Additional Preferences</Label>
                <Textarea
                  value={formData.additional_preferences}
                  onChange={(e) => setFormData({ ...formData, additional_preferences: e.target.value })}
                  placeholder="Any other preferences or requirements..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleSavePreferences} 
                  disabled={loading}
                  className="flex-1"
                >
                  Save Preferences
                </Button>
                <Button 
                  onClick={findMatches} 
                  disabled={loading || !preferences}
                  variant="outline"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Find Matches
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Matches Tab */}
      {activeTab === 'matches' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {matches.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No matches found yet. Set your preferences and find matches!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {matches.map((match: any) => (
                <Card key={match.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {match.profiles?.profile_name || 'Anonymous User'}
                          </CardTitle>
                          <CardDescription>
                            Compatibility Score: {match.compatibility_score}%
                          </CardDescription>
                        </div>
                      </div>
                      <Badge 
                        className={getCompatibilityColor(match.compatibility_score)}
                        variant="outline"
                      >
                        {match.compatibility_score >= 80 ? 'Excellent' : 
                         match.compatibility_score >= 60 ? 'Good' : 'Fair'} Match
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {match.explanation && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {match.explanation.summary}
                        </p>
                        
                        {match.explanation.strengths && (
                          <div>
                            <h4 className="text-sm font-medium text-green-700 mb-1">Strengths:</h4>
                            <ul className="text-xs text-green-600 space-y-1">
                              {match.explanation.strengths.map((strength: string, index: number) => (
                                <li key={index}>• {strength}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => updateMatchStatus(match.id, 'accepted')}
                        disabled={match.status === 'accepted'}
                        className="flex-1"
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        {match.status === 'accepted' ? 'Accepted' : 'Accept'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateMatchStatus(match.id, 'declined')}
                        disabled={match.status === 'declined'}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};