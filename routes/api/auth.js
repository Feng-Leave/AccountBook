var express = require('express')
var router = express.Router()
const UserModel = require('../../models/UserModel')
const jwt = require('jsonwebtoken')
const md5 = require('md5')
const { secret } = require('../../config/config')

// 登录操作
router.post('/login', async (req, res) => {
	try {
		let { username, password } = req.body
		const user = await UserModel.findOne({
			username: username,
			password: md5(password),
		})
		if (!user) {
			return res.json({
				code: '2002',
				msg: '用户名或密码错误~~',
				data: null,
			})
		}
		let token = jwt.sign(
			{
				username: user.username,
				_id: user._id,
			},
			secret,
			{
				expiresIn: 60 * 60 * 24 * 7,
			}
		)
		return res.json({
			code: '0000',
			msg: '登录成功',
			data: token,
		})
	} catch (err) {
		return res.json({
			code: '2001',
			msg: '数据库读取错误~~',
			data: null,
		})
	}
})

// 退出登录
router.post('/logout', async (req, res) => {
	await req.session.destroy(() => {
		return res.render('success', { msg: '退出成功', url: 'login' })
	})
})
module.exports = router
