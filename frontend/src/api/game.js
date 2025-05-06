import axiosInstance from "../utils/axios";

export const getCurrentScoreAsync   = async () => {
    try {
        const response = await axiosInstance.get("/game/get-current-score")
        if (response) {
            return response.data.currentScore;
        }
    } catch (error) {
        throw error;
    }
}

export const getRankAsync = async () => {
    try {
        const response = await axiosInstance.get("/game/get-current-rank");
        if (response) {
            return response.data.rank;
        }
    } catch (error) {
        throw error;
    }
}