const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')
function authController() {
	const _getRedirectUrl = (req) => {
		return req.user.role === 'admin' ? '/admin/orders' : '/'
	}

	return {
		login(req, res) {
			res.render('auth/login')
		},
		postLogin(req, res, next) {
			const { email, password, source } = req.body

			// Validate request

			if (source === 'site') {
				if (!email || !password) {
					req.flash('error', 'Todos os campos são obrigatórios')
					req.flash('email', email)

					return res.redirect('/login')
				}

				passport.authenticate('local', (err, user, info) => {
					if (err) {
						req.flash('error', info.message)
						return next(err)
					}
					if (!user) {
						req.flash('error', info.message)

						return res.redirect('/login')
					}
					req.logIn(user, (err) => {
						if (err) {
							req.flash('error', info.message)

							return next(err)
						}

						return res.redirect(_getRedirectUrl(req))
					})
				})(req, res, next)

				return
			}

			if (!email || email == undefined || !password) {
				res.status(401).send({ message: 'Por favor confira o email/senha' })
				return
			}

			passport.authenticate('local', (err, user, info) => {
				if (err) {
					res.status(401).send({ message: info.message })
				}
				req.logIn(user, (err) => {
					if (err) {
						res.status(401).send({ message: info.message })
					}
				})
			})(req, res, next)

			res.status(200).send({ message: 'ok' })
		},

		register(req, res) {
			res.render('auth/register')
		},
		async postRegister(req, res) {
			const { username, email, password, phone } = req.body
			// Validate request
			if (!username || !email || !password || !phone) {
				req.flash('error', 'Todos os campos são obrigatórios')
				req.flash('username', username)
				req.flash('phone', phone)
				req.flash('email', email)

				return res.redirect('/register')
			}

			// Check if email exists
			await User.exists({ email: email }, (err, result) => {
				if (result) {
					req.flash('error', 'Este email já está cadastrado')
					req.flash('username', username)
					req.flash('phone', phone)
					req.flash('email', email)
					return res.redirect('/register')
				}
			})

			// Hash password
			const hashedPassword = await bcrypt.hash(password, 10)
			// Create a user
			const user = new User({
				username,
				email,
				phone,
				password: hashedPassword,
			})

			user
				.save()
				.then((user) => {
					// Login
					return res.redirect('/')
				})
				.catch((err) => {
					req.flash('error', 'Algo deu errado, tente novamente')
					return res.redirect('/register')
				})
		},
		logout(req, res) {
			delete req.session.cart
			req.logout()
			return res.redirect('/login')
		},
	}
}

module.exports = authController
