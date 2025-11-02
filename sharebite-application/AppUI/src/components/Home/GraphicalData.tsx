import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Box, Typography, Card, CardContent } from "@mui/material";

// Mock demo values for project review
const data = [
  { name: "Meals Delivered", value: 250 },
  { name: "NGOs Associated", value: 32 },
  { name: "Volunteers Engaged", value: 97 },
  { name: "Partners", value: 15 },
  { name: "Events Hosted", value: 8 },
];

const StatisticsBarGraph: React.FC = () => {
  return (
    <Box sx={{ padding: "2em 4em", marginBottom: "50px" }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", textAlign: "center", marginBottom: "2em" }}
      >
        Project Impact Overview
      </Typography>

      <Card>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#1976d2" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StatisticsBarGraph;
