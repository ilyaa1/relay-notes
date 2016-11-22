export class User {
    constructor (id, name, avatarImageUrl) {
        this.id = id;
        this.name = name;
        this.avatarImageUrl = avatarImageUrl;
    }
}

export class Note {
    static nextNoteId = 0;
    
    static STATUS = {
        ACTIVE: 'active',
        DELETED: 'deleted'
    };
    
    constructor (text, status = Note.STATUS.ACTIVE) {
        this.id = `${Note.nextNoteId++}`;
        this.text = text;
        this.status = status;
        this.createdTimeStamp = this.updatedTimeStamp = new Date().getTime();
        
        console.log(this.id, this.text, this.createdTimeStamp);
    }
    
    update (text, status = Note.STATUS.ACTIVE) {
        this.text = text;
        this.status = status;
        this.updatedTimeStamp = new Date().getTime();
    }
}

export class NoteComment {}

const VIEWER_ID = 'ilya';

var viewer = new User(VIEWER_ID, 'Anonymous', 'https://www.b1g1.com/assets/admin/images/no_image_user.png');

const usersById = {
    [VIEWER_ID]: viewer
};

const notesById = {};

const noteIdsByUser = {
    [VIEWER_ID]: []
};

export const getNote = id => notesById[id];

export const getNotesByUserId = userId => noteIdsByUser[userId].map(id => notesById[id]);

export const getNotes = (status = 'any') =>
    getNotesByUserId(VIEWER_ID)
        .filter(note => status === 'any' || note.status === (status === 'deleted'));

export const addNote = (text) => {
    const note = new Note(text);
    
    notesById[note.id] = note;
    noteIdsByUser[VIEWER_ID].push(note.id);
    
    return note.id;
};

export const updateNote = (id, text, status = Note.STATUS.ACTIVE) => {
    getNote(id).update(text, status);
};

// TODO change note status field instead
export const removeNote = (id) => {
    const noteIdx = noteIdsByUser[VIEWER_ID].indexOf(id);
    
    if (noteIdx !== -1) {
        noteIdsByUser[VIEWER_ID].splice(noteIdx, 1);
    }
    
    delete notesById[id];
};

export const removeAllNotes = () => {
    noteIdsByUser[VIEWER_ID] = [];
    Object.keys(notesById).forEach(id => delete notesById[id]);
};

export const getUser = id => usersById[id];

export const getViewer = () => getUser(VIEWER_ID);
