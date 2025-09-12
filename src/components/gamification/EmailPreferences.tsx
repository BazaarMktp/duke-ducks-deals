import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmailPreferences } from "@/hooks/useEmailPreferences";
import { Mail, Bell, Settings, Loader2 } from "lucide-react";

export const EmailPreferences = () => {
  const { preferences, loading, saving, updateSinglePreference } = useEmailPreferences();

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading preferences...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          Email Preferences
          {saving && <Loader2 className="h-4 w-4 animate-spin ml-auto" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </h4>
          
          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="message-notifications">Message Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when you receive new messages
                </p>
              </div>
              <Switch
                id="message-notifications"
                checked={preferences.message_notifications}
                onCheckedChange={(checked) => 
                  updateSinglePreference('message_notifications', checked)
                }
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="deal-notifications">Deal Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about new deals and discounts
                </p>
              </div>
              <Switch
                id="deal-notifications"
                checked={preferences.deal_notifications}
                onCheckedChange={(checked) => 
                  updateSinglePreference('deal_notifications', checked)
                }
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="achievement-notifications">Achievement Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when you unlock achievements
                </p>
              </div>
              <Switch
                id="achievement-notifications"
                checked={preferences.achievement_notifications}
                onCheckedChange={(checked) => 
                  updateSinglePreference('achievement_notifications', checked)
                }
                disabled={saving}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Communication Settings
          </h4>
          
          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="weekly-digest">Weekly Digest</Label>
                <p className="text-sm text-muted-foreground">
                  Receive a weekly summary of your activity
                </p>
              </div>
              <Switch
                id="weekly-digest"
                checked={preferences.weekly_digest}
                onCheckedChange={(checked) => 
                  updateSinglePreference('weekly_digest', checked)
                }
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketing-emails">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates about new features and promotions
                </p>
              </div>
              <Switch
                id="marketing-emails"
                checked={preferences.marketing_emails}
                onCheckedChange={(checked) => 
                  updateSinglePreference('marketing_emails', checked)
                }
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency-select">Notification Frequency</Label>
              <Select
                value={preferences.frequency}
                onValueChange={(value) => 
                  updateSinglePreference('frequency', value)
                }
                disabled={saving}
              >
                <SelectTrigger id="frequency-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instant">Instant</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Summary</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose how often you want to receive email notifications
              </p>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
          <p className="font-medium mb-1">Privacy Note</p>
          <p>
            You can change these preferences at any time. We'll never share your email 
            with third parties and you can unsubscribe from any email type instantly.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};