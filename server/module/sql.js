/**
 * Created by Administrator on 2017/9/22.
 */
var sql={


    //完善信息


    //获取文章专题 <theme>
    //getArticalTheme:"select category_id,categoryname,head from category limit 0,9",
    // getArticalAllTheme:"select category_id,categoryname,head,introduce from category",

    //保存文章  blog_id,title,content,user_id,created_at,category_id
    //saveArtical:"INSERT INTO blog VALUES ('null',?,?,?,?,?,?)",

    //获取文章细节
    // getArticalDetail:"select a.size,IF(a.nickname is null,'雷锋',a.nickname) as nickname,a.blog_id as blog_id,a.title as title,a.blo_time as time,a.content as content,a.categoryname as categoryname,IF(a.head is null,'888888.jpg',a.head) as head,a.userid as userid,IF(com_like.com_num is null,0,com_like.com_num) as com_num,IF(com_like.lik_num is null,0,com_like.lik_num) as lik_num from(select blog_id,title,blo_cat.created_at as blo_time,content,categoryname,head,peo.userid as userid,size,peo.nickname as nickname from(select blog_id,title,created_at,content,categoryname,user_id,size from blog blo join category cat on blo.category_id=cat.category_id) blo_cat join user  peo on blo_cat.user_id=peo.userid) as a left join(select lik.blog_id as blog_id,lik.lik_num,com.com_num from(select count(*) as lik_num,blog_id from jianshu2.like GROUP BY blog_id) lik JOIN(select count(*) as com_num,blog_id from jianshu2.comment GROUP BY blog_id) com on lik.blog_id=com.blog_id) as com_like on a.blog_id=com_like.blog_id order by time desc limit 0,?",
        getArticalDetail:"select a.size,a.category_id,IF(a.nickname is null,'雷锋',a.nickname) as nickname,a.blog_id as blog_id,a.title as title,a.blo_time as time,a.content as content,a.categoryname as categoryname,IF(a.head is null,'888888.jpg',a.head) as head,a.userid as userid,IF(com_like.com_num is null,0,com_like.com_num) as com_num,IF(com_like.lik_num is null,0,com_like.lik_num) as lik_num from(select blog_id,title,blo_cat.created_at as blo_time,category_id,content,categoryname,head,peo.userid as userid,size,peo.nickname as nickname from(select blog_id,title,created_at,content,categoryname,blo.category_id,user_id,size from blog blo join category cat on blo.category_id=cat.category_id) blo_cat join user  peo on blo_cat.user_id=peo.userid) as a left join(select lik.blog_id as blog_id,lik.lik_num,com.com_num from(select count(*) as lik_num,blog_id from jianshu2.like GROUP BY blog_id) lik JOIN(select count(*) as com_num,blog_id from jianshu2.comment GROUP BY blog_id) com on lik.blog_id=com.blog_id) as com_like on a.blog_id=com_like.blog_id order by a.blog_id desc limit 0,?",



    //---------------------添加,删除关注------------------
    addFollow:"insert into follow(following,followed) values(?,?)",
    delFollow:'delete from follow where following=? and followed=?',

    //添加删除喜欢
    addLike:"insert into jianshu2.like(user_id,blog_id) values(?,?)",
    delLike:"delete from jianshu2.like where user_id=? and blog_id=?",
    judgeLike:"select * from jianshu2.like where user_id=? and blog_id=?",

    //根据文章的blogid查看该用户是否关注过该文章的作者
    searchBlogAuthorFollow:"select * from follow WHERE following=? and followed=(select user_id from blog where blog_id=?)",

    //判断该用户是否已经关注过该作者
    judgeFollow:"select * from follow where following=? and followed=?",

    //获取单篇文章中作者的详细信息
   // getSingleArticalUserIfo:"SELECT nickname,userid ,head,IF(introduce is null,'',introduce) as introduce,IF(fans_count is null,0,fans_count) as fans,sum(size) as size,sum(like_count) as lik_num FROM (SELECT `user`.userid,`user`.head, `user`.nickname,`user`.introduce,blog.blog_id,blog.size, count(distinct `like`.like_id) as like_count,COUNT(DISTINCT follow.follow_id) AS fans_count FROM blog LEFT JOIN `like` ON blog.blog_id = `like`.blog_id LEFT JOIN `user` ON blog.user_id = `user`.userid LEFT JOIN follow ON `user`.userid = `follow`.followed WHERE `user`.userid=? GROUP BY blog.blog_id ,follow.followed ) p GROUP BY userid",


     // "SELECT nickname,userid ,head,sum(size) as size,sum(like_count) as lik_num FROM (SELECT `user`.userid,`user`.head, `user`.nickname,blog.blog_id,blog.size, count(distinct `like`.like_id) as like_count FROM blog LEFT JOIN `like` ON blog.blog_id = `like`.blog_id LEFT JOIN `category` ON blog.category_id = `category`.category_id LEFT JOIN `user` ON blog.user_id = `user`.userid GROUP BY blog.blog_id) p GROUP BY userid limit 0,18",

    /*
    //home页面的推荐作者，未登录状态<home>
    recommendAuthorHome:"SELECT nickname ,userid,head,sum(size) as size,sum(like_count) as sum_like FROM (SELECT `user`.userid,`user`.head, `user`.nickname,blog.blog_id,blog.size, count(distinct `like`.like_id) as like_count FROM blog LEFT JOIN `like` ON blog.blog_id = `like`.blog_id LEFT JOIN `category` ON blog.category_id = `category`.category_id LEFT JOIN `user` ON blog.user_id = `user`.userid GROUP BY blog.blog_id) p GROUP BY userid order by sum_like desc limit 0,? ",
    //登录后推荐的 <home>
    recommendAuthorHomeLogin:"SELECT nickname ,userid,head,sum(size) as size,sum(like_count) as sum_like FROM (SELECT `user`.userid,`user`.head, `user`.nickname,blog.blog_id,blog.size, count(distinct `like`.like_id) as like_count FROM blog LEFT JOIN `like` ON blog.blog_id = `like`.blog_id LEFT JOIN `category` ON blog.category_id = `category`.category_id LEFT JOIN `user` ON blog.user_id = `user`.userid where `user`.userid  not in (select followed from follow where following=?) GROUP BY blog.blog_id) p GROUP BY userid order by sum_like desc limit 0,?",
    */

    //获取单个目录的文章
    getSingleCategoryArtical:"SELECT blog.*,`user`.nickname AS author,`user`.head,category.categoryname, count(distinct `like`.like_id) as like_count,count(distinct `comment`.comment_id) as comment_count FROM blog LEFT JOIN `like` ON blog.blog_id = `like`.blog_id LEFT JOIN `category` ON blog.category_id = `category`.category_id LEFT JOIN `user` ON blog.user_id = `user`.userid LEFT JOIN `comment` ON blog.blog_id=`comment`.blog_id where category.category_id=? GROUP BY blog.blog_id ORDER BY blog.created_at desc limit ?,8",


    //获取关注人所写的所有文章
    getConcrenAuthorArtical:"SELECT blog.*,`user`.nickname AS author, category.categoryname,count(distinct `like`.like_id) as like_count,`user`.head,COUNT(DISTINCT `comment`.comment_id) AS comment_count FROM blog LEFT JOIN `like` ON blog.blog_id = `like`.blog_id LEFT JOIN `category` ON blog.category_id = `category`.category_id LEFT JOIN `user` ON blog.user_id = `user`.userid LEFT JOIN `comment` ON `comment`.blog_id=blog.blog_id WHERE `user`.userid IN ( SELECT `follow`.followed FROM`follow` WHERE follow.following=? GROUP BY `follow`.followed) GROUP BY blog.blog_id ,`comment`.blog_id limit 0,?",


    //获取用户关注的所有作者的所有文章
    getConcrenAuthorAllArtical:"SELECT blog.*,`user`.nickname AS author,`user`.head as head, category.categoryname, count(distinct `like`.like_id) as like_count,COUNT(DISTINCT `comment`.comment_id) AS comment_count FROM blog LEFT JOIN `like` ON blog.blog_id = `like`.blog_id LEFT JOIN `category` ON blog.category_id = `category`.category_id LEFT JOIN `user` ON blog.user_id = `user`.userid LEFT JOIN `comment` ON `comment`.blog_id=blog.blog_id WHERE `user`.userid IN ( SELECT `follow`.followed FROM`follow` WHERE follow.following=? GROUP BY `follow`.followed) GROUP BY blog.blog_id ,`comment`.blog_id limit 0,?",

    //模糊搜索相关用户
    searchUser:"SELECT nickname ,userid,introduce,head,sum(size),sum(distinct like_count) FROM ( SELECT blog.blog_id,blog.size,COUNT(DISTINCT `like`.like_id) AS like_count,`user`.* from `user` LEFT JOIN blog ON blog.user_id=`user`.userid LEFT JOIN `like` ON `like`.blog_id=blog.blog_id WHERE `user`.nickname like %?% GROUP BY blog.blog_id) p GROUP BY userid limit 0,?",

    //模糊搜索相关文章
    searchArtical:"SELECT blog.*,`user`.nickname AS author, category.categoryname, count(distinct `like`.like_id) as like_count,COUNT(DISTINCT `comment`.comment_id) AS comment_count FROM blog LEFT JOIN `like` ON blog.blog_id = `like`.blog_id LEFT JOIN `category` ON blog.category_id = `category`.category_id LEFT JOIN `user` ON blog.user_id = `user`.userid LEFT JOIN `comment` ON `comment`.blog_id=blog.blog_id WHERE blog.title like ? GROUP BY blog.blog_id ,`comment`.blog_id limit 0,?",

    //模糊搜索相关专题
    searchCategory:"SELECT * FROM category WHERE categoryname like %?% limit 0,5",


    //------------------- 主页---------------
        //文章 获取文章的显示样式
    //getArtical:"select a.size,a.category_id,IF(a.nickname is null,'雷锋',a.nickname) as nickname,a.blog_id as blog_id,a.title as title,a.blo_time as time,a.content as content,a.categoryname as categoryname,IF(a.head is null,'888888.jpg',a.head) as head,a.userid as userid,IF(com_like.com_num is null,0,com_like.com_num) as com_num,IF(com_like.lik_num is null,0,com_like.lik_num) as lik_num from(select blog_id,title,blo_cat.created_at as blo_time,category_id,content,categoryname,head,peo.userid as userid,size,peo.nickname as nickname from(select blog_id,title,created_at,content,categoryname,blo.category_id,user_id,size from blog blo join category cat on blo.category_id=cat.category_id) blo_cat join user  peo on blo_cat.user_id=peo.userid) as a left join(select lik.blog_id as blog_id,lik.lik_num,com.com_num from(select count(*) as lik_num,blog_id from jianshu2.like GROUP BY blog_id) lik JOIN(select count(*) as com_num,blog_id from jianshu2.comment GROUP BY blog_id) com on lik.blog_id=com.blog_id) as com_like on a.blog_id=com_like.blog_id order by a.blog_id desc limit ?,6",
    //getArtical:"select d.blog_id,d.size,d.created_at,d.title,d.content,d.category_id,d.head,d.nickname,d.userid,if(c.com_num is null,0,c.com_num) as com_num,if(c.lik_num is null,0,c.lik_num) as lik_num from(select blog.blog_id,blog.size,blog.created_at,blog.title,blog.content,blog.category_id,`user`.head,`user`.nickname,`user`.userid from blog join user on `user`.userid=blog.user_id) d   left join(select a.blog_id,com_num,lik_num from (select if(count(*) is null,0,count(*)) as com_num,blog_id from comment group by blog_id) a join (select if(count(*) is null,0,count(*)) as lik_num,`like`.blog_id from jianshu2.like group by `like`.blog_id) b on a.blog_id=b.blog_id)c on d.blog_id=c.blog_id order by d.blog_id desc limit ?,6",
    getArtical:"select  d.categoryname,d.blog_id,d.size,d.created_at,d.title,d.content,d.category_id,d.head,d.nickname,d.userid,if(c.com_num is null,0,c.com_num) as com_num,if(c.lik_num is null,0,c.lik_num) as lik_num from(select d.blog_id,d.size,d.created_at,d.title,d.content,d.category_id,d.userid,d.nickname,d.head,f.categoryname from(select blog.blog_id,blog.size,blog.created_at,blog.title,blog.content,blog.category_id,`user`.head,`user`.nickname,`user`.userid from blog join user on `user`.userid=blog.user_id) as d LEFT JOIN category f on f.category_id=d.category_id) as d left join(select a.blog_id,com_num,lik_num from(select if(count(*) is null,0,count(*)) as com_num,blog_id from comment group by blog_id) a join(select if(count(*) is null,0,count(*)) as lik_num,`like`.blog_id from jianshu2.like group by `like`.blog_id) b on a.blog_id=b.blog_id) as c on d.blog_id=c.blog_id order by d.blog_id desc limit ?,6",
        //主题
    getArticalTheme:"select category_id,categoryname,head from category limit 0,9",
        //推荐作者
    recommendAuthorHome:"SELECT nickname ,userid,head,sum(size) as size,sum(like_count) as sum_like FROM (SELECT `user`.userid,`user`.head, `user`.nickname,blog.blog_id,blog.size, count(distinct `like`.like_id) as like_count FROM blog LEFT JOIN `like` ON blog.blog_id = `like`.blog_id LEFT JOIN `category` ON blog.category_id = `category`.category_id LEFT JOIN `user` ON blog.user_id = `user`.userid GROUP BY blog.blog_id) p GROUP BY userid order by sum_like desc limit ?,5",
        //登录后推荐的
    recommendAuthorHomeLogin:"SELECT nickname ,userid,head,sum(size) as size,sum(like_count) as sum_like FROM (SELECT `user`.userid,`user`.head, `user`.nickname,blog.blog_id,blog.size, count(distinct `like`.like_id) as like_count FROM blog LEFT JOIN `like` ON blog.blog_id = `like`.blog_id LEFT JOIN `category` ON blog.category_id = `category`.category_id LEFT JOIN `user` ON blog.user_id = `user`.userid where `user`.userid  not in (select followed from follow where following=?) GROUP BY blog.blog_id) p GROUP BY userid order by sum_like desc limit ?,5",

    //-----------------登录，注册，记住密码登录,退出--------------
        //登录
    getUserInfo:"select password,flag,token,head,userid from user where tele=?",
    updateToken:"UPDATE user set token=? where tele=?",
        //注册
    getUserId:"select userid from user where tele=?",
    insertUser:"insert into user(nickname,tele,password,created_at,token) values(?,?,?,?,?)",
        //记住密码登录
    getToken:"select token,head,userid from user where userid=?",
        //退出
    updateTokenByUserId:"UPDATE user set token=0 where userid=?",

    //---------------7天与30天------
    getTimeArtical:"SELECT blog.*,`user`.nickname AS author,`user`.head as head, category.categoryname, count(distinct `like`.like_id) as like_count,count(distinct `comment`.comment_id) as comment_count FROM blog LEFT JOIN `like` ON blog.blog_id = `like`.blog_id LEFT JOIN `category` ON blog.category_id = `category`.category_id LEFT JOIN `user` ON blog.user_id = `user`.userid LEFT JOIN `comment` ON blog.blog_id=`comment`.blog_id where blog.created_at >= DATE(NOW()) - INTERVAL ? DAY GROUP BY blog.blog_id ORDER BY blog.created_at asc limit ?,6",

    //-------------文章页----------
         //获取单个文章的信息
    getSingleArtical:"select a.size,IF(a.nickname is null,'雷锋',a.nickname) as nickname,a.blog_id as blog_id,a.title as title,a.blo_time as time,a.content as content,a.categoryname as categoryname,IF(a.head is null,'888888.jpg',a.head) as head,a.userid as userid,IF(com_like.com_num is null,0,com_like.com_num) as com_num,IF(com_like.lik_num is null,0,com_like.lik_num) as lik_num from(select blog_id,title,blo_cat.created_at as blo_time,content,categoryname,head,peo.userid as userid,peo.nickname as nickname,size from(select blog_id,title,created_at,content,categoryname,user_id,size from blog blo join category cat on blo.category_id=cat.category_id) blo_cat join user  peo on blo_cat.user_id=peo.userid) as a left join(select lik.blog_id as blog_id,lik.lik_num,com.com_num from(select count(*) as lik_num,blog_id from jianshu2.like GROUP BY blog_id) lik JOIN(select count(*) as com_num,blog_id from jianshu2.comment GROUP BY blog_id) com on lik.blog_id=com.blog_id) as com_like on a.blog_id=com_like.blog_id where a.blog_id=?",
    getSingleArticalUserIfo:"SELECT nickname,userid ,head,IF(introduce is null,'',introduce) as introduce,IF(fans_count is null,0,fans_count) as fans,sum(size) as size,sum(like_count) as lik_num FROM (SELECT `user`.userid,`user`.head, `user`.nickname,`user`.introduce,blog.blog_id,blog.size, count(distinct `like`.like_id) as like_count,COUNT(DISTINCT follow.follow_id) AS fans_count FROM blog LEFT JOIN `like` ON blog.blog_id = `like`.blog_id LEFT JOIN `user` ON blog.user_id = `user`.userid LEFT JOIN follow ON `user`.userid = `follow`.followed WHERE `user`.userid=(select user_id from blog where blog_id=?) GROUP BY blog.blog_id ,follow.followed ) p GROUP BY userid",
        //保存文章评论
    saveComment:"insert into jianshu2.comment(blog_id,user_id,content,commented_at) VALUES (?,?,?,?)",
        //获取文章的评论
    getSingleArticalComment:"SELECT `comment`.content,`comment`.user_id,`comment`.commented_at ,`user`.head,nickname,`comment`.comment_id FROM `comment` LEFT JOIN `user` ON `user`.userid=`comment`.user_id WHERE `comment`.blog_id=? order by `comment`.comment_id desc limit ?,10",

    insertIntoReport:"insert into report(id,report,blog_id,content,type) values(null,?,?,?,?)",

    //--------------专题页面------------------
    getArticalAlltheme:"select category.category_id,categoryname,head,introduce,count(blog.blog_id) as sum from category left join blog on category.category_id=blog.category_id group by category.category_id limit ?,15",

    // --------------写文章页--------------
    getEntiretheme:"select * from category",

    //-------------单个专题页面(目录)------
    getSingCategoryInfo:"select cat.*,count(cat.category_id) as sum from jianshu2.category cat left join blog blo on cat.category_id=blo.category_id where cat.category_id=? group by cat.category_id",

    //---------------推荐作者页面-------------
             //推荐作者，除掉自己已经关注过的<recommend-author>
    recommendAuthor:"SELECT nickname,IF(introduce is null,'...',introduce) as introduce,userid ,head,sum(size) as size,sum(like_count) as lik_num FROM (SELECT `user`.userid,`user`.head, `user`.nickname,`user`.introduce,blog.blog_id,blog.size, count(distinct `like`.like_id) as like_count FROM blog LEFT JOIN `like` ON blog.blog_id = `like`.blog_id LEFT JOIN `category` ON blog.category_id = `category`.category_id LEFT JOIN `user` ON blog.user_id = `user`.userid where `user`.userid not in( select followed from follow where following=? ) GROUP BY blog.blog_id) p GROUP BY userid limit ?,12",
            // 推荐所有作者,未登录的状态<recommend-author>
    recommendAllAuthor:"SELECT nickname,IF(introduce is null,'...',introduce) as introduce,userid ,head,sum(size) as size,sum(like_count) as lik_num FROM (SELECT `user`.userid,`user`.head, `user`.nickname,`user`.introduce,blog.blog_id,blog.size, count(distinct `like`.like_id) as like_count FROM blog LEFT JOIN `like` ON blog.blog_id = `like`.blog_id LEFT JOIN `category` ON blog.category_id = `category`.category_id LEFT JOIN `user` ON blog.user_id = `user`.userid GROUP BY blog.blog_id) p GROUP BY userid limit ?,12",

    //-----------------------个人中心--------------------
        //个人中心的关注查询,查询该用户关注的作者信息
    personalConcrenSearch:"SELECT nickname,userid ,head,IF(introduce is null,'',introduce) as introduce,IF(fans_count is null,0,fans_count) as fans,IF(sum(size) is null,0,sum(size)) as size,sum(like_count) as lik_num FROM (SELECT `user`.userid,`user`.head, `user`.nickname,`user`.introduce,blog.blog_id,blog.size, count(distinct `like`.like_id) as like_count,COUNT(DISTINCT follow.follow_id) AS fans_count FROM blog left JOIN `like` ON blog.blog_id = `like`.blog_id right JOIN `user` ON blog.user_id = `user`.userid LEFT JOIN follow ON `user`.userid = `follow`.followed WHERE `user`.userid in(select followed from follow where following=? ) GROUP BY blog.blog_id ,follow.followed ) p GROUP BY userid limit ?,8",

        //人中心喜欢文章的查询
    personalLikeArtical:"SELECT blog.*,`user`.nickname AS author,`user`.head as head, category.categoryname,count(distinct `like`.like_id) as like_count,COUNT(DISTINCT `comment`.comment_id) AS comment_count FROM blog LEFT JOIN `like` ON blog.blog_id = `like`.blog_id LEFT JOIN `category` ON blog.category_id = `category`.category_id LEFT JOIN `user` ON blog.user_id = `user`.userid LEFT JOIN `comment` ON `comment`.blog_id=blog.blog_id WHERE blog.blog_id in(select blog_id from jianshu2.like where user_id=?) GROUP BY blog.blog_id ,`comment`.blog_id order by blog_id limit ?,8",

    //获取个人中心的Blog
    getPersonCenterBlog:"SELECT blog.*,`user`.nickname AS author,`user`.head as head, category.categoryname,count(distinct `like`.like_id) as like_count,COUNT(DISTINCT `comment`.comment_id) AS comment_count FROM blog LEFT JOIN `like` ON blog.blog_id = `like`.blog_id LEFT JOIN `category` ON blog.category_id = `category`.category_id LEFT JOIN `user` ON blog.user_id = `user`.userid LEFT JOIN `comment` ON `comment`.blog_id=blog.blog_id WHERE `user`.userid=? GROUP BY blog.blog_id ,`comment`.blog_id limit ?,8",

    //个人中心个人的信息
    personalCenterUserInfo:"SELECT nickname,userid ,head,if(introduce is null,'......',introduce) as introduce,if(fans_count is null,'0',fans_count) as fans,sum(size) as size,sum(like_count) as lik_num,COUNT(DISTINCT blog_id) AS blog_count FROM(SELECT `user`.userid,`user`.head, `user`.nickname,`user`.introduce,blog.blog_id,blog.size,count(distinct `like`.like_id) as like_count,COUNT(DISTINCT follow.follow_id) AS fans_count FROM blog  JOIN `like` ON blog.blog_id = `like`.blog_id  right JOIN `user` ON blog.user_id = `user`.userid left JOIN follow ON `user`.userid = `follow`.followed WHERE `user`.userid=? GROUP BY blog.blog_id ,follow.followed) p GROUP BY userid",
    //"SELECT nickname,userid ,head,if(introduce is null,'......',introduce) as introduce,if(fans_count is null,'0',fans_count) as fans,sum(size) as size,sum(like_count) as lik_num  ,COUNT(DISTINCT blog_id) AS blog_count FROM(SELECT `user`.userid,`user`.head, `user`.nickname,`user`.introduce,blog.blog_id,blog.size,count(distinct `like`.like_id) as like_count,COUNT(DISTINCT follow.follow_id) AS fans_count FROM blog LEFT JOIN `like` ON blog.blog_id = `like`.blog_id LEFT JOIN `user` ON blog.user_id = `user`.userid LEFT JOIN follow ON `user`.userid = `follow`.followed WHERE `user`.userid=? GROUP BY blog.blog_id ,follow.followed) p GROUP BY userid",
    //"SELECT nickname,userid ,head,if(introduce is null,'......',introduce) as introduce,if(fans_count is null,'0',fans_count) as fans,sum(size) as size,sum(like_count) as lik_num  ,COUNT(DISTINCT blog_id) AS blog_count FROM(SELECT `user`.userid,`user`.head, `user`.nickname,`user`.introduce,blog.blog_id,blog.size,count(distinct `like`.like_id) as like_count,COUNT(DISTINCT follow.follow_id) AS fans_count FROM blog LEFT JOIN `like` ON blog.blog_id = `like`.blog_id LEFT JOIN `user` ON blog.user_id = `user`.userid LEFT JOIN follow ON `user`.userid = `follow`.followed WHERE `user`.userid=? GROUP BY blog.blog_id ,follow.followed) p GROUP BY userid " ,


         //获取个人关注的作者
    getConcrenAuthor:"SELECT `user`.userid,`user`.head,`user`.nickname FROM `user` WHERE `user`.userid IN (SELECT `follow`.followed FROM `user` LEFT JOIN `follow` ON `user`.userid = `follow`.following WHERE `user`.tele = ? GROUP BY `follow`.followed)",

    //----------------管理页---------------
    getBlogCheck:"select * from blogcheck order by blog_id asc limit ?,10",
    insetIntogetBlogCheck:"insert into blogcheck(blog_id,title,content,user_id,created_at,category_id,size) values(null,?,?,?,?,?,?)",
    saveArtical:"insert into blog(blog_id,title,content,user_id,created_at,category_id,size) values(null,?,?,?,?,?,?)",
    saveInform:"insert into inform(id,userid,content,time) values(null,?,?,?)",
    delBlogCheck:"delete from blogcheck where blog_id=?",
    selectAllCategory:"select * from category",
    getUserInfoByUserId:"select password,flag,token from user where userid=?",
        //目录图片的上传
    selectCategoryHead:"select head from category where category_id=?",
    //------------------------------个人管理页----------------
        //完善用户信息
    updateUserInfo:'update user set nickname=?,email=?,introduce=?,sex=?,weburl=? where userid=?',
        //获取用户信息
    getSomeUserInfo:'select nickname,email,introduce,sex,weburl from user where userid=?',
        //查询头像
    selectHeader:"select head from user where userid=?",
        //保存头像
    insertHead:"update user set head=? where userid=?",
        //添加目录
    insertIntoCategory:"insert into category(category_id,categoryname,introduce,head) values(null,?,?,'888888.jpg')",
        //更新目录
    updateCategory:"update category set categoryname=?,introduce=? where category_id=?",
        //查询举报
    selectReport:'select * from report order by id limit ?,15',
        //删除举报
    deleteReport:"delete from report from report where id=?",
        //添加留言
    insertIntoNote:"insert into note(id,note,noted,content,time) values(null,?,?,?,?)",
        //查询举报文章的标题
    selectReportTitle:'select title,report from report as rep join  blog as blo on blo.blog_id=rep.blog_id where rep.id=?',



};
module.exports=sql;