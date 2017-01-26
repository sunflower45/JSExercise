
/*
 * 라우팅하여 실행될 포스팅 글 관련 함수들 정의
 * 
 * 데이터베이스 관련 객체들을 req.app.get('database')로 참조
 * 
 */

// html-entities module is required in showpost.ejs
var Entities = require('html-entities').AllHtmlEntities;
var express = require('express');
var app = express();

var addpost = function(req, res) {
	console.log('post 모듈 안에 있는 addpost 호출됨.');

	var paramTitle = req.param('title');
	var paramContents = req.param('contents');
	var paramWriter = req.param('writer');
	
	var database = req.app.get('database');
	
	
	if (database.db) {
		
		// 1. 아이디를 이용해 사용자 검색
		database.UserModel.findByEmail(paramWriter, function(err, results) {
			if (err) { throw err; }

			if (results == undefined || results.length < 1) {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 [' + paramWriter + ']를 찾을 수 없습니다.</h2>');
				res.end();
				
				return;
			}
			
			var userObjectId = results[0]._doc._id;
			console.log('사용자 ObjectId : ' + paramWriter +' -> ' + userObjectId);
			
			// save()로 저장
			// PostModel 인스턴스 생성
			var post = new database.PostModel({
				title: paramTitle,
				contents: paramContents,
				writer: userObjectId
			});

			post.savePost(function(err, result) {
				if (err) { throw err; }
				
			    console.log("글 데이터 추가함.");
			    console.log('글 작성', '포스팅 글을 생성했습니다. : ' + post._id);
			    
			    return res.redirect('/process/showpost/' + post._id); 
			    //return res.redirect('/process/showpost/1'); 
			});
			
		});
		
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
	
};

var listpost = function(req, res) {
	console.log('post 모듈 안에 있는 listpost 호출됨.');
 
	var paramPage = req.param('page');
	var paramPerPage = req.param('perPage');
	
	var database = req.app.get('database');
	
	if (database.db) {
		// 1. 글 리스트
		var options = {
			page: paramPage,
			perPage: paramPerPage
		}
		
		database.PostModel.list(options, function(err, results) {
			if (err) { throw err; }
			
			if (results) {
				console.dir(results);
 
				// 전체 문서 객체 수 확인
				database.PostModel.count().exec(function(err, count) {

					res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
					
					// 뷰 템플레이트를 이용하여 렌더링한 후 전송
					var context = {
						title: '글 목록',
						posts: results,
						page: parseInt(paramPage),
						pageCount: Math.ceil(count / paramPerPage),
						perPage: paramPerPage, 
						totalRecords: count,
						size: paramPerPage
					};
					
					req.app.render('listpost', context, function(err, html) {
						res.end(html);
					});
					
				});
				
			} else {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>글 목록 조회  실패</h2>');
				res.end();
			}
		});
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
	
};


var showpost = function(req, res) {
	console.log('post 모듈 안에 있는 showpost 호출됨.');
 
	var paramId = req.param('id');		// 글 ID
	console.log('전달받은 id : ' + paramId);
	
	var database = req.app.get('database');
	
	if (database.db) {
		// 1. 글 리스트
		database.PostModel.load(paramId, function(err, results) {
			if (err) { throw err; }
			
			if (results) {
				console.dir(results);
  
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				
				// 뷰 템플레이트를 이용하여 렌더링한 후 전송
				var context = {
					title: '글 조회 ',
					posts: results,
					Entities: Entities
				};
				
				req.app.render('showpost', context, function(err, html) {
					if (err) { throw err; }
					
					console.log('응답 웹문서 : ' + html);
					res.end(html);
				});
			 
			} else {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>글 조회  실패</h2>');
				res.end();
			}
		});
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
	
};

module.exports.listpost = listpost;
module.exports.addpost = addpost;
module.exports.showpost = showpost;
