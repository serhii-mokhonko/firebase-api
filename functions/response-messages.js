const RESPONSE_MESSAGES = {
    REJECT: {
        PAGES: {
            NOT_FOUND: 'Pages not found',
            FIELDS_EMPTY: 'Title or page body is required',
            NOT_CREATED: 'Page not created',
            KEY_REQUIRED: 'Key is required',
            KEY_NOT_FOUND: 'Key not found',
            ERRORUSER: 'User does not exist'
        }
    },
    SUCCESS: {
        PAGES: {
            CREATED: 'Page successfully created',
            DELETED: 'Page successfully deleted',
            EDITED: 'Page successfully updated'
        }
    }
};

exports.RESPONSE_MESSAGES  = RESPONSE_MESSAGES;