import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";

import { getAiCourseSuggestions } from "@/services/aiService.tsx"; // API service you will create

export default function AiSuggestions() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!query.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Empty Question",
                text: "Please type a question before submitting.",
            });
            return;
        }

        try {
            setLoading(true);
            const response = await getAiCourseSuggestions(query); // Call backend AI API
            setResults(response.answer); // response.answer contains AI result
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to get AI suggestions.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <div className="pt-24 p-6 flex flex-col items-center gap-6 min-h-screen">

                <Card className="max-w-2xl w-full">
                    <CardHeader>
                        <CardTitle>AI Course Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            placeholder="Ask a question about courses..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />

                        <Button
                            onClick={handleSubmit}
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Submit"}
                        </Button>

                        {results && (
                            <Card className="mt-4 bg-gray-50">
                                <CardContent>
                                    <div
                                        className="prose"
                                        dangerouslySetInnerHTML={{ __html: results }}
                                    />
                                </CardContent>
                            </Card>
                        )}

                    </CardContent>
                </Card>
            </div>
        </>
    );
}
