import { Inter } from "@next/font/google";
import {
  Spacer,
  Table,
  Textarea,
  Image,
  Switch,
  useTheme,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useTheme as useNextTheme } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [json, setJson] = useState("");
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const { setTheme } = useNextTheme();
  const { isDark, type } = useTheme();

  const columns = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "value",
      label: "Value",
    },
    {
      key: "status",
      label: "Status",
      width: 300,
    },
  ];

  useEffect(() => {
    if (json) {
      try {
        const parse = JSON.parse(json);
        if (parse.data && parse.success) {
          const dataSource = parse.data.withdrawals
            ? parse.data.withdrawals
            : parse.data.deposits;
          if (dataSource && dataSource.length) {
            const normalizeData = dataSource.map((item: any) => ({
              id: item.id,
              name: item.item.market_name,
              icon: item.item.icon_url,
              value: item.total_value / 100,
              status: item.status_message,
            }));

            setRows(normalizeData);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [json]);

  const renderCell = (item: any, columnKey: string) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case "name":
        return (
          <div>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                fontWeight: 600,
                minHeight: "30px",
              }}
            >
              <div>
                <Image
                  src={
                    "https://community.cloudflare.steamstatic.com/economy/image/" +
                    item.icon
                  }
                  width={32}
                ></Image>
              </div>

              {item.name}
            </div>
          </div>
        );
      case "value":
        return <span>{item.value}</span>;
      default:
        return <span>{cellValue}</span>;
    }
  };

  return (
    <div
      className={inter.className}
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: "900px", fontSize: 14 }}>
        <Switch
          checked={isDark}
          onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
        />
        <Spacer y={0.5} />
        <Textarea
          width="100%"
          placeholder="Paste your JSON here"
          value={json}
          onChange={(e) => setJson(e.target.value)}
        />
        <Spacer y={0.5} />
        <Table aria-label="Example table with static content">
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column key={column.key} width={column.width} align="start">
                {column.label}
              </Table.Column>
            )}
          </Table.Header>
          <Table.Body items={rows}>
            {(item: any) => (
              <Table.Row key={item.id}>
                {(columnKey: any) => (
                  <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
                )}
              </Table.Row>
            )}
          </Table.Body>
          <Table.Pagination
            total={rows.length / 10}
            page={page}
            shadow
            noMargin
            align="center"
            rowsPerPage={10}
            onPageChange={setPage}
          />
        </Table>
      </div>
    </div>
  );
}
