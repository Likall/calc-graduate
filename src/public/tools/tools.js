function deepClone(obj)
{
    var result = typeof obj.splice === 'function' ? [] : {};
    var key;
    if (obj && typeof obj === 'object')
    {
        for (key in obj)
        {
            if (obj[key] && typeof obj[key] === 'object')
            {
                result[key] = deepClone(obj[key]); // 如果对象的属性值为object的时候，递归调用deepClone，即再把某个值对象复制一份到新的对象的对应值中
            }
            else
            {
                result[key] = obj[key]; // 如果对象的属性值不为object的时候，直接复制参数对象的每一个键/值到新对象对应的键/值中
            }
        }
        return result;
    }
    return obj;
}

function getCookie(name)
{
    var strcookie = document.cookie;//获取cookie字符串
    var arrcookie = strcookie.split("; ");//分割
    //遍历匹配
    for (var i = 0; i < arrcookie.length; i++)
    {
        var arr = arrcookie[i].split("=");
        if (arr[0] == name)
        {
            return arr[1];
        }
    }
    return "";
}

function dateFtt(fmt, datestr)
{ //author: meizz
    if (typeof datestr === 'undefined' || datestr === '' || datestr === null)
    {
        return '';
    }
    let date = new Date(datestr);
    var o = {
        "M+": date.getMonth() + 1,                 //月份
        "d+": date.getDate(),                    //日
        "h+": date.getHours(),                   //小时
        "m+": date.getMinutes(),                 //分
        "s+": date.getSeconds(),                 //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
export default {
    deepClone: deepClone,
    getCookie: getCookie,
    dateFtt: dateFtt
}