$(function () {
    let layer = layui.layer;
    let form = layui.form;
    initArtcateList()
    function initArtcateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
              }
        })
    }
    let indexAdd = null;
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content:$('#dialog-add').html(),
        })
    })
    
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加信息失败！')
                }
                initArtcateList();
                layer.msg('添加信息成功！')
                layer.close(indexAdd)
              }
        })
    })
    // 通过代理的形式,为了btn-edit按钮绑定点击事件
    let indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        const id = $(this).data('id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/'+id,
            success: function (res) {
                form.val('form-edit',res.data)
              }
        })
    })
    
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        console.log($(this).serialize());
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！');
                }

                layer.msg('更新分类数据成功！');
                layer.close(indexEdit);
                initArtcateList();
              }
        })
    })
    
    // 通过代理方式绑定点击事件
    // $('tbody').on('click', '.btn-delete', function () {
    //     var id = $(this).data('id');
    //     layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
    //         $.ajax({
    //             method: 'GET',
    //             url: '/my/article/delete/' + id,
    //             success: function (res) {
    //                 if (res.status !== 0) {
    //                     return layer.msg('删除文章失败！')
    //                 }
    //                 layer.msg('删除文章成功！')
    //                 layer.close(index)
    //                 initTable()
    //             }
    //         })
    //     })
    // })
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
          $.ajax({
            method: 'GET',
            url: '/my/article/deletecate/' + id,
            success: function(res) {
              if (res.status !== 0) {
                return layer.msg('删除分类失败！')
              }
              layer.msg('删除分类成功！')
                layer.close(index);
                initArtcateList()
            }
          })
        })
    })
});