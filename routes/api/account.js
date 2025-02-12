var express = require('express')
var router = express.Router()

const AccountModel = require('../../models/AccountModel')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const checkTokenMiddleWare = require('../../middlewares/checkTokenMiddleWare')

// 记账本的列表
router.get('/account', checkTokenMiddleWare, async function (req, res, next) {
  try {
    console.log(req.user)
		// 使用 await 获取数据库数据
		const data = await AccountModel.find().sort({ time: -1 })

		// 如果没有数据，给一个提示
		if (data.length === 0) {
			return res.render('list', { accounts: [], msg: '没有记录哦~~~' })
		}

		// 返回接口数据
		res.json({
			code: '0000',
			msg: '读取成功',
			data: data,
		})
	} catch (err) {
		// 其他错误（如数据库查询失败）
		res.json({
			code: '1001',
			msg: '读取失败',
			data: null,
		})
	}
})

// 新增记录
router.post('/account', checkTokenMiddleWare, async (req, res) => {
	try {
		req.body.account = parseFloat(req.body.account)
		req.body.type = parseInt(req.body.type, 10)
		req.body.time = moment(req.body.time).toDate()

		console.log(req.body)

		// 使用async/await并去掉回调函数
		await AccountModel.create(req.body)
		const data = req.body

		// 插入成功后返回响应
		res.json({
			code: '0000',
			msg: '创建成功',
			data: data,
		})
	} catch (err) {
		res.json({
			code: '1002',
			msg: '创建失败',
			data: null,
		})
	}
})

// 删除记录
router.delete('/account/:id', checkTokenMiddleWare, async (req, res) => {
	try {
		let id = req.params.id

		// 使用 deleteOne 来删除指定记录
		await AccountModel.deleteOne({ _id: id })

		// 删除成功后渲染 success 页面
		res.json({
			code: '0000',
			msg: '删除成功',
			data: {},
		})
	} catch (err) {
		// 如果出现错误，发送失败的响应
		res.json({
			code: '1003',
			msg: '删除失败',
			data: null,
		})
	}
})

// 获取单个账单信息
router.get('/account/:id', checkTokenMiddleWare, async (req, res) => {
	let { id } = req.params
	try {
		const data = await AccountModel.findById(id)
		res.json({
			code: '0000',
			msg: '读取成功',
			data: data,
		})
	} catch {
		return res.json({
			code: '1004',
			msg: '读取失败',
			data: null,
		})
	}
})

// 更新单条账单
router.patch('/account/:id', checkTokenMiddleWare, async (req, res) => {
	let { id } = req.params
	try {
		const data = await AccountModel.findByIdAndUpdate(id, req.body, {
			new: true,
		})
		res.json({
			code: '0000',
			msg: '更新成功',
			data: data,
		})
	} catch {
		return res.json({
			code: '1005',
			msg: '更新失败',
			data: null,
		})
	}
})
module.exports = router
