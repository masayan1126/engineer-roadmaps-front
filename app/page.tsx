"use client";
import axios from "axios";
import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async (): Promise<User[]> => {
    const res = await axios.get("http://localhost:18000/users");
    return res.data.users;
  };

  const validate = () => {
    if (name === "") {
      alert("名前を入力してください");
      return false;
    }
    if (email === "") {
      alert("メールアドレスを入力してください");
      return false;
    }
    return true;
  };

  const createUser = async () => {
    if (!validate()) return;

    const res = await axios.post("http://localhost:18000/users", {
      data: { name, email },
    });

    setUsers((prev) => [...prev, res.data.user]);

    setName("");
    setEmail("");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: "name" | "email"
  ) => {
    if (key === "name") {
      setName(e.target.value);
    } else {
      setEmail(e.target.value);
    }
  };

  useEffect(() => {
    (async () => {
      const users = await fetchUsers();
      setUsers(users);
    })();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <ul>
        {users.length !== 0 &&
          users.map((user) => (
            <li key={user.id}>
              {`ID: ${user.id}`} /{`名前: ${user.name}`}
            </li>
          ))}
      </ul>
      <div className="max-w-md mx-auto mt-5 p-5 bg-gray-100 rounded-md">
        <h2 className="text-2xl font-semibold mb-3">ユーザー新規作成</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            名前
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => handleChange(e, `name`)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => handleChange(e, `email`)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
            required
          />
        </div>
        <div className="text-center">
          <button
            onClick={createUser}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-green"
          >
            送信
          </button>
        </div>
      </div>
    </main>
  );
}
