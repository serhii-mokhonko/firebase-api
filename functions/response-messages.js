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
            USERS_LIST: "Can't get list of users",
            NOT_DELETE: "Can't delete this user",
            NOT_UPDATE: "Sorry! Can't update user.",
            LENGTH_OF_PASS: "Password must contain minimum 6 characters"
        },
        GALLERY: {
            NOT_FILE: 'File does not exist',
            WRITETODB: "The information is not recorded to the database"
        }
    },
    SUCCESS: {
        PAGES: {
            CREATED: 'Page successfully created',
            DELETED: 'Page successfully deleted',
            EDITED: 'Page successfully updated'
        },
        AUTH: {
            CREATED: "User successfully created",
            DELETED: "User successfully deleted",
            UPDATED: "User successfully updated"
        },
        GALLERY: {
            UPLOADED: 'File uploaded',
            WRITETODB: "The information successfully has written to database"
        }
    }
};

exports.RESPONSE_MESSAGES  = RESPONSE_MESSAGES;