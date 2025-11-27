import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
    id: string;
    title: string;
    description: string;
    isEnrolled?: boolean;
}

export default function CourseCard({ id, title, description, isEnrolled }: CourseCardProps) {
    const navigate = useNavigate();

    return (
        <Card
            className="cursor-pointer hover:shadow-lg relative"
            onClick={() => navigate(`/course/${id}`)}
        >
            {isEnrolled && (
                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Enrolled
                </span>
            )}

            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{description}</p>
            </CardContent>
        </Card>
    );
}