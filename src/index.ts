console.log("hi")

interface FaqItem {
    id: string;
    sourceId: string;
    sectionId: string;
    question: string;
    answer: string;
    metadata: Record<string, any>;
}

interface FaqSource {
    id: string;
    name: string;
    url: string;
    type: string;
    sections: FaqSection[];
    metadata: Record<string, any>;
}

interface FaqSection {
    id: string;
    name: string;
    description: string;
}


