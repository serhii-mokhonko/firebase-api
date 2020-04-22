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
            WRITETODB: "The information is not recorded to the database",
            NOT_DELETE: "File can't delete or file doesn't exist",
            GET_DATA: "Can't get data or data doesn't exist"
        },
        NEWS: {
            NOT_FOUND: "Can't get list of records",
            ITEM_NOT_FOUND: 'Record not found',
            PARAMS_NOT_SET: "Set right params for query",
            OUT_OF_RANGE: "Params out of range",
            FIELDS_EMPTY: "Title or content of record are empty",
            GET_DATA: "Can't get records or data doesn't exist"
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
            WRITETODB: "The information successfully has written to database",
            DELETED: "File deleted"
        },
        NEWS: {
            CREATED: 'Record successfully created',
            EDITED: 'Record successfully updated',
            DELETED: "Record successfully deleted",
        }
    }
};

exports.RESPONSE_MESSAGES  = RESPONSE_MESSAGES;