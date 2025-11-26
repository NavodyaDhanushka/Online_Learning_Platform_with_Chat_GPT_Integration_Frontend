import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Attach token automatically
const api = axios.create({
    baseURL: `${API_URL}/courses`,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getAllCourses = async () => {
    const response = await api.get("/");
    return response.data;
};

export const getCourseById = async (id: string) => {
    const response = await api.get(`/${id}`);
    return response.data;
};

export const createCourse = async (courseData: any) => {
    const response = await api.post("/", courseData);
    return response.data;
};

export const updateCourse = async (id: string, courseData: any) => {
    const response = await api.put(`/${id}`, courseData);
    return response.data;
};

export const deleteCourse = async (id: string) => {
    const response = await api.delete(`/${id}`);
    return response.data;
};


// Enroll student into a course
export const enrollToCourse = async (courseId: string) => {
    const response = await api.put(`/enroll/${courseId}`);
    return response.data;
};

// Get all enrolled courses for a student
export const getEnrolledUsers = async () => {
    const response = await api.get(`/enrolled`);
    return response.data;
};

// Get all assign courses for a instructor
export const getAssignCourses = async () => {
    const response = await api.get(`/instructor`);
    return response.data;
};

