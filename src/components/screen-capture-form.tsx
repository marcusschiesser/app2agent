import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ScreenCaptureFormProps {
  isEnabled: boolean;
  onToggle: (checked: boolean) => void;
}

export function ScreenCaptureForm({
  isEnabled,
  onToggle,
}: ScreenCaptureFormProps) {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="flex items-center space-x-2">
        <Switch
          id="screen-capture"
          checked={isEnabled}
          onCheckedChange={(checked) => {
            onToggle(checked);
            return false;
          }}
          role="switch"
          type="button"
        />
        <Label htmlFor="screen-capture">Screen Capture</Label>
      </div>
    </form>
  );
}
