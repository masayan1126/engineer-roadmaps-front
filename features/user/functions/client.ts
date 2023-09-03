import { END_POINT } from "@/features/user/constant";
import { User } from "@/features/user/types/user";
import axios from "axios";

export const create = async (name: string, email: string): Promise<User> => {
  const res = await axios.post(END_POINT, {
    data: { name, email },
  });

  return res.data.user;
};

export const fetch = async (): Promise<User[]> => {
  const res = await axios.get(END_POINT);
  return res.data.users;
};

export const update = async (user: User): Promise<User> => {
  const res = await axios.patch("http://localhost:18000/users", {
    data: { id: user.id, name: user.name, email: user.email },
  });

  return res.data.user;
};

export const destroy = async (user: User): Promise<User> => {
  const res = await axios.delete(END_POINT, {
    data: { id: user.id },
  });

  return res.data.user;
};
