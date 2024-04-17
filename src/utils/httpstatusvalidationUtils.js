function serverError(res) {
    return res.status(500)
        .json({ succes: false, error: 'Server error!' })
}

module.exports = { serverError }