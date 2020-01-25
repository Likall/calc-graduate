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
export default {
    deepClone: deepClone,
    getCookie: getCookie
}