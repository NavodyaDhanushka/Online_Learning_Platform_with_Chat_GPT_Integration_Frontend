import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;


export async function getAiCourseSuggestions(query: string) {
    const token = localStorage.getItem("token")

    const res = await axios.post(`${API_URL}/ai/ask`, {
        query,
    },{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}

