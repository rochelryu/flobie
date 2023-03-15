import React, { useState } from "react";
import { colorPrimary, colorGrey } from "../../../Constants/color";
import { Card, Grid } from "@mui/material";
import { DownCircleTwoTone, UpCircleTwoTone } from "@ant-design/icons";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Space } from "antd";

interface Props {
  dataSourceTabsOne: any[];
  dataSourceTabsTwo: any[];
  title?: string;
  option?: {
    headerStyle?: React.CSSProperties;
  };
}
export default function DisplayData(props: Props) {
  const [display, setDisplay] = useState<number>(0);
  const { dataSourceTabsOne, dataSourceTabsTwo } = props;

  const barChatWidth = Math.floor(window.innerWidth * 0.72);
  return (
    <>
      <Grid container>
        <Card style={{ padding: 10, marginBottom: 10 }}>
          <Space>
            <span onClick={() => setDisplay(0)} className="mousePointer">
              <span>
                <DownCircleTwoTone
                  twoToneColor={display === 0 ? colorPrimary : colorGrey}
                  style={{ fontSize: "24px" }}
                />
              </span>
              <span
                style={{
                  color: display === 0 ? colorPrimary : colorGrey,
                  marginLeft: 12,
                }}
              >
                Réchargements
              </span>
            </span>
            <span onClick={() => setDisplay(1)} className="mousePointer">
              <span>
                <UpCircleTwoTone
                  twoToneColor={display === 1 ? colorPrimary : colorGrey}
                  style={{ fontSize: "24px" }}
                />
              </span>
              <span
                style={{
                  color: display === 1 ? colorPrimary : colorGrey,
                  marginLeft: 12,
                }}
              >
                Retraits
              </span>
            </span>
          </Space>
        </Card>
      </Grid>
      <Grid container>
        {display === 0 ? (
          <Card style={{ padding: 10 }}>
            <BarChart
              width={barChatWidth}
              height={350}
              data={dataSourceTabsOne}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Crypto" stackId="a" fill={colorPrimary} />
              <Bar dataKey="MobileMoney" stackId="a" fill={colorGrey} />
            </BarChart>
          </Card>
        ) : (
          <Card style={{ padding: 10 }}>
            <BarChart
              width={barChatWidth}
              height={350}
              data={dataSourceTabsTwo}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Crypto" stackId="a" fill={colorPrimary} />
              <Bar dataKey="MobileMoney" stackId="a" fill={colorGrey} />
            </BarChart>
          </Card>
        )}
      </Grid>
    </>
  );
}
