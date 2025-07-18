
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface TransactionMethodsProps {
  allowPickup: boolean;
  allowMeetOnCampus: boolean;
  allowDropOff: boolean;
  onInputChange: (field: string, value: boolean) => void;
}

const TransactionMethods: React.FC<TransactionMethodsProps> = ({
  allowPickup,
  allowMeetOnCampus,
  allowDropOff,
  onInputChange
}) => {
  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">Transaction Methods</Label>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="allowPickup"
            checked={allowPickup}
            onCheckedChange={(checked) => onInputChange("allowPickup", checked as boolean)}
          />
          <Label htmlFor="allowPickup" className="text-sm font-normal">
            Allow pickup
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="allowMeetOnCampus"
            checked={allowMeetOnCampus}
            onCheckedChange={(checked) => onInputChange("allowMeetOnCampus", checked as boolean)}
          />
          <Label htmlFor="allowMeetOnCampus" className="text-sm font-normal">
            Meet on campus
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="allowDropOff"
            checked={allowDropOff}
            onCheckedChange={(checked) => onInputChange("allowDropOff", checked as boolean)}
          />
          <Label htmlFor="allowDropOff" className="text-sm font-normal">
            Drop off
          </Label>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Select at least one transaction method for your listing
      </p>
    </div>
  );
};

export default TransactionMethods;
