$(function () {
    $('#link_reg').on('click', function () {
        $('.reg-box').show();
        $('.login-box').hide();
    })
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    // 获取layui对象
    var form = layui.form;
    var layer = layui.layer;
    // 解构方式
    // var {form,layer} = layui;
    form.verify({
        // 自定义校验规则 \S
        pwd: [/^[\S]{6,12}$/, '密码必须6-12位，不能包含空格'],
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            let pwd = $('.reg-box [name=password]').val()
            // 判断两次密码是否一致，不一致则返回提示信息
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    // 给注册表单设置监听事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            url: 'http://ajax.frontend.itheima.net/api/reguser',
            method: 'POST',
            data: {
                username:$('#form_reg [name=username]').val(),
                password:$('#form_reg [name=password]').val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message || '注册失败')
                    return;
                }
                layer.msg(res.message || '注册成功');
                $('#link_login').click();
            }
        })
    })

    // 给登录表单添加提交监听事件
    $('#form_login').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: 'http://ajax.frontend.itheima.net/api/login',
            method: 'POST',
            //快速获得表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message || '登录失败')
                }
                layer.msg(res.message || '登录成功')
                localStorage.setItem('token', res.token)
                // 跳转到后台 
                location.href='/index.html'

            }
        })
    })
});