import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"


export type GraphDataType = {
  name: string
  value: number
}

export function Graph({data}: {data: GraphDataType[]}) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#000"
          fontSize={16}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#000"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => value}
        />
        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}