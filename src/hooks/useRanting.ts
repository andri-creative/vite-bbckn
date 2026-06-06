import { useEffect, useState } from 'react';
import pusher from "@/lib/pusher";
import RatingService from '../services/rating.services';

export interface RatingData {
    star1: number;
    star2: number;
    star3: number;
    star4: number;
    star5: number;
    totalVoters: number;
}

export function useRanting() {
    const [ratings, setRatings] = useState<RatingData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Calculate average rating dynamically
    const averageRating = (() => {
        if (!ratings || ratings.totalVoters === 0) return "0.0";
        const totalScore =
            (ratings.star1 * 1) +
            (ratings.star2 * 2) +
            (ratings.star3 * 3) +
            (ratings.star4 * 4) +
            (ratings.star5 * 5);
        return (totalScore / ratings.totalVoters).toFixed(1);
    })();

    // Helper function to safely extract the rating object from various possible backend response formats
    const extractRating = (payload: any) => {
        if (!payload) return null;
        // If it's wrapped in { data: [...] } or { data: { ... } }
        const actualData = payload.data ? payload.data : payload;
        
        if (Array.isArray(actualData) && actualData.length > 0) {
            return actualData[0];
        } else if (actualData && !Array.isArray(actualData)) {
            return actualData;
        }
        return null;
    };

    useEffect(() => {
        // 1. Fetch initial data from backend API
        RatingService.getAll().then((response: any) => {
            const rating = extractRating(response);
            if (rating) setRatings(rating);
            setIsLoading(false);
        }).catch(err => {
            console.error("Failed to fetch initial ratings", err);
            setIsLoading(false);
        });

        // 2. Initialize Pusher for Realtime events
        const channel = pusher.subscribe('rating-channel');

        channel.bind('rating-updated', (response: any) => {
            console.log('Update Rating Diterima dari Pusher:', response);
            const rating = extractRating(response);
            if (rating) setRatings(rating);
        });

        channel.bind('rating-data', (response: any) => {
            const rating = extractRating(response);
            if (rating) setRatings(rating);
        });

        // Cleanup on unmount
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);

    const submitVote = async (rating: number) => {
        const response = await RatingService.submitVote(rating);
        const newRating = extractRating(response);
        if (newRating) {
            setRatings(newRating);
        }
        return response;
    };

    return { ratings, isLoading, averageRating, submitVote };
}