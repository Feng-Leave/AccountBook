var express = require('express')
var router = express.Router()

// 导入lowdb
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync(__dirname + '/../data/db.json')
// 读取lowdb对象
const db = low(adapter)

// 导入shortid
const shortid = require('shortid')
const AccountModel = require('../models/AccountModel')
const moment = require('moment')

// 记账本的列表
router.get('/account', async function (req, res, next) {
	try {
		// 使用 await 获取数据库数据
		const data = await AccountModel.find().sort({ time: -1 })

		// 如果没有数据，给一个提示
		if (data.length === 0) {
			return res.render('list', { accounts: [], msg: '没有记录哦~~~' })
		}

		// 渲染数据到视图
		res.render('list', { accounts: data, moment: moment })
	} catch (err) {
		console.error('读取失败:', err)
		res.status(500).send('读取失败~~')
	}
})


// 添加记录
router.get('/account/create', function (req, res, next) {
	res.render('create')
})

// 新增记录
router.post('/account', async (req, res) => {
	try {
		req.body.account = parseFloat(req.body.account)
		req.body.type = parseInt(req.body.type, 10)
		req.body.time = moment(req.body.time).toDate()

		console.log(req.body)

		// 使用async/await并去掉回调函数
		await AccountModel.create(req.body)

		// 插入成功后返回响应
		res.render('success', { msg: '添加成功哦~~~', url: '/account' })
	} catch (err) {
		console.error('插入失败:', err)
		res.status(500).send('插入失败~~')
	}
})

// 删除记录
router.get('/account/:id', async (req, res) => {
	try {
		let id = req.params.id

		// 使用 deleteOne 来删除指定记录
		await AccountModel.deleteOne({ _id: id })

		// 删除成功后渲染 success 页面
		res.render('success', { msg: '删除成功哦~~~', url: '/account' })
	} catch (err) {
		// 如果出现错误，发送失败的响应
		res.status(500).send('删除失败~~')
	}
})


module.exports = router
