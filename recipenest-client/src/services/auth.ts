import API from "./api";

export async function login(email: string, password: string) {
    const res = await API.post("/auth/login", { email, password });
    return res.data;
}
