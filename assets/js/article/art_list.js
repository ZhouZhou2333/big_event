$(function () {
    let layer = layui.layer;
    let form = layui.form;
    let laypage = layui.laypage;
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    template.defaults.imports.dataFormat = function (val) {
        const dt = new Date(val);
        const y = dt.getFullYear();
        const m = dt.getMonth() + 1;
        const d = dt.getDate();

        const hh = dt.getHours();
        const mm = dt.getMinutes();
        const ss = dt.getSeconds();
        return `${y}-${m}-${d}  ${hh}:${mm}:${ss}`;
    }

    initTable();
    initCate();
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                }
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                renderPage(res.total)
            }
        })
    }
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr)
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }
    $('#form-search').on('submit', function (e) {
        e.preventDafult();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();

        q.cate_id = cate_id;
        q.state = state;
        initTable()
    })
    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total,// 总数据条数
            limit: q.pagesize,// 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits:[2,3,5,10],
            jump(obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
            }
        })
    }

    $('tbody').on('click', '.btn-delete', function () {
        var len = $('.btn-delete').length;
        console.log(len);
        var id = $(this).data('id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
              method: 'GET',
              url: '/my/article/delete/' + id,
              success: function(res) {
                if (res.status !== 0) {
                  return layer.msg('删除文章失败！')
                }
                  layer.msg('删除文章成功！')
                //   if (len == 1) {
                //       q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1;
                // }
                  if (len == 1 && q.pagenum !== 1) {
                      q.pagenum--;
                  }
                initTable()
              }
            })
            layer.close(index)
          })

    })
});