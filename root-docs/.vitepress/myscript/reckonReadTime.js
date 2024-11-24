// 去除文章中的无关字符
const removeExtraContent = (content) => {
    // 移除标签代码
    content = content.replace(/<[^>]+>/g, "");
    // 移除标点符号
    content = content.replace(/[`:_.~!@#$%^&*() \+ =<>?"{}|, \/ ;' \\ [ \] ·~！@#￥%……&*（）—— \+ ={}|《》？：“”【】、；‘’，。、]/g,
        '');
    return content
}

// 统计图片数量
const countCharUsingRegex = (str, charToCount) => {
    const regex = new RegExp(charToCount, 'g');
    const matches = str.match(regex);
    return matches ? matches.length : 0;
}


// 获取文章的阅读时长
export const reckonReadTime = (content) => {
    // 1. 统计文章的实际字数
    // 截取文章的头部信息
    let zoend = content.indexOf('zoend')
    // 判断是否存在头部信息
    if (zoend == -1) {
        // 不存在直接处理文章
        content = removeExtraContent(content)

    } else {
        // 若是存在，从 zoend 截取，先剔除头部信息
        content = content.slice(zoend + 20)
        // 再处理文章
        content = removeExtraContent(content)
    }
    // 2. 开始统计文章的时长

    // 获取正文内容长度
    let wordcount = content.length
    // 给图片追加长度
    let pngtime = countCharUsingRegex(content, '.png')

    wordcount = wordcount + (pngtime * 150)

    // 人的阅读速度是300 - 500字 / 分钟
    // 计算阅读时间
    let readTime = wordcount / 400;
    // 取整：四舍五入
    readTime = Math.round(readTime);
    // 大于 1 分钟时
    if (readTime > 1) {
        return readTime
    } else {
        // 不足一分钟视为一分钟
        return 1
    }

}
