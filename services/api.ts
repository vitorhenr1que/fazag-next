import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_VERSION === 'production' ? 'https://fazag-next.vercel.app/api' : '/api'
})