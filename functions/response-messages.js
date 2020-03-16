const RESPONSE_MESSAGES = {
    REJECT: {
        PAGES: {
            NOT_FOUND: 'Pages not found',
            FIELDS_EMPTY: 'Title or page body is required',
            NOT_CREATED: 'Page not created',
            KEY_REQUIRED: 'Key is required',
            KEY_NOT_FOUND: 'Key not found',
            ERRORUSER: 'User does not exist'
        },
        AUTH: {
            ERROREMAILORPASS: "Email and password are required",
            NOT_CREATED: "User can't be created",
            USER_EXISTS: "User with this email exists"
        }
    },
    SUCCESS: {
        PAGES: {
            CREATED: 'Page successfully created',
            DELETED: 'Page successfully deleted',
            EDITED: 'Page successfully updated'
        },
        AUTH: {
            CREATED: "User successfully created"
        }
    }
};

exports.RESPONSE_MESSAGES  = RESPONSE_MESSAGES;