"use client";

import { type WidgetProps } from "../types";
import { type CalendarAiConfig } from "./config";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern (ET)" },
  { value: "America/Chicago", label: "Central (CT)" },
  { value: "America/Denver", label: "Mountain (MT)" },
  { value: "America/Los_Angeles", label: "Pacific (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Berlin", label: "Berlin (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
];

export default function CalendarAiSettings({
  config,
  onConfigChange,
}: WidgetProps<CalendarAiConfig>) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Working hours start</Label>
          <span className="text-sm font-medium tabular-nums">
            {config.workingHours.start}:00
          </span>
        </div>
        <Slider
          min={5}
          max={12}
          value={[config.workingHours.start]}
          onValueChange={(value) =>
            onConfigChange({
              workingHours: {
                ...config.workingHours,
                start: Array.isArray(value) ? value[0] : value,
              },
            })
          }
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Working hours end</Label>
          <span className="text-sm font-medium tabular-nums">
            {config.workingHours.end}:00
          </span>
        </div>
        <Slider
          min={14}
          max={22}
          value={[config.workingHours.end]}
          onValueChange={(value) =>
            onConfigChange({
              workingHours: {
                ...config.workingHours,
                end: Array.isArray(value) ? value[0] : value,
              },
            })
          }
        />
      </div>
      <div className="flex items-center justify-between">
        <Label>Timezone</Label>
        <Select
          value={config.timezone}
          onValueChange={(value) => {
            if (value) onConfigChange({ timezone: value });
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIMEZONES.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
