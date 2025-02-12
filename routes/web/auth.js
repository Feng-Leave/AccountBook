var express = require('express')
var router = express.Router()
const UserModel = require('../../models/UserModel')
const md5 = require('md5')

// 注册见面渲染
router.get('/reg', async (req, res) => {
	await res.render('auth/reg')
})

// 注册用户
router.post('/reg', async (req, res) => {
	try {
		await UserModel.create({ ...req.body, password: md5(req.body.password) })
		res.render('success', { msg: '注册成功', url: '/login' })
	} catch {
		res.status(500).send('注册失败，请稍后再试~~')
	}
})

// 登录界面渲染
router.get('/login', async (req, res) => {
	await res.render('auth/login')
})

// 登录操作
router.post('/login', async (req, res) => {
	try {
		let { username, password } = req.body
		const user = await UserModel.findOne({
			username: username,
			password: md5(password),
		})
		if (!user) {
			return res.status(500).send('用户名或密码错误~~')
		}
		// 写入session
		req.session.username = user.username
		req.session._id = user._id

		return res.render('success', { msg: '登录成功', url: '/account' })
	} catch (err) {}
	return res.status(500).send('登录失败，请稍候再试~~')
})

// 退出登录
router.post('/logout', async (req, res) => {
	await req.session.destroy(() => {
		return res.render('success', { msg: '退出成功', url: 'login' })
	})
})
module.exports = router
