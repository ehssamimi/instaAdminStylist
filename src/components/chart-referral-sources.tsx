"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useIsMobile } from "@/hooks/use-mobile"
import type {
  DashboardChartRange,
  ReferralSourceDatum,
  ReferralSourcesByRange,
} from "@/models/dashboardOverview"

function totalReferralResponses(data: ReferralSourceDatum[]): number {
  return data.reduce((sum, d) => sum + d.count, 0)
}

const chartConfig = {
  count: {
    label: "Responses",
    color: "var(--color-brand-800)",
  },
} satisfies ChartConfig

/** Maps the smallest count in the series to brand-200 and the largest to brand-800 (theme tokens). */
function brandBarFill(count: number, min: number, max: number): string {
  if (max <= min) {
    return "var(--color-brand-500)"
  }
  const t = Math.max(0, Math.min(1, (count - min) / (max - min)))
  const pct = (t * 100).toFixed(2)
  return `color-mix(in srgb, var(--color-brand-800) ${pct}%, var(--color-brand-200))`
}

function withBarFills(data: ReferralSourceDatum[]): (ReferralSourceDatum & {
  fill: string
})[] {
  const counts = data.map((d) => d.count)
  const min = Math.min(...counts)
  const max = Math.max(...counts)
  return data.map((d) => ({
    ...d,
    fill: brandBarFill(d.count, min, max),
  }))
}

/** Tabs: straight underline via inset shadow (avoids rounded-corner “hook” from border-b on ToggleGroupItem). */
const rangeToggleItemClassName =
  "rounded-none first:rounded-none last:rounded-none border-0 bg-transparent px-4 py-7 shadow-none " +
  "hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 " +
  "data-[state=on]:bg-transparent " +
  "data-[state=off]:text-muted-foreground data-[state=on]:text-brand-700 data-[state=on]:font-bold " +
  "data-[state=on]:shadow-[inset_0_-2px_0_0_var(--color-brand-700)]"

type ChartReferralSourcesProps = {
  referralSourcesByRange: ReferralSourcesByRange
}

export function ChartReferralSources({
  referralSourcesByRange,
}: ChartReferralSourcesProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState<DashboardChartRange>('7d')

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange('7d')
    }
  }, [isMobile])

  const data = React.useMemo(
    () => referralSourcesByRange[timeRange] ?? referralSourcesByRange['7d'],
    [referralSourcesByRange, timeRange]
  )
  const chartData = React.useMemo(() => withBarFills(data), [data])
  const total = totalReferralResponses(data)

  return (
    <Card className="@container/card shadow-none  ">
      <CardHeader>
        <CardTitle className="text-base font-bold text-gray-900">
          How did users hear about Instastylin?{" "}
          <span className="font-bold">
            · {total.toLocaleString()} responses
          </span>
        </CardTitle>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(v) => v && setTimeRange(v as DashboardChartRange)}
            variant="default"
            className="hidden @[767px]/card:flex @[767px]/card:gap-0 @[767px]/card:rounded-none @[767px]/card:bg-transparent @[767px]/card:shadow-none"
          >
            <ToggleGroupItem value="7d" className={rangeToggleItemClassName}>
              Past Week
            </ToggleGroupItem>
            <ToggleGroupItem value="90d" className={rangeToggleItemClassName}>
              Past 3 Months
            </ToggleGroupItem>
            <ToggleGroupItem value="180d" className={rangeToggleItemClassName}>
              Past 6 Months
            </ToggleGroupItem>
            <ToggleGroupItem value="365d" className={rangeToggleItemClassName}>
              Past Year
            </ToggleGroupItem>
          </ToggleGroup>
          <Select
            value={timeRange}
            onValueChange={(v) => setTimeRange(v as DashboardChartRange)}
          >
            <SelectTrigger
              className="flex w-44 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Time range"
            >
              <SelectValue placeholder="Past week" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d" className="rounded-lg">
                Past Week
              </SelectItem>
              <SelectItem value="90d" className="rounded-lg">
                Past 3 Months
              </SelectItem>
              <SelectItem value="180d" className="rounded-lg">
                Past 6 Months
              </SelectItem>
              <SelectItem value="365d" className="rounded-lg">
                Past Year
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
          <BarChart
            data={chartData}
            margin={{ top: 28, right: 8, left: 8, bottom: 4 }}
            barCategoryGap="10%"
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              interval={0}
              tick={{ fontSize: 14 }}
            />
            <YAxis hide domain={[0, "dataMax"]} />
            <ChartTooltip
              cursor={{ fill: "hsl(var(--muted) / 0.35)" }}
              content={<ChartTooltipContent hideIndicator />}
            />
            <Bar dataKey="count" radius={[2, 2, 0, 0]} maxBarSize={112}>
              <LabelList
                dataKey="count"
                position="top"
                offset={12}
                className="fill-muted-foreground text-[16px] font-medium"
                formatter={(v: number) => v.toLocaleString()}
              />
              {chartData.map((entry, i) => (
                <Cell key={`${entry.label}-${i}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
