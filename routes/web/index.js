var express = require('express')
var router = express.Router()

const AccountModel = require('../../models/AccountModel')
const moment = require('moment')
// 导入中间件
let checkLoginMiddleWare = require('../../middlewares/checkLoginMiddleWare')

// 记账本的列表
router.get('/account', checkLoginMiddleWare, async function (req, res, next) {
	try {
		// 使用 await 获取数据库数据
		const data = await AccountModel.find().sort({ time: -1 })

		// 如果没有数据，给一个提示
		if (data.length === 0) {
			return res.render('list', { accounts: [], msg: '没有记录哦~~~' })
		}

		// 渲染数据到视图
		return res.render('list', { accounts: data, moment: moment })
	} catch (err) {
		console.error('读取失败:', err)
		res.status(500).send('读取失败~~')
	}
})

// 添加记录
router.get('/account/create', checkLoginMiddleWare, function (req, res, next) {
	res.render('create')
})

// 新增记录
router.post('/account', checkLoginMiddleWare, async (req, res) => {
	try {
		const data = {
			account: parseFloat(req.body.account),
			type: parseInt(req.body.type, 10),
			time: moment(req.body.time).toDate(),
			// 其他字段...
		}
		await AccountModel.create(data)

		// 插入成功后返回响应
		return res.render('success', { msg: '添加成功哦~~~', url: '/account' })
	} catch (err) {
		console.error('插入失败:', err)
		// 添加 return 并返回更清晰的错误信息
		return res.status(500).json({
			code: 500,
			message: '服务器错误，请检查数据格式或联系管理员',
		})
	}
})

// 删除记录
router.get('/account/:id', checkLoginMiddleWare, async (req, res) => {
	try {
		let id = req.params.id

		// 使用 deleteOne 来删除指定记录
		const result = await AccountModel.deleteOne({ _id: id })
		if (result.deletedCount === 0) {
			return res.status(404).send('记录不存在')
		}
		return res.render('success', { msg: '删除成功哦~~~', url: '/account' })
	} catch (err) {
		// 如果出现错误，发送失败的响应
		res.status(500).send('删除失败~~')
	}
})

module.exports = router
