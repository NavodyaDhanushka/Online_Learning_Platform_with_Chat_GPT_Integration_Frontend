import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;


export async function getAiCourseSuggestions(query: string) {
    const res = await axios.post(`${API_URL}/ai/ask`, {
        query,
    });

    return res.data;
}

