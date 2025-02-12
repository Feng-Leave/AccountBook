const jwt = require('jsonwebtoken')

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
		jwt.verify(token, 'likerain')
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
