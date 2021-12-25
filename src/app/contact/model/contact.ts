export interface PageInfo {
    totalItems: number,
    totalPages: number,
    currentPage: number,
    contacts: Contact[]
}

export interface Contact {
    id: number,
    firstName: string,
    lastName: string,
    fullName: string
}

export interface ContactEntity extends Contact {
    phone: string,
    notes: string,
    createdOn: Date,
    updatedOn: Date
}

export interface Comment {
    id: number,
    text: string,
    user: string,
    timestamp: Date
}

export interface IdentifiedEntity {
    id: number,
    entityType: string,
    name: string
}

export interface ContactDetails extends ContactEntity {
    comments: Comment[],
    identifiedEntities: IdentifiedEntity[]
}
