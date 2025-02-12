const jwt = require('jsonwebtoken')
const { secret } = require('../config/config')

module.exports = (req, res, next) => {
	try {
		let token = req.get('token')
		if (!token) {
			return res.json({
				code: '2003',
				msg: 'token缺失',
				data: null,
			})
		}
		// 校验token
    const decoded = jwt.verify(token, secret)
    
    req.user = decoded
		// 校验成功
		next()
	} catch (err) {
		// Token 相关错误
		return res.json({
			code: '2004',
			msg: 'token校验失败',
			data: null,
		})
	}
}
