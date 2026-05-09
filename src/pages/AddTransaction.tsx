import { useState } from "react";
import { addTransaction } from "@/services/transaction";

function AddTransaction() {
  const [text, setText] = useState("");
  const [amount, setAmount] = useState(0);

  const handleAdd = async () => {
    try {
      await addTransaction({
        text,
        amount,
        type: amount > 0 ? "income" : "expense",
      });

      alert("Transaction Added ✅");

      setText("");
      setAmount(0);
    } catch (err) {
      console.log(err);
      alert("Error adding transaction ❌");
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">Add Transaction</h1>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Enter text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <input
        type="number"
        className="border p-2 w-full mb-2"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      <button
        onClick={handleAdd}
        className="bg-green-500 text-white p-2 w-full"
      >
        Add Transaction
      </button>
    </div>
  );
}

export default AddTransaction; // 🔥 THIS FIXES YOUR ERROR