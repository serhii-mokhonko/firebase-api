const RESPONSE_MESSAGES = {
    REJECT: {
        ERROREMAILORPASS: "Email and password are required",
        NOT_CREATED: "User can't be created",
        USERS_LIST: "Can't get list of users",
        NOT_DELETE: "Can't delete this user",
        NOT_UPDATE: "Sorry! Can't update user.",
        LENGTH_OF_PASS: "Password must contain minimum 6 characters"
    },
    SUCCESS: {
        CREATED: "User successfully created",
        DELETED: "User successfully deleted",
        UPDATED: "User successfully updated"
    }
};

exports.RESPONSE_MESSAGES = RESPONSE_MESSAGES;