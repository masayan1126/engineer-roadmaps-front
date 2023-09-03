"use client";
import {
  create,
  destroy,
  fetch,
  update,
} from "@/features/user/functions/client";
import { User } from "@/features/user/types/user";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  const editUser = (user: User) => {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
  };

  const submit = () => {
    console.log(selectedUser);
    if (selectedUser) {
      updateUser(selectedUser);
      return;
    }

    createUser();
  };

  const createUser = async () => {
    try {
      const user = await create(name, email);

      setUsers((prev) => [...prev, user]);

      setName("");
      setEmail("");
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        // TODO: 画面に表示
        if (e.response?.data.statusCode === 400) {
          console.log(e.response?.data.error);
          return;
        }

        console.log("System error");
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: "name" | "email"
  ) => {
    if (key === "name") {
      setName(e.target.value);
      return;
    }
    setEmail(e.target.value);
  };

  const updateUser = async (user: User) => {
    const updatedUser = await update({ id: user.id, name, email });

    const i = users.findIndex((u) => u.id === user.id);
    const newUsers = [...users];
    newUsers.splice(i, 1, updatedUser);

    setUsers(newUsers);

    setSelectedUser(undefined);
    setName("");
    setEmail("");
  };

  const deleteUser = async (user: User) => {
    const deletedUser = await destroy(user);
    const i = users.findIndex((u) => u.id === deletedUser.id);
    const newUsers = [...users];
    // i番目の要素を削除する
    newUsers.splice(i, 1);

    setUsers(newUsers);
  };

  useEffect(() => {
    (async () => {
      const users = await fetch();
      setUsers(users);
    })();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <ul>
        {users.length !== 0 &&
          users.map((user) => (
            <li key={user.id}>
              {`ID: ${user.id} | 名前: ${user.name}`}{" "}
              <span onClick={() => editUser(user)}>| ✏️編集 |</span>
              <span onClick={() => deleteUser(user)}>🗑️削除</span>
            </li>
          ))}
      </ul>
      <div className="max-w-md mx-auto mt-5 p-5 bg-gray-100 rounded-md">
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
            onClick={() => submit()}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-green"
          >
            送信
          </button>
        </div>
      </div>
    </main>
  );
}
