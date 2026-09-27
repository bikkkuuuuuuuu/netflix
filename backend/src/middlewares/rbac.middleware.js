const allowRole = (role) => {
    return (req, res, next) => {
        try {
            let loggedInUserRole = req.authUser.role
            if (!loggedInUserRole) {
                throw { code: 403, message: "Role is not assigned to user", status: "ROLE_NOT_ASSIGNED" }
            }
            if ((typeof role === 'string' && loggedInUserRole === role) ||
                (Array.isArray(role) && role.includes(loggedInUserRole))
            ) {
                next()
            }
            else {
                throw {
                    code: 403, message: "Access denied", status: "PERMISSION_DENIED"
                }
            }

        } catch (exception) {
            console.log("RBAC middleware exception : ", exception);
            next(exception)
        }
    }
}
module.exports = {
    allowRole
}