
/*
 * 설정
 */

module.exports = {
	server_port: 3000,
	db_url: 'mongodb://test01:123456@ds131099.mlab.com:31099/heroku_37x2b26',
	db_schemas: [
	    {file:'./user_schema', collection:'users', schemaName:'UserSchema', modelName:'UserModel'}
	    ,{file : './post_schema', collection : 'post', schemaName:'PostSchema', modelName:'PostModel'}
	],
	route_info: [
		{file : './post', path : '/process/addpost', method:'addpost', type:'post'}
		,{file : './post', path : '/process/showpost/:id', method :'showpost', type:'get'}
		,{file : './post', path : '/process/listpost', method : 'listpost', type : 'post'}
		,{file : './post', path : '/process/listpost', method : 'listpost', type : 'get'}
	],
	facebook: {		// passport facebook
		clientID: '1442860336022433',
		clientSecret: '13a40d84eb35f9f071b8f09de10ee734',
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	}
};