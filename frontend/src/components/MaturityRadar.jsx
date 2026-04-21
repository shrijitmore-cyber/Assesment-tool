import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function MaturityRadar({ data }) {
  // data: [{ name, score, benchmark }]
  const chartData = data.map((d) => ({
    dimension: d.name.split(" — ")[0].split(" & ")[0],
    You: d.score,
    Peers: d.benchmark,
  }));

  return (
    <div className="h-[420px]" data-testid="maturity-radar">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} outerRadius="75%">
          <PolarGrid stroke="#E5E5E5" gridType="polygon" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: "#52525B", fontSize: 11, fontFamily: "IBM Plex Sans" }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "#A1A1AA", fontSize: 10 }}
            stroke="#E5E5E5"
          />
          <Radar
            name="You"
            dataKey="You"
            stroke="#002FA7"
            strokeWidth={2}
            fill="#002FA7"
            fillOpacity={0.15}
          />
          <Radar
            name="Peers"
            dataKey="Peers"
            stroke="#0A0A0A"
            strokeWidth={1}
            strokeDasharray="4 4"
            fill="#0A0A0A"
            fillOpacity={0.04}
          />
          <Legend
            wrapperStyle={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#52525B",
              paddingTop: 8,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
