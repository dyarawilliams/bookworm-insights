import React from 'react';
import { Dialog } from '@progress/kendo-react-dialogs';
import { Button } from '@progress/kendo-react-buttons';

const BookDetails = ({ book, isOpen, onClose, isInLibrary, onAddToLibrary, onRemoveFromLibrary }) => {
    if (!book) return null;

    return (
        <Dialog
            title={book.title}
            onClose={onClose}
            width={700}
            height={500}
            visible={isOpen}
        >
            <div className="book-details">
                <div className="book-cover">
                    {book.thumbnail ? (
                        <img
                            src={book.thumbnail}
                            alt={`Cover of ${book.title}`}
                            className="book-thumbnail"
                        />
                    ) : (
                        <div className="no-cover">No Cover Available</div>
                    )}

                    <div className="book-metrics">
                        <p><strong>Rating:</strong> {book.averageRating ?
                            `${book.averageRating}/5` : 'Not rated'}</p>
                        <p><strong>Pages:</strong> {book.pageCount || 'Unknown'}</p>
                        <p><strong>Published:</strong> {book.publishedDate}</p>
                        <p><strong>Language:</strong> {book.language}</p>
                    </div>
                </div>

                <div className="book-info">
                    <h3>By {book.authors}</h3>
                    <p><strong>Categories:</strong> {book.categories?.join(', ') || 'Uncategorized'}</p>
                    <div className="book-description">
                        <h4>Description</h4>
                        <p>{book.description}</p>
                    </div>
                </div>

                <div className="dialog-buttons">
                    {!isInLibrary ? (
                        <Button
                            themeColor="primary"
                            onClick={() => {
                                onAddToLibrary(book);
                                onClose();
                            }}
                            aria-label={`Add ${book.title} to library`}
                        >
                            Add to Library
                        </Button>
                    ) : (
                        <Button
                            themeColor="error"
                            onClick={() => {
                                onRemoveFromLibrary(book.id);
                                onClose();
                            }}
                            aria-label={`Remove ${book.title} from library`}
                        >
                            Remove from Library
                        </Button>
                    )}
                    <Button onClick={onClose} aria-label="Close book details">Close</Button>
                </div>
            </div>
        </Dialog>
    );
};

export default BookDetails;