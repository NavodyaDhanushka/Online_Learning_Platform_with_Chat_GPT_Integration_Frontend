import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
    id: string;
    title: string;
    description: string;

}

export default function CourseCard({ id, title, description }: CourseCardProps) {
    const navigate = useNavigate();

    return (
        <Card className="cursor-pointer hover:shadow-lg" onClick={() => navigate(`/course/${id}`)}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{description}</p>
            </CardContent>
        </Card>
    );
}