import axios from "axios";

export async function getAiCourseSuggestions(query: string) {
    const res = await axios.post("http://localhost:5000/api/ai/ask", {
        query,
    });

    return res.data; // returns { success, answer }
}
