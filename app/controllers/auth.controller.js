
exports.auth = {
    login: (req, res) => {
        const { email, password } = req.body;

    },
    register: (req, res) => {
        res.send('register ok');
    },
    verify: (req, res) => {
        res.send('verify ok');
    },
    refresh: (req, res) => {
        res.send('refresh ok');
    },
    logout: (req, res) => {
        res.send('logout ok');
    }
};