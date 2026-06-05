import api from "@/lib/api";


const RatingService = {
    async getAll() {
        try {
            const response = await api.get("/ranting");
            return response.data;
        } catch (error) {
            console.error("Error fetching rantings:", error);
            throw error;
        }
    },
    async submitVote(rating: number) {
        try {
            const response = await api.post("/ranting", { rating });
            return response.data;
        } catch (error) {
            console.error("Error submitting vote:", error);
            throw error;
        }
    },
}

export default RatingService;