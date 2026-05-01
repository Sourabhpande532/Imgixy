export interface Album {
    _id: string;
    name: string;
    description: string;
    ownerId: string;
    sharedWith: string[]
}
export interface Image {
    _id: string;
    albumId: string;
    name: string;
    url: string;
    tags: string[];
    person?: string;
    isFavorite: boolean;
    comments: string[];
    size: number;
    uploadedAt: string;
}