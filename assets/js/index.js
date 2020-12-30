$(function () {
    getUserInfo();
    $('#btnLogout').click(function () {
        layer.confirm(
            '确认退出登录？',
            { icon: 3, title: '提示' },
            function (index) {
                localStorage.removeItem('token');
                location.href = '/login.html';
                layer.close(index)
              }
        )
      })
});

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization:localStorage.getItem('token')
        // },
        success: function (res) {
            if (res.status !== 0) {
                layui.layer.msg(res.message);
                return;
            }
            renderAvatar(res.data)
        },
        error(err) { },
        // complete: function (res) {
        //     if (
        //         res.responseJSON.status === 1 &&
        //         res.responseJSON.message ==='身份认证失败！'
        //     ) {
        //         localStorage.removeItem('token');
        //         location.href='/login.html'
        //     }
        //   }
    })
}
// 渲染用户的头像
function renderAvatar(user) {
    // 获取用户信息
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;'+name)
    if (user.user_pic) {
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('.text-avatar').hide();
    } else {
        let first = name[0].toUpperCase();
        $('.layui-nav-img').hide();
        $('.text-avatar').html(first).show
    }
}