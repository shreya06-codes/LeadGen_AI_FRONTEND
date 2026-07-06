export const getUsers = async () => {
  const res = await fetch("http://127.0.0.1:8000/users");
  return res.json();
};
