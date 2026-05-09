import { useEffect, useState } from "react";
import { getTransactions } from "@/services/transaction";

function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await getTransactions();
      setData(res.data);
    } catch (err: any) {
      console.log("Error fetching:", err);
      setError("API Failed ❌"); // 🔥 show error instead of crash
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 text-white">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!loading && data.length === 0 && !error && (
        <p>No transactions yet</p>
      )}

      <div className="flex flex-col gap-2">
        {data.map((t) => (
          <div
            key={t._id}
            className="border p-3 rounded flex justify-between"
          >
            <span>{t.text}</span>
            <span
              className={
                t.type === "income" ? "text-green-500" : "text-red-500"
              }
            >
              ₹{t.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;