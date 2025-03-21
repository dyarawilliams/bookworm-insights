// src/services/bookService.js
import axios from 'axios';

const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

const booksApi = {
    searchBooks: async (query, maxResults = 20) => {
        try {
            const response = await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${API_KEY}`
            );

            if (!response.data.items) {
                return [];
            }

            return response.data.items.map(item => ({
                id: item.id,
                title: item.volumeInfo.title || 'Unknown Title',
                authors: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown Author',
                publishedDate: item.volumeInfo.publishedDate || 'Unknown Date',
                thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
                description: item.volumeInfo.description || 'No description available',
                categories: item.volumeInfo.categories || ['Uncategorized'],
                pageCount: item.volumeInfo.pageCount || 0,
                averageRating: item.volumeInfo.averageRating || 0,
                language: item.volumeInfo.language || 'Unknown'
            }));
        } catch (error) {
            console.error('Error searching books:', error);
            throw error;
        }
    },

    getBookById: async (bookId) => {
        try {
            const response = await axios.get(
                `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API_KEY}`
            );

            const item = response.data;
            return {
                id: item.id,
                title: item.volumeInfo.title || 'Unknown Title',
                authors: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown Author',
                publishedDate: item.volumeInfo.publishedDate || 'Unknown Date',
                thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
                description: item.volumeInfo.description || 'No description available',
                categories: item.volumeInfo.categories || ['Uncategorized'],
                pageCount: item.volumeInfo.pageCount || 0,
                averageRating: item.volumeInfo.averageRating || 0,
                language: item.volumeInfo.language || 'Unknown'
            };
        } catch (error) {
            console.error('Error fetching book details:', error);
            throw error;
        }
    }
};

export default booksApi;