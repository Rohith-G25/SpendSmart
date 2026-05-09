import API from "./api";

export const registerUser = (data: any) =>
  API.post("/auth/register", data);

export const loginUser = async (data: any) => {
  const res = await API.post("/auth/login", data);

  // save token
  localStorage.setItem("token", res.data.token);

  return res.data;
};